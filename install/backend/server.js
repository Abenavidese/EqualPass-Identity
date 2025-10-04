const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// simple request logger
app.use((req, res, next) => {
  // Minimal request logging: method, url and content-type only.
  // Avoid logging request bodies (may contain sensitive proofs/inputs).
  console.log('>>> REQ:', req.method, req.originalUrl, 'Content-Type:', req.headers['content-type'] || 'none');
  next();
});

app.get('/', (req, res) => {
  res.send('Backend de EqualPass está funcionando!');
});

// contract-info: try standard artifact names
app.get('/api/contract-info', (req, res) => {
  try {
    const candidates = [
      path.resolve(__dirname, '..', 'contracts', 'artifacts-pvm', 'contracts', 'EqualPassIdentityBadge.sol', 'EqualPassIdentityBadge.json'),
      path.resolve(__dirname, '..', 'contracts', 'artifacts-pvm', 'contracts', 'EqualPassIdentityBadge.sol', 'AccessControl.json'),
    ];
    const artifactPath = candidates.find(p => fs.existsSync(p));
    if (!artifactPath) return res.status(404).json({ error: 'Artifact not found', tried: candidates });

    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const abi = artifact.abi || null;

    let address = process.env.CONTRACT_ADDRESS || null;
    if (!address) {
      if (artifact.address) address = artifact.address;
      else if (artifact.networks && Object.keys(artifact.networks || {}).length) {
        const first = artifact.networks[Object.keys(artifact.networks)[0]];
        if (first && first.address) address = first.address;
      }
    }

    return res.json({ abi, address });
  } catch (err) {
    console.error('contract-info error:', err);
    return res.status(500).json({ error: 'Failed to read artifact', details: err.message });
  }
});

const circuitsDir = path.join(__dirname, 'circuits');
const vkeyPath = path.join(circuitsDir, 'verification_key.json');

function runSnarkjs(args) {
  const localBin = process.platform === 'win32'
    ? path.join(__dirname, 'node_modules', '.bin', 'snarkjs.cmd')
    : path.join(__dirname, 'node_modules', '.bin', 'snarkjs');

  const useLocal = fs.existsSync(localBin);
  // construir comando como string para shell
  const cmdStr = useLocal
    ? `"${localBin.replace(/"/g, '\\"')}" ${args.map(a => `"${String(a).replace(/"/g, '\\"')}"`).join(' ')}`
    : `npx snarkjs ${args.map(a => `"${String(a).replace(/"/g, '\\"')}"`).join(' ')}`;

  console.log('RUN SNARKJS CMD:', cmdStr);
  const res = spawnSync(cmdStr, {
    cwd: circuitsDir,
    encoding: 'utf8',
    timeout: 5 * 60 * 1000,
    shell: true
  });

  console.log('SNARKJS exitStatus=', res && res.status);
  if (res && res.error) {
    console.error('SNARKJS error:', res.error);
    throw res.error;
  }
  if (!res || res.status !== 0) {
    console.error('SNARKJS stderr:', res && res.stderr);
    console.error('SNARKJS stdout:', res && res.stdout);
    throw new Error((res && (res.stderr || res.stdout)) || `snarkjs failed with status ${res && res.status}`);
  }
  return res.stdout;
}

app.post('/api/generate-proof', async (req, res) => {
  console.log('/api/generate-proof called');
  try {
    const input = req.body || {};
    const inputPath = path.join(circuitsDir, 'input.json');
    fs.writeFileSync(inputPath, JSON.stringify(input));
    console.log('Wrote input.json');

    const wasmRel = path.join('eligibility_student_js', 'eligibility_student.wasm');
    console.log('Calculating witness...');
    runSnarkjs(['wtns', 'calculate', wasmRel, 'input.json', 'witness.wtns']);
    console.log('Witness created');

    console.log('Generating proof...');
    runSnarkjs(['groth16', 'prove', 'eligibility_student.zkey', 'witness.wtns', 'proof.json', 'public.json']);
    console.log('Proof generated');

    const proof = JSON.parse(fs.readFileSync(path.join(circuitsDir, 'proof.json'), 'utf8'));
    const publicSignals = JSON.parse(fs.readFileSync(path.join(circuitsDir, 'public.json'), 'utf8'));

    res.json({ proof, publicSignals });
  } catch (err) {
    console.error('generate-proof error:', err);
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/verify-proof', async (req, res) => {
  try {
    const { proof, publicSignals } = req.body || {};
    if (!proof || (publicSignals === undefined || publicSignals === null)) return res.status(400).json({ error: 'proof and publicSignals required' });

    // Normalize publicSignals into a plain array that snarkjs expects.
    let normalizedPublic;
    if (Array.isArray(publicSignals)) {
      normalizedPublic = publicSignals;
    } else if (publicSignals && typeof publicSignals === 'object') {
      // Common PowerShell serialization: { value: [...], Count: N }
      if (Array.isArray(publicSignals.value)) {
        normalizedPublic = publicSignals.value;
      } else {
        // Check for numeric keys like { '0': 'a', '1': 'b' }
        const numericKeys = Object.keys(publicSignals).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
        if (numericKeys.length) {
          normalizedPublic = numericKeys.map(k => publicSignals[k]);
        } else {
          // Fallback: take object values except possible Count property
          normalizedPublic = Object.keys(publicSignals)
            .filter(k => k !== 'Count')
            .map(k => publicSignals[k]);
        }
      }
    } else {
      // single scalar => wrap in array
      normalizedPublic = [publicSignals];
    }

    fs.writeFileSync(path.join(circuitsDir, 'public.json'), JSON.stringify(normalizedPublic));
    fs.writeFileSync(path.join(circuitsDir, 'proof.json'), JSON.stringify(proof));
    const out = runSnarkjs(['groth16', 'verify', vkeyPath, 'public.json', 'proof.json']);
    const verified = out && out.includes('OK');
    res.json({ verified, stdout: out });
  } catch (err) {
    console.error('verify-proof error:', err);
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});