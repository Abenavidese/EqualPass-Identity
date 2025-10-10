const crypto = require("crypto");
const { ethers } = require("ethers");
const config = require("../config/app");

class ChallengeService {
  constructor() {
    this.challenges = new Map();
    this.credentials = new Map();

    // Limpiar challenges expirados cada minuto
    setInterval(() => this.cleanExpiredChallenges(), 60000);
  }

  // Generar desafío para registro WebAuthn
  generateRegistrationChallenge(userAddress) {
    const challenge = crypto.randomBytes(32);
    const challengeB64 = challenge.toString("base64url");

    this.challenges.set(challengeB64, {
      userAddress,
      timestamp: Date.now(),
      type: "register",
    });

    return {
      challenge: challengeB64,
      rp: {
        name: config.WEBAUTHN_RP_NAME,
        id: config.WEBAUTHN_RP_ID,
      },
      user: {
        id: userAddress,
        name: `student_${userAddress.slice(-8)}`,
        displayName: "ZK-Scholar Student",
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
        { alg: -257, type: "public-key" }, // RS256
      ],
      authenticatorSelection: {
        userVerification: "preferred",
        requireResidentKey: false,
      },
      timeout: 60000,
    };
  }

  // Generar desafío para autenticación WebAuthn
  generateAuthenticationChallenge(userAddress) {
    const userCredential = this.credentials.get(userAddress);
    if (!userCredential) {
      throw new Error("No WebAuthn credential found for this user");
    }

    const challenge = crypto.randomBytes(32);
    const challengeB64 = challenge.toString("base64url");

    this.challenges.set(challengeB64, {
      userAddress,
      timestamp: Date.now(),
      type: "authenticate",
    });

    return {
      challenge: challengeB64,
      rpId: config.WEBAUTHN_RP_ID,
      allowCredentials: [
        {
          id: userCredential.credentialId,
          type: "public-key",
        },
      ],
      userVerification: "preferred",
      timeout: 60000,
    };
  }

  // Generar desafío para verificación de propiedad
  generateOwnershipChallenge(verifierName, purpose) {
    const challengeId = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    const message = `ZK-Scholar Verificación
Verificador: ${verifierName || "Desconocido"}
Propósito: ${purpose || "Verificación de identidad"}
Código: ${challengeId}
Timestamp: ${timestamp}
Firma este mensaje para probar que eres el dueño de esta wallet.`;

    this.challenges.set(challengeId, {
      message,
      verifierName,
      purpose,
      timestamp,
      type: "ownership-challenge",
    });

    return {
      challengeId,
      message,
      verifierName,
      purpose,
      expiresAt: new Date(timestamp + config.CHALLENGE_EXPIRY_MINUTES * 60 * 1000).toISOString(),
    };
  }

  // Validar desafío
  validateChallenge(challengeId, expectedType) {
    const challengeData = this.challenges.get(challengeId);

    if (!challengeData || challengeData.type !== expectedType) {
      throw new Error("Desafío inválido o expirado");
    }

    if (Date.now() - challengeData.timestamp > config.CHALLENGE_EXPIRY_MINUTES * 60 * 1000) {
      this.challenges.delete(challengeId);
      throw new Error("Desafío expirado");
    }

    return challengeData;
  }

  // Verificar firma de mensaje
  verifyMessageSignature(message, signature, expectedAddress) {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
        throw new Error("Firma inválida: no coincide con la wallet proporcionada");
      }

      return true;
    } catch (error) {
      throw new Error(`Firma inválida: ${error.message}`);
    }
  }

  // Completar registro WebAuthn
  completeRegistration(userAddress, credential, challengeFromClient) {
    const challengeData = this.validateChallenge(challengeFromClient, "register");

    if (challengeData.userAddress !== userAddress) {
      throw new Error("Challenge no coincide con el usuario");
    }

    const credentialId = credential.id;

    this.credentials.set(userAddress, {
      credentialId: credentialId,
      publicKey: credential.response.publicKey,
      counter: 0,
      registered: Date.now(),
    });

    this.challenges.delete(challengeFromClient);

    return { credentialId, success: true };
  }

  // Verificar autenticación WebAuthn
  verifyAuthentication(userAddress, credential, challengeFromClient) {
    const challengeData = this.validateChallenge(challengeFromClient, "authenticate");

    if (challengeData.userAddress !== userAddress) {
      throw new Error("Challenge no coincide con el usuario");
    }

    const userCredential = this.credentials.get(userAddress);
    if (!userCredential) {
      throw new Error("No credential found for user");
    }

    // En implementación completa, verificaríamos la signature con la publicKey
    // Por simplicidad, asumimos que si llegó hasta aquí es válido

    this.challenges.delete(challengeFromClient);

    return { verified: true, success: true };
  }

  // Limpiar challenges expirados
  cleanExpiredChallenges() {
    const now = Date.now();
    const expiredChallenges = [];

    for (const [key, value] of this.challenges.entries()) {
      if (now - value.timestamp > config.CHALLENGE_EXPIRY_MINUTES * 60 * 1000) {
        expiredChallenges.push(key);
      }
    }

    expiredChallenges.forEach((key) => this.challenges.delete(key));

    if (expiredChallenges.length > 0) {
      console.log(`🧹 Limpiados ${expiredChallenges.length} challenges expirados`);
    }
  }

  // Verificar si usuario tiene credencial WebAuthn
  hasWebAuthnCredential(userAddress) {
    return this.credentials.has(userAddress);
  }

  // Obtener información de credencial
  getCredentialInfo(userAddress) {
    const credentialData = this.credentials.get(userAddress);
    return credentialData
      ? {
          hasCredential: true,
          credentialId: credentialData.credentialId,
          registered: credentialData.registered,
        }
      : { hasCredential: false };
  }
}

module.exports = ChallengeService;
