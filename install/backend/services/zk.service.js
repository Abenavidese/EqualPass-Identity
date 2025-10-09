const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const config = require('../config/app');

class ZKService {
  constructor() {
    this.circuitsDir = path.join(__dirname, '..', config.CIRCUITS_DIR);
    this.vkeyPath = path.join(this.circuitsDir, config.VKEY_FILE);
  }

  // Ejecutar comando snarkjs
  runSnarkjs(args) {
    const localBin = process.platform === 'win32'
      ? path.join(__dirname, '..', 'node_modules', '.bin', 'snarkjs.cmd')
      : path.join(__dirname, '..', 'node_modules', '.bin', 'snarkjs');

    const useLocal = fs.existsSync(localBin);
    const cmdStr = useLocal
      ? `"${localBin.replace(/"/g, '\\"')}" ${args.map(a => `"${String(a).replace(/"/g, '\\"')}"`).join(' ')}`
      : `npx snarkjs ${args.map(a => `"${String(a).replace(/"/g, '\\"')}"`).join(' ')}`;

    console.log('RUN SNARKJS CMD:', cmdStr);
    
    const res = spawnSync(cmdStr, {
      cwd: this.circuitsDir,
      encoding: 'utf8',
      timeout: 5 * 60 * 1000,
      shell: true
    });

    if (res.error) {
      throw res.error;
    }
    
    if (res.status !== 0) {
      throw new Error(res.stderr || res.stdout || `snarkjs failed with status ${res.status}`);
    }
    
    return res.stdout;
  }

  // Generar prueba ZK
  async generateProof(input) {
    try {
      const inputPath = path.join(this.circuitsDir, 'input.json');
      fs.writeFileSync(inputPath, JSON.stringify(input));

      // Calcular witness
      this.runSnarkjs(['wtns', 'calculate', config.WASM_FILE, 'input.json', 'witness.wtns']);
      
      // Generar prueba
      this.runSnarkjs(['groth16', 'prove', config.ZKEY_FILE, 'witness.wtns', 'proof.json', 'public.json']);

      // Leer resultados
      const proof = JSON.parse(fs.readFileSync(path.join(this.circuitsDir, 'proof.json'), 'utf8'));
      const publicSignals = JSON.parse(fs.readFileSync(path.join(this.circuitsDir, 'public.json'), 'utf8'));

      return { proof, publicSignals };
    } catch (error) {
      throw new Error(`Error generando prueba ZK: ${error.message}`);
    }
  }

  // Verificar prueba ZK
  async verifyProof(proof, publicSignals) {
    try {
      // Escribir archivos temporales
      fs.writeFileSync(path.join(this.circuitsDir, 'proof.json'), JSON.stringify(proof));
      fs.writeFileSync(path.join(this.circuitsDir, 'public.json'), JSON.stringify(publicSignals));
      
      // Verificar
      const output = this.runSnarkjs(['groth16', 'verify', this.vkeyPath, 'public.json', 'proof.json']);
      
      return output && output.includes('OK');
    } catch (error) {
      throw new Error(`Error verificando prueba ZK: ${error.message}`);
    }
  }

  // Verificar elegibilidad desde public signals
  isEligible(publicSignals) {
    return publicSignals[0] === "1" || publicSignals[0] === 1;
  }

  // Procesar input completo: generar + verificar
  async processStudentVerification(studentData) {
    const { studentStatus, enrollmentYear, universityHash, userSecret } = studentData;
    
    // Generar prueba
    const { proof, publicSignals } = await this.generateProof({
      studentStatus,
      enrollmentYear,
      universityHash,
      userSecret
    });

    // Verificar prueba
    const verified = await this.verifyProof(proof, publicSignals);
    
    if (!verified) {
      throw new Error('Prueba ZK inválida');
    }

    // Verificar elegibilidad
    const eligible = this.isEligible(publicSignals);
    
    if (!eligible) {
      throw new Error('No elegible para badge de estudiante');
    }

    return { proof, publicSignals, verified, eligible };
  }
}

module.exports = ZKService;