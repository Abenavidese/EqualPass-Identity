const express = require('express');
const cors = require('cors');
const path = require('path');

// Configuraciones
const config = require('./config/app');
const { setupContract } = require('./config/contract');

// Servicios
const ChallengeService = require('./services/challenge.service');
const ZKService = require('./services/zk.service');
const ContractService = require('./services/contract.service');

// Rutas
const setupWebAuthnRoutes = require('./routes/auth');
const setupVerificationRoutes = require('./routes/verification');
const setupChallengeRoutes = require('./routes/challenge');

// Inicializar Express
const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Logger simple
app.use((req, res, next) => {
  console.log('>>> REQ:', req.method, req.originalUrl, 'Content-Type:', req.headers['content-type'] || 'none');
  next();
});

// Inicializar servicios
console.log('🚀 Inicializando EqualPass Backend...');

// Configurar contrato
const contractSetup = setupContract();
if (!contractSetup) {
  console.error('❌ No se pudo configurar el contrato. Revisa tu configuración.');
  process.exit(1);
}

const { provider, wallet, contract } = contractSetup;

// Instanciar servicios
const challengeService = new ChallengeService();
const zkService = new ZKService();
const contractService = new ContractService(contract);

console.log('✅ Servicios inicializados correctamente');

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: 'EqualPass Backend funcionando!',
    version: '2.0.0',
    architecture: 'Modular',
    services: ['WebAuthn', 'Zero-Knowledge', 'Smart Contracts', 'Challenge System'],
    endpoints: {
      webauthn: '/api/webauthn/*',
      verification: '/api/*',
      challenges: '/api/*',
      demo: '/demo',
      verificador: '/verificador'
    }
  });
});

// Servir páginas demo
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo-webauthn.html'));
});

app.get('/verificador', (req, res) => {
  res.sendFile(path.join(__dirname, 'verificador-seguro.html'));
});

// Endpoint para información del contrato
app.get('/api/contract-info', (req, res) => {
  try {
    res.json({ 
      address: config.CONTRACT_ADDRESS,
      network: 'Polkadot Paseo Testnet',
      chainId: config.CHAIN_ID,
      explorer: config.BLOCKSCOUT_BASE
    });
  } catch (error) {
    console.error('contract-info error:', error);
    res.status(500).json({ error: 'Failed to get contract info', details: error.message });
  }
});

// Configurar rutas modulares
app.use('/api/webauthn', setupWebAuthnRoutes(challengeService));
app.use('/api', setupVerificationRoutes(challengeService, zkService, contractService));
app.use('/api', setupChallengeRoutes(challengeService, contractService));

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('🚨 Error no manejado:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      demo: '/demo',
      verificador: '/verificador',
      contractInfo: '/api/contract-info',
      webauthn: '/api/webauthn/*',
      verification: '/api/verify-student, /api/mint, /api/generate-only',
      challenges: '/api/generate-challenge, /api/verify-ownership'
    }
  });
});

// Iniciar servidor
app.listen(config.PORT, () => {
  console.log(`
🎉 EqualPass Backend v2.0 ejecutándose!
📡 Puerto: ${config.PORT}
🔗 Contrato: ${config.CONTRACT_ADDRESS}
🌐 Red: Polkadot Paseo Testnet
📊 Endpoints disponibles:
   • Demo: http://localhost:${config.PORT}/demo
   • Verificador: http://localhost:${config.PORT}/verificador
   • API: http://localhost:${config.PORT}/api/*
   
🛡️ Servicios activos:
   ✅ WebAuthn Authentication
   ✅ Zero-Knowledge Proofs  
   ✅ Smart Contract Integration
   ✅ Challenge-Response System
  `);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🔄 Cerrando servidor...');
  process.exit(0);
});

module.exports = app;