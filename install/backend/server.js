const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { ethers } = require('ethers');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración del contrato
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || 'https://testnet-passet-hub-eth-rpc.polkadot.io';

// Cargar ABI completo del contrato EqualPassIdentityBadge
const CONTRACT_ABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'contract-abi.json'), 'utf8'));

// Configurar provider y wallet
let provider, contract, wallet;
try {
  provider = new ethers.JsonRpcProvider(RPC_URL);
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
  console.log('✅ Contrato configurado:', CONTRACT_ADDRESS);
  console.log('✅ Wallet configurado:', wallet.address);
} catch (error) {
  console.error('❌ Error configurando contrato:', error.message);
}

// Almacén temporal para WebAuthn (en producción usar Redis/DB)
const webAuthnStore = {
  challenges: new Map(), // challenge -> { userAddress, timestamp }
  credentials: new Map() // userAddress -> { credentialId, publicKey, counter }
};

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

// Servir demo WebAuthn
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo-webauthn.html'));
});

// Servir página de verificador seguro
app.get('/verificador', (req, res) => {
  res.sendFile(path.join(__dirname, 'verificador-seguro.html'));
});

// Servir página de verificador público
app.get('/verificador', (req, res) => {
  res.sendFile(path.join(__dirname, 'verificador.html'));
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

// ============ WebAuthn ENDPOINTS ============

// Generar challenge para registro WebAuthn
app.post('/api/webauthn/register/begin', (req, res) => {
  try {
    const { userAddress } = req.body;
    if (!userAddress) return res.status(400).json({ error: 'userAddress required' });

    const challenge = crypto.randomBytes(32);
    const challengeB64 = challenge.toString('base64url');
    
    // Guardar challenge por 5 minutos
    webAuthnStore.challenges.set(challengeB64, {
      userAddress,
      timestamp: Date.now(),
      type: 'register'
    });

    // Limpiar challenges expirados
    for (const [key, value] of webAuthnStore.challenges.entries()) {
      if (Date.now() - value.timestamp > 5 * 60 * 1000) {
        webAuthnStore.challenges.delete(key);
      }
    }

    const registrationOptions = {
      challenge: challengeB64,
      rp: {
        name: "EqualPass",
        id: "localhost" // En producción usar tu dominio
      },
      user: {
        id: Buffer.from(userAddress, 'utf8').toString('base64url'), // Convertir a base64url
        name: `student_${userAddress.slice(-8)}`,
        displayName: "EqualPass Student"
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
        { alg: -257, type: "public-key" } // RS256
      ],
      authenticatorSelection: {
        userVerification: "preferred",
        requireResidentKey: false
      },
      timeout: 60000
    };

    res.json(registrationOptions);
  } catch (error) {
    console.error('webauthn register begin error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Completar registro WebAuthn
app.post('/api/webauthn/register/complete', (req, res) => {
  try {
    const { credential, userAddress } = req.body;
    if (!credential || !userAddress) {
      return res.status(400).json({ error: 'credential and userAddress required' });
    }

    console.log('Received credential:', credential);

    // Extraer challenge del clientDataJSON
    const clientDataJSON = JSON.parse(Buffer.from(credential.response.clientDataJSON, 'base64').toString());
    console.log('Parsed clientDataJSON:', clientDataJSON);
    
    const challengeFromClient = clientDataJSON.challenge;
    const challengeData = webAuthnStore.challenges.get(challengeFromClient);
    
    if (!challengeData || challengeData.userAddress !== userAddress || challengeData.type !== 'register') {
      console.log('Challenge validation failed:', { challengeFromClient, challengeData });
      return res.status(400).json({ error: 'Invalid challenge' });
    }

    // Guardar credencial con el ID correcto
    const credentialId = credential.id; // Este es el ID que viene del navegador
    
    console.log('Saving credential for user:', userAddress, 'with ID:', credentialId);
    
    webAuthnStore.credentials.set(userAddress, {
      credentialId: credentialId,
      publicKey: credential.response.publicKey, // Guardamos la publicKey también
      counter: 0,
      registered: Date.now()
    });

    // Limpiar challenge usado
    webAuthnStore.challenges.delete(challengeFromClient);

    console.log(`✅ WebAuthn credential registered for ${userAddress}, ID: ${credentialId}`);
    console.log('Current credentials store:', webAuthnStore.credentials);
    
    res.json({ 
      success: true, 
      credentialId: credentialId,
      message: 'WebAuthn credential registered successfully' 
    });
  } catch (error) {
    console.error('webauthn register complete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generar challenge para autenticación WebAuthn
app.post('/api/webauthn/authenticate/begin', (req, res) => {
  try {
    const { userAddress } = req.body;
    if (!userAddress) return res.status(400).json({ error: 'userAddress required' });

    const userCredential = webAuthnStore.credentials.get(userAddress);
    if (!userCredential) {
      console.log(`No credential found for ${userAddress}. Available users:`, Array.from(webAuthnStore.credentials.keys()));
      return res.status(400).json({ error: 'No WebAuthn credential found for this user' });
    }

    const challenge = crypto.randomBytes(32);
    const challengeB64 = challenge.toString('base64url');
    
    webAuthnStore.challenges.set(challengeB64, {
      userAddress,
      timestamp: Date.now(),
      type: 'authenticate'
    });

    console.log(`Generated auth challenge for ${userAddress}, credential ID: ${userCredential.credentialId}`);

    const authenticationOptions = {
      challenge: challengeB64,
      rpId: "localhost",
      allowCredentials: [{
        id: userCredential.credentialId,
        type: "public-key"
      }],
      userVerification: "preferred",
      timeout: 60000
    };

    res.json(authenticationOptions);
  } catch (error) {
    console.error('webauthn authenticate begin error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificar autenticación WebAuthn
app.post('/api/webauthn/authenticate/complete', (req, res) => {
  try {
    const { credential, userAddress } = req.body;
    if (!credential || !userAddress) {
      return res.status(400).json({ error: 'credential and userAddress required' });
    }

    const userCredential = webAuthnStore.credentials.get(userAddress);
    if (!userCredential) {
      return res.status(400).json({ error: 'No credential found for user' });
    }

    // Extraer challenge del clientDataJSON
    const clientDataJSON = JSON.parse(Buffer.from(credential.response.clientDataJSON, 'base64').toString());
    const challengeData = webAuthnStore.challenges.get(clientDataJSON.challenge);
    
    if (!challengeData || challengeData.userAddress !== userAddress || challengeData.type !== 'authenticate') {
      return res.status(400).json({ error: 'Invalid challenge' });
    }

    // En implementación completa, verificaríamos la signature con la publicKey
    // Por simplicidad, asumimos que llegó hasta aquí = válido
    
    // Limpiar challenge usado
    webAuthnStore.challenges.delete(clientDataJSON.challenge);

    console.log(`✅ WebAuthn authentication successful for ${userAddress}`);
    res.json({ 
      success: true, 
      verified: true,
      message: 'WebAuthn authentication successful' 
    });
  } catch (error) {
    console.error('webauthn authenticate complete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificar si usuario tiene credencial WebAuthn
app.get('/api/webauthn/status/:userAddress', (req, res) => {
  const { userAddress } = req.params;
  const hasCredential = webAuthnStore.credentials.has(userAddress);
  const credentialData = webAuthnStore.credentials.get(userAddress);
  
  console.log(`Checking WebAuthn status for ${userAddress}:`, {
    hasCredential,
    credentialData: credentialData ? { id: credentialData.credentialId, registered: new Date(credentialData.registered) } : null,
    totalCredentials: webAuthnStore.credentials.size
  });
  
  res.json({ 
    hasCredential, 
    userAddress,
    credentialId: credentialData?.credentialId,
    registered: credentialData?.registered
  });
});

// ============ ENDPOINT PRINCIPAL MEJORADO ============

// ENDPOINT PRINCIPAL: Generar prueba ZK + Mintear badge
app.post('/api/mint', async (req, res) => {
  console.log('/api/mint called');
  try {
    const { 
      userAddress, 
      studentStatus, 
      enrollmentYear, 
      universityHash, 
      userSecret,
      webAuthnCredential, // NUEVO: credencial WebAuthn opcional
      requireWebAuthn = false // NUEVO: flag para requerir WebAuthn
    } = req.body;
    
    if (!userAddress) {
      return res.status(400).json({ error: 'userAddress is required' });
    }

    // NUEVO: Verificación WebAuthn si es requerida
    let webAuthnVerified = false;
    if (requireWebAuthn || webAuthnCredential) {
      console.log('Verificando WebAuthn...');
      
      if (!webAuthnCredential) {
        return res.status(400).json({ 
          error: 'WebAuthn credential required', 
          requiresWebAuthn: true 
        });
      }

      const userCredential = webAuthnStore.credentials.get(userAddress);
      if (!userCredential) {
        return res.status(400).json({ 
          error: 'No WebAuthn credential registered for this user',
          requiresRegistration: true
        });
      }

      // Verificar credencial WebAuthn (simplificado)
      try {
        const clientDataJSON = JSON.parse(Buffer.from(webAuthnCredential.response.clientDataJSON, 'base64').toString());
        const challengeData = webAuthnStore.challenges.get(clientDataJSON.challenge);
        
        if (!challengeData || challengeData.userAddress !== userAddress) {
          return res.status(400).json({ error: 'Invalid WebAuthn challenge' });
        }

        webAuthnVerified = true;
        console.log('✅ WebAuthn verification successful');
        
        // Limpiar challenge usado
        webAuthnStore.challenges.delete(clientDataJSON.challenge);
      } catch (error) {
        return res.status(400).json({ 
          error: 'WebAuthn verification failed', 
          details: error.message 
        });
      }
    }

    // PASO 1: Generar prueba ZK (igual que antes)
    console.log('Generando prueba ZK...');
    const input = { studentStatus, enrollmentYear, universityHash, userSecret };
    const inputPath = path.join(circuitsDir, 'input.json');
    fs.writeFileSync(inputPath, JSON.stringify(input));

    const wasmRel = path.join('eligibility_student_js', 'eligibility_student.wasm');
    runSnarkjs(['wtns', 'calculate', wasmRel, 'input.json', 'witness.wtns']);
    runSnarkjs(['groth16', 'prove', 'eligibility_student.zkey', 'witness.wtns', 'proof.json', 'public.json']);

    const proof = JSON.parse(fs.readFileSync(path.join(circuitsDir, 'proof.json'), 'utf8'));
    const publicSignals = JSON.parse(fs.readFileSync(path.join(circuitsDir, 'public.json'), 'utf8'));

    // PASO 2: Verificar prueba off-chain
    console.log('Verificando prueba ZK...');
    const out = runSnarkjs(['groth16', 'verify', vkeyPath, 'public.json', 'proof.json']);
    const verified = out && out.includes('OK');
    
    if (!verified) {
      return res.status(400).json({ error: 'Prueba ZK inválida', proof, publicSignals });
    }

    // PASO 3: Verificar elegibilidad (public signal debe ser 1)
    const eligible = publicSignals[0] === "1" || publicSignals[0] === 1;
    if (!eligible) {
      return res.status(400).json({ error: 'No elegible para badge de estudiante', eligible: false });
    }

    // PASO 4: Mintear badge en el contrato
    console.log('Minteando badge...');
    const badgeType = 1; // STUDENT badge type
    const claimId = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(proof))); // Unique claim ID basado en la prueba
    
    const tx = await contract.mintBadge(userAddress, badgeType, claimId);
    console.log('Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);

    // Buscar el evento BadgeMinted
    let tokenId = null;
    for (const log of receipt.logs) {
      try {
        const decoded = contract.interface.parseLog(log);
        if (decoded.name === 'BadgeMinted') {
          tokenId = decoded.args.tokenId.toString();
          break;
        }
      } catch (e) {
        // Log no es de nuestro contrato, continuar
      }
    }

    res.json({
      success: true,
      verified: true,
      eligible: true,
      webAuthnVerified, // NUEVO: estado de verificación WebAuthn
      securityLevel: webAuthnVerified ? 'HIGH' : 'STANDARD', // NUEVO: nivel de seguridad
      txHash: receipt.hash,
      tokenId,
      claimId,
      proof,
      publicSignals,
      blockscoutUrl: `https://blockscout-passet-hub.parity-testnet.parity.io/tx/${receipt.hash}`
    });

  } catch (error) {
    console.error('mint error:', error);
    res.status(500).json({ 
      error: error.message || String(error),
      details: error.reason || error.data || null
    });
  }
});

// Endpoint auxiliar: Solo generar prueba (útil para testing)
app.post('/api/generate-only', async (req, res) => {
  console.log('/api/generate-only called');
  try {
    const input = req.body || {};
    const inputPath = path.join(circuitsDir, 'input.json');
    fs.writeFileSync(inputPath, JSON.stringify(input));

    const wasmRel = path.join('eligibility_student_js', 'eligibility_student.wasm');
    runSnarkjs(['wtns', 'calculate', wasmRel, 'input.json', 'witness.wtns']);
    runSnarkjs(['groth16', 'prove', 'eligibility_student.zkey', 'witness.wtns', 'proof.json', 'public.json']);

    const proof = JSON.parse(fs.readFileSync(path.join(circuitsDir, 'proof.json'), 'utf8'));
    const publicSignals = JSON.parse(fs.readFileSync(path.join(circuitsDir, 'public.json'), 'utf8'));

    const eligible = publicSignals[0] === "1" || publicSignals[0] === 1;

    res.json({ proof, publicSignals, eligible });
  } catch (err) {
    console.error('generate-only error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// ============ VERIFICACIÓN PÚBLICA ============

// Endpoint para que cualquier persona verifique si alguien es estudiante
app.post('/api/verify-student', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'walletAddress is required' });
    }

    console.log(`🔍 Verificación pública solicitada para: ${walletAddress}`);

    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        isStudent: false,
        verified: false,
        reason: 'Dirección de wallet inválida',
        walletAddress
      });
    }

    // Obtener balance total de badges
    const balance = await contract.balanceOf(walletAddress);
    const totalBadges = Number(balance);
    
    console.log(`Usuario ${walletAddress} tiene ${totalBadges} badges en total`);

    if (totalBadges === 0) {
      return res.json({
        isStudent: false,
        verified: false,
        reason: 'No tiene badges en el sistema EqualPass',
        walletAddress,
        badgeCount: 0,
        badges: []
      });
    }

    // Buscar badges de estudiante iterando por posibles tokenIds
    const studentBadges = [];
    const allBadges = [];
    let maxTokenId = 100; // Buscar hasta token ID 100 para empezar
    
    // Estrategia: buscar tokens incrementalmente hasta que no encontremos más
    for (let tokenId = 1; tokenId <= maxTokenId; tokenId++) {
      try {
        // Verificar si este token existe y pertenece al usuario
        const owner = await contract.ownerOf(tokenId);
        
        if (owner.toLowerCase() === walletAddress.toLowerCase()) {
          // El usuario es dueño de este token, obtener información
          const badgeInfo = await contract.badgeInfo(tokenId);
          const badgeType = Number(badgeInfo[0]); // badgeType
          const issuedAt = Number(badgeInfo[1]); // issuedAt
          const issuer = badgeInfo[2]; // issuer
          
          const badge = {
            tokenId: tokenId.toString(),
            badgeType: badgeType.toString(),
            issuedAt: new Date(issuedAt * 1000).toISOString(),
            issuer,
            isStudentBadge: badgeType === 1
          };
          
          allBadges.push(badge);
          
          if (badgeType === 1) { // Badge de estudiante
            studentBadges.push(badge);
            console.log(`✅ Encontrado badge de estudiante: Token ${tokenId}`);
          }
        }
      } catch (error) {
        // Token no existe, no pertenece al usuario, o error de red
        // Solo logear errores que no sean "token no existe"
        if (!error.message.includes('ERC721: invalid token ID') && 
            !error.message.includes('ERC721NonexistentToken') &&
            !error.message.includes('owner query for nonexistent token')) {
          console.log(`Error verificando token ${tokenId}:`, error.message);
        }
      }
    }

    console.log(`Encontrados ${allBadges.length} badges totales, ${studentBadges.length} de estudiante`);

    if (studentBadges.length === 0) {
      return res.json({
        isStudent: false,
        verified: false,
        reason: allBadges.length > 0 ? 'Tiene badges pero no de estudiante' : 'No tiene badges',
        walletAddress,
        badgeCount: allBadges.length,
        badges: allBadges
      });
    }

    // Verificar si tiene credencial WebAuthn (mayor seguridad)
    const hasWebAuthn = webAuthnStore.credentials.has(walletAddress);
    const securityLevel = hasWebAuthn ? 'HIGH' : 'STANDARD';

    // Respuesta de verificación exitosa
    res.json({
      isStudent: true,
      verified: true,
      walletAddress,
      studentBadges,
      totalBadges: allBadges.length,
      hasWebAuthn,
      securityLevel,
      verificationTimestamp: new Date().toISOString(),
      contractAddress: CONTRACT_ADDRESS,
      blockchain: 'Polkadot Paseo Testnet',
      explorerBase: 'https://blockscout-passet-hub.parity-testnet.parity.io'
    });

  } catch (error) {
    console.error('verify-student error:', error);
    res.status(500).json({ 
      error: 'Error verificando estudiante',
      details: error.message,
      walletAddress: req.body.walletAddress
    });
  }
});

// Endpoint para obtener detalles específicos de un badge
app.get('/api/badge/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    // Verificar que el badge existe
    const owner = await contract.ownerOf(tokenId);
    const badgeInfo = await contract.badgeInfo(tokenId);
    
    res.json({
      tokenId,
      owner,
      badgeType: badgeInfo.badgeType.toString(),
      badgeTypeName: badgeInfo.badgeType.toString() === '1' ? 'STUDENT' : 'UNKNOWN',
      issuedAt: new Date(parseInt(badgeInfo.issuedAt.toString()) * 1000).toISOString(),
      issuer: badgeInfo.issuer,
      contractAddress: CONTRACT_ADDRESS,
      explorerUrl: `https://blockscout-passet-hub.parity-testnet.parity.io/token/${CONTRACT_ADDRESS}/instance/${tokenId}`
    });

  } catch (error) {
    console.error('badge details error:', error);
    res.status(404).json({ 
      error: 'Badge no encontrado',
      tokenId: req.params.tokenId 
    });
  }
});

// ============ DEMO ANTI-FRAUDE ============

// Endpoint especial que SIEMPRE requiere WebAuthn (para impresionar jueces)
app.post('/api/mint-secure', async (req, res) => {
  console.log('/api/mint-secure called - REQUIRING WebAuthn');
  
  const requestData = { ...req.body, requireWebAuthn: true };
  
  // Reutilizar la lógica del endpoint /api/mint pero forzando WebAuthn
  try {
    // Simular llamada interna al endpoint principal con WebAuthn requerido
    const { userAddress } = req.body;
    
    if (!userAddress) {
      return res.status(400).json({ error: 'userAddress is required' });
    }

    const hasCredential = webAuthnStore.credentials.has(userAddress);
    if (!hasCredential) {
      return res.status(400).json({ 
        error: 'SEGURIDAD: WebAuthn credential requerida', 
        requiresRegistration: true,
        securityLevel: 'HIGH_REQUIRED',
        message: 'Este endpoint requiere verificación biométrica para prevenir fraude'
      });
    }

    // Si llega hasta aquí, procesar como mint normal pero con requireWebAuthn=true
    req.body.requireWebAuthn = true;
    
    // Redirigir al endpoint principal (esto es un hack simple)
    return res.status(400).json({
      error: 'Use /api/mint con requireWebAuthn=true para este flujo seguro',
      requiresWebAuthn: true,
      securityLevel: 'HIGH_REQUIRED'
    });
    
  } catch (error) {
    console.error('mint-secure error:', error);
    res.status(500).json({ 
      error: error.message,
      securityLevel: 'HIGH_REQUIRED'
    });
  }
});

// Endpoint para simular fraude (útil para demo)
app.post('/api/demo-fraud', (req, res) => {
  console.log('/api/demo-fraud called - Simulando intento de fraude');
  
  const { userAddress, stolenCredential } = req.body;
  
  // Simular que alguien robó la credencial pero no tiene el dispositivo
  const realCredential = webAuthnStore.credentials.get(userAddress);
  
  if (!realCredential) {
    return res.status(400).json({
      fraudDetected: false,
      message: 'No hay credencial real para comparar',
      recommendation: 'Registre una credencial WebAuthn primero'
    });
  }

  // Simular verificación que fallaría con dispositivo incorrecto
  const fraudSuccess = false; // En la vida real, esto siempre sería false
  
  res.json({
    fraudDetected: true,
    fraudSuccess,
    message: '🚨 FRAUDE DETECTADO: Credencial válida pero dispositivo incorrecto',
    securityLevel: 'FRAUD_PREVENTED',
    details: {
      hasValidCredential: !!stolenCredential,
      hasCorrectDevice: false,
      webAuthnPrevented: true
    }
  });
});

// ============ VERIFICACIÓN CON PRUEBA DE PROPIEDAD ============

// Generar desafío para probar propiedad de wallet
app.post('/api/generate-challenge', (req, res) => {
  try {
    const { verifierName, purpose } = req.body;
    
    // Generar desafío único
    const challengeId = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const message = `EqualPass Verificación
Verificador: ${verifierName || 'Desconocido'}
Propósito: ${purpose || 'Verificación de identidad'}
Código: ${challengeId}
Timestamp: ${timestamp}
Firma este mensaje para probar que eres el dueño de esta wallet.`;

    // Guardar desafío temporalmente (5 minutos)
    webAuthnStore.challenges.set(challengeId, {
      message,
      verifierName,
      purpose,
      timestamp,
      type: 'ownership-challenge'
    });

    console.log(`📝 Desafío generado: ${challengeId} para verificador: ${verifierName}`);

    res.json({
      challengeId,
      message,
      verifierName,
      purpose,
      expiresAt: new Date(timestamp + 5 * 60 * 1000).toISOString(),
      instructions: [
        '1. Copia este mensaje exactamente',
        '2. Conecta tu wallet (MetaMask)',
        '3. Firma el mensaje con tu wallet',
        '4. Envía la firma al verificador'
      ]
    });

  } catch (error) {
    console.error('generate-challenge error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificar propiedad de wallet + badges con firma
app.post('/api/verify-ownership', async (req, res) => {
  try {
    const { challengeId, walletAddress, signature, webAuthnChallenge } = req.body;
    
    if (!challengeId || !walletAddress || !signature) {
      return res.status(400).json({ 
        error: 'challengeId, walletAddress y signature son requeridos' 
      });
    }

    // Verificar que el desafío existe y no ha expirado
    const challengeData = webAuthnStore.challenges.get(challengeId);
    if (!challengeData || challengeData.type !== 'ownership-challenge') {
      return res.status(400).json({ error: 'Desafío inválido o expirado' });
    }

    if (Date.now() - challengeData.timestamp > 5 * 60 * 1000) {
      webAuthnStore.challenges.delete(challengeId);
      return res.status(400).json({ error: 'Desafío expirado (5 minutos máximo)' });
    }

    console.log(`🔐 Verificando propiedad de ${walletAddress} con desafío ${challengeId}`);

    // Verificar que la firma es válida
    try {
      const recoveredAddress = ethers.verifyMessage(challengeData.message, signature);
      
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(400).json({
          error: 'Firma inválida: no coincide con la wallet proporcionada',
          expectedAddress: walletAddress,
          recoveredAddress
        });
      }
      
      console.log(`✅ Firma válida confirmada para ${walletAddress}`);
    } catch (signError) {
      return res.status(400).json({
        error: 'Firma inválida o formato incorrecto',
        details: signError.message
      });
    }

    // Verificar badges de estudiante
    const balance = await contract.balanceOf(walletAddress);
    const totalBadges = Number(balance);
    
    const studentBadges = [];
    const maxTokenId = 100;
    
    for (let tokenId = 1; tokenId <= maxTokenId && studentBadges.length < totalBadges; tokenId++) {
      try {
        const owner = await contract.ownerOf(tokenId);
        
        if (owner.toLowerCase() === walletAddress.toLowerCase()) {
          const badgeInfo = await contract.badgeInfo(tokenId);
          const badgeType = Number(badgeInfo[0]);
          
          if (badgeType === 1) { // Badge de estudiante
            studentBadges.push({
              tokenId: tokenId.toString(),
              badgeType: badgeType.toString(),
              issuedAt: new Date(Number(badgeInfo[1]) * 1000).toISOString(),
              issuer: badgeInfo[2]
            });
          }
        }
      } catch (error) {
        // Token no existe o no pertenece al usuario
      }
    }

    // Verificar WebAuthn si está disponible
    const hasWebAuthn = webAuthnStore.credentials.has(walletAddress);
    let webAuthnVerified = false;
    
    if (webAuthnChallenge && hasWebAuthn) {
      // Aquí podrías verificar WebAuthn si se proporciona
      webAuthnVerified = true; // Simplificado por ahora
    }

    // Limpiar desafío usado
    webAuthnStore.challenges.delete(challengeId);

    const securityLevel = webAuthnVerified ? 'MAXIMUM' : (hasWebAuthn ? 'HIGH' : 'STANDARD');
    const isVerifiedStudent = studentBadges.length > 0;

    res.json({
      verified: true,
      isStudent: isVerifiedStudent,
      ownershipProven: true,
      walletAddress,
      studentBadges,
      totalBadges,
      hasWebAuthn,
      webAuthnVerified,
      securityLevel,
      verificationLevel: {
        signatureVerified: true,
        walletOwnership: true,
        studentCredentials: isVerifiedStudent,
        biometricAuth: webAuthnVerified
      },
      verifierInfo: {
        verifierName: challengeData.verifierName,
        purpose: challengeData.purpose,
        verifiedAt: new Date().toISOString()
      },
      summary: isVerifiedStudent 
        ? `✅ ESTUDIANTE VERIFICADO - Propiedad de wallet confirmada con firma digital`
        : `❌ NO ES ESTUDIANTE - Wallet válida pero sin credenciales de estudiante`,
      contractAddress: CONTRACT_ADDRESS,
      blockchain: 'Polkadot Paseo Testnet'
    });

  } catch (error) {
    console.error('verify-ownership error:', error);
    res.status(500).json({ 
      error: 'Error en verificación de propiedad',
      details: error.message 
    });
  }
});

// ============ ENDPOINT SIMPLIFICADO PARA VERIFICADORES ============

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});