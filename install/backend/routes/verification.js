const express = require("express");
const { ethers } = require("ethers");

// Rutas de verificación
const setupVerificationRoutes = (challengeService, zkService, contractService) => {
  const router = express.Router();

  // Verificar estudiante (método simple)
  router.post("/verify-student", async (req, res) => {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: "walletAddress is required" });
      }

      console.log(`🔍 Verificación pública solicitada para: ${walletAddress}`);

      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({
          isStudent: false,
          verified: false,
          reason: "Dirección de wallet inválida",
          walletAddress,
        });
      }

      // Verificar badges usando contract service
      const verificationResult = await contractService.verifyStudent(walletAddress);

      if (!verificationResult.isStudent) {
        return res.json({
          isStudent: false,
          verified: false,
          reason:
            verificationResult.totalBadges > 0
              ? "Tiene badges pero no de estudiante"
              : "No tiene badges en el sistema ZK-Scholar",
          walletAddress,
          badgeCount: verificationResult.totalBadges,
          badges: verificationResult.allBadges,
        });
      }

      // Verificar si tiene credencial WebAuthn
      const hasWebAuthn = challengeService.hasWebAuthnCredential(walletAddress);
      const securityLevel = hasWebAuthn ? "HIGH" : "STANDARD";

      res.json({
        isStudent: true,
        verified: true,
        walletAddress,
        studentBadges: verificationResult.studentBadges,
        totalBadges: verificationResult.totalBadges,
        hasWebAuthn,
        securityLevel,
        verificationTimestamp: new Date().toISOString(),
        contractAddress: process.env.CONTRACT_ADDRESS,
        blockchain: "Polkadot Paseo Testnet",
        explorerBase: "https://blockscout-passet-hub.parity-testnet.parity.io",
      });
    } catch (error) {
      console.error("verify-student error:", error);
      res.status(500).json({
        error: "Error verificando estudiante",
        details: error.message,
        walletAddress: req.body.walletAddress,
      });
    }
  });

  // Mint badge completo (ZK + WebAuthn opcional)
  router.post("/mint", async (req, res) => {
    console.log("/api/mint called");
    try {
      const {
        userAddress,
        studentStatus,
        enrollmentYear,
        universityHash,
        userSecret,
        webAuthnCredential,
        requireWebAuthn = false,
      } = req.body;

      if (!userAddress) {
        return res.status(400).json({ error: "userAddress is required" });
      }

      let webAuthnVerified = false;

      // Verificación WebAuthn si es requerida
      if (requireWebAuthn || webAuthnCredential) {
        console.log("Verificando WebAuthn...");

        if (!webAuthnCredential) {
          return res.status(400).json({
            error: "WebAuthn credential required",
            requiresWebAuthn: true,
          });
        }

        if (!challengeService.hasWebAuthnCredential(userAddress)) {
          return res.status(400).json({
            error: "No WebAuthn credential registered for this user",
            requiresRegistration: true,
          });
        }

        try {
          const clientDataJSON = JSON.parse(
            Buffer.from(webAuthnCredential.response.clientDataJSON, "base64").toString()
          );
          const challengeData = challengeService.validateChallenge(clientDataJSON.challenge, "authenticate");

          if (challengeData.userAddress !== userAddress) {
            return res.status(400).json({ error: "Invalid WebAuthn challenge" });
          }

          webAuthnVerified = true;
          console.log("✅ WebAuthn verification successful");
        } catch (error) {
          return res.status(400).json({
            error: "WebAuthn verification failed",
            details: error.message,
          });
        }
      }

      // Procesar verificación ZK
      console.log("Procesando verificación ZK...");
      const zkResult = await zkService.processStudentVerification({
        studentStatus,
        enrollmentYear,
        universityHash,
        userSecret,
      });

      // Mintear badge
      console.log("Minteando badge...");
      const badgeType = 1; // STUDENT badge type
      const claimId = contractService.generateClaimId(zkResult.proof);

      const mintResult = await contractService.mintBadge(userAddress, badgeType, claimId);

      res.json({
        success: true,
        verified: zkResult.verified,
        eligible: zkResult.eligible,
        webAuthnVerified,
        securityLevel: webAuthnVerified ? "HIGH" : "STANDARD",
        txHash: mintResult.txHash,
        tokenId: mintResult.tokenId,
        claimId,
        proof: zkResult.proof,
        publicSignals: zkResult.publicSignals,
        blockscoutUrl: mintResult.blockscoutUrl,
      });
    } catch (error) {
      console.error("mint error:", error);
      res.status(500).json({
        error: error.message || String(error),
        details: error.reason || error.data || null,
      });
    }
  });

  // Generar solo prueba ZK (para testing)
  router.post("/generate-only", async (req, res) => {
    console.log("/api/generate-only called");
    try {
      const zkResult = await zkService.processStudentVerification(req.body);
      res.json({
        proof: zkResult.proof,
        publicSignals: zkResult.publicSignals,
        eligible: zkResult.eligible,
      });
    } catch (error) {
      console.error("generate-only error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Verificar solo prueba ZK
  router.post("/verify-proof", async (req, res) => {
    try {
      const { proof, publicSignals } = req.body || {};
      if (!proof || publicSignals === undefined || publicSignals === null) {
        return res.status(400).json({ error: "proof and publicSignals required" });
      }

      // Normalizar publicSignals
      let normalizedPublic;
      if (Array.isArray(publicSignals)) {
        normalizedPublic = publicSignals;
      } else if (publicSignals && typeof publicSignals === "object") {
        if (Array.isArray(publicSignals.value)) {
          normalizedPublic = publicSignals.value;
        } else {
          const numericKeys = Object.keys(publicSignals)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b));
          if (numericKeys.length) {
            normalizedPublic = numericKeys.map((k) => publicSignals[k]);
          } else {
            normalizedPublic = Object.keys(publicSignals)
              .filter((k) => k !== "Count")
              .map((k) => publicSignals[k]);
          }
        }
      } else {
        normalizedPublic = [publicSignals];
      }

      const verified = await zkService.verifyProof(proof, normalizedPublic);
      res.json({ verified, stdout: verified ? "OK" : "FAILED" });
    } catch (error) {
      console.error("verify-proof error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

module.exports = setupVerificationRoutes;
