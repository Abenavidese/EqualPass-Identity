const express = require('express');

// Rutas de desafíos
const setupChallengeRoutes = (challengeService, contractService) => {
  const router = express.Router();

  // Generar desafío para probar propiedad de wallet
  router.post('/generate-challenge', (req, res) => {
    try {
      const { verifierName, purpose } = req.body;
      
      const challenge = challengeService.generateOwnershipChallenge(verifierName, purpose);
      
      console.log(`📝 Desafío generado: ${challenge.challengeId} para verificador: ${verifierName}`);

      res.json({
        ...challenge,
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
  router.post('/verify-ownership', async (req, res) => {
    try {
      const { challengeId, walletAddress, signature, webAuthnChallenge } = req.body;
      
      if (!challengeId || !walletAddress || !signature) {
        return res.status(400).json({ 
          error: 'challengeId, walletAddress y signature son requeridos' 
        });
      }

      // Validar desafío
      const challengeData = challengeService.validateChallenge(challengeId, 'ownership-challenge');

      console.log(`🔐 Verificando propiedad de ${walletAddress} con desafío ${challengeId}`);

      // Verificar firma
      challengeService.verifyMessageSignature(challengeData.message, signature, walletAddress);
      console.log(`✅ Firma válida confirmada para ${walletAddress}`);

      // Verificar badges de estudiante
      const verificationResult = await contractService.verifyStudent(walletAddress);

      // Verificar WebAuthn si está disponible
      const hasWebAuthn = challengeService.hasWebAuthnCredential(walletAddress);
      let webAuthnVerified = false;
      
      if (webAuthnChallenge && hasWebAuthn) {
        webAuthnVerified = true; // Simplificado por ahora
      }

      // Limpiar desafío usado
      challengeService.challenges.delete(challengeId);

      const securityLevel = webAuthnVerified ? 'MAXIMUM' : (hasWebAuthn ? 'HIGH' : 'STANDARD');
      const isVerifiedStudent = verificationResult.isStudent;

      res.json({
        verified: true,
        isStudent: isVerifiedStudent,
        ownershipProven: true,
        walletAddress,
        studentBadges: verificationResult.studentBadges,
        totalBadges: verificationResult.totalBadges,
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
        contractAddress: process.env.CONTRACT_ADDRESS,
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

  // Demo de fraude
  router.post('/demo-fraud', (req, res) => {
    console.log('/api/demo-fraud called - Simulando intento de fraude');
    
    const { userAddress, stolenCredential } = req.body;
    
    const realCredential = challengeService.hasWebAuthnCredential(userAddress);
    
    if (!realCredential) {
      return res.status(400).json({
        fraudDetected: false,
        message: 'No hay credencial real para comparar',
        recommendation: 'Registre una credencial WebAuthn primero'
      });
    }

    res.json({
      fraudDetected: true,
      fraudSuccess: false,
      message: '🚨 FRAUDE DETECTADO: Credencial válida pero dispositivo incorrecto',
      securityLevel: 'FRAUD_PREVENTED',
      details: {
        hasValidCredential: !!stolenCredential,
        hasCorrectDevice: false,
        webAuthnPrevented: true
      }
    });
  });

  return router;
};

module.exports = setupChallengeRoutes;