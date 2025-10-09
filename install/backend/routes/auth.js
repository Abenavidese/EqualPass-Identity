const express = require('express');

// Rutas WebAuthn
const setupWebAuthnRoutes = (challengeService) => {
  const router = express.Router();

  // Generar challenge para registro
  router.post('/register/begin', (req, res) => {
    try {
      const { userAddress } = req.body;
      if (!userAddress) {
        return res.status(400).json({ error: 'userAddress required' });
      }

      const options = challengeService.generateRegistrationChallenge(userAddress);
      res.json(options);
    } catch (error) {
      console.error('webauthn register begin error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Completar registro
  router.post('/register/complete', (req, res) => {
    try {
      const { credential, userAddress } = req.body;
      if (!credential || !userAddress) {
        return res.status(400).json({ error: 'credential and userAddress required' });
      }

      // Extraer challenge del clientDataJSON
      const clientDataJSON = JSON.parse(Buffer.from(credential.response.clientDataJSON, 'base64').toString());
      const challengeFromClient = clientDataJSON.challenge;

      const result = challengeService.completeRegistration(userAddress, credential, challengeFromClient);
      
      console.log(`✅ WebAuthn credential registered for ${userAddress}, ID: ${result.credentialId}`);
      
      res.json({ 
        success: true, 
        credentialId: result.credentialId,
        message: 'WebAuthn credential registered successfully' 
      });
    } catch (error) {
      console.error('webauthn register complete error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generar challenge para autenticación
  router.post('/authenticate/begin', (req, res) => {
    try {
      const { userAddress } = req.body;
      if (!userAddress) {
        return res.status(400).json({ error: 'userAddress required' });
      }

      const options = challengeService.generateAuthenticationChallenge(userAddress);
      res.json(options);
    } catch (error) {
      console.error('webauthn authenticate begin error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Completar autenticación
  router.post('/authenticate/complete', (req, res) => {
    try {
      const { credential, userAddress } = req.body;
      if (!credential || !userAddress) {
        return res.status(400).json({ error: 'credential and userAddress required' });
      }

      // Extraer challenge del clientDataJSON
      const clientDataJSON = JSON.parse(Buffer.from(credential.response.clientDataJSON, 'base64').toString());
      const challengeFromClient = clientDataJSON.challenge;

      const result = challengeService.verifyAuthentication(userAddress, credential, challengeFromClient);
      
      console.log(`✅ WebAuthn authentication successful for ${userAddress}`);
      
      res.json({ 
        success: true, 
        verified: result.verified,
        message: 'WebAuthn authentication successful' 
      });
    } catch (error) {
      console.error('webauthn authenticate complete error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Verificar estado WebAuthn
  router.get('/status/:userAddress', (req, res) => {
    const { userAddress } = req.params;
    const credentialInfo = challengeService.getCredentialInfo(userAddress);
    
    console.log(`Checking WebAuthn status for ${userAddress}:`, credentialInfo);
    
    res.json({ 
      hasCredential: credentialInfo.hasCredential, 
      userAddress,
      credentialId: credentialInfo.credentialId,
      registered: credentialInfo.registered
    });
  });

  return router;
};

module.exports = setupWebAuthnRoutes;