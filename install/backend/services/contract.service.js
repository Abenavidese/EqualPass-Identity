const { ethers } = require('ethers');
const config = require('../config/app');

class ContractService {
  constructor(contract) {
    this.contract = contract;
  }

  // Mintear badge
  async mintBadge(userAddress, badgeType, claimId) {
    try {
      const tx = await this.contract.mintBadge(userAddress, badgeType, claimId);
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);

      // Buscar evento BadgeMinted
      let tokenId = null;
      for (const log of receipt.logs) {
        try {
          const decoded = this.contract.interface.parseLog(log);
          if (decoded.name === 'BadgeMinted') {
            tokenId = decoded.args.tokenId.toString();
            break;
          }
        } catch (e) {
          // Log no es de nuestro contrato, continuar
        }
      }

      return {
        txHash: receipt.hash,
        tokenId,
        blockscoutUrl: `${config.BLOCKSCOUT_BASE}/tx/${receipt.hash}`
      };
    } catch (error) {
      throw new Error(`Error minteando badge: ${error.message}`);
    }
  }

  // Obtener balance de badges de un usuario
  async getBalance(userAddress) {
    try {
      const balance = await this.contract.balanceOf(userAddress);
      return Number(balance);
    } catch (error) {
      throw new Error(`Error obteniendo balance: ${error.message}`);
    }
  }

  // Obtener información de un badge
  async getBadgeInfo(tokenId) {
    try {
      const badgeInfo = await this.contract.badgeInfo(tokenId);
      return {
        badgeType: Number(badgeInfo[0]),
        issuedAt: Number(badgeInfo[1]),
        issuer: badgeInfo[2]
      };
    } catch (error) {
      throw new Error(`Error obteniendo info del badge: ${error.message}`);
    }
  }

  // Verificar si usuario es dueño de un token
  async isOwnerOf(tokenId, userAddress) {
    try {
      const owner = await this.contract.ownerOf(tokenId);
      return owner.toLowerCase() === userAddress.toLowerCase();
    } catch (error) {
      // Token probablemente no existe
      return false;
    }
  }

  // Buscar todos los badges de un usuario
  async findUserBadges(userAddress) {
    const totalBadges = await this.getBalance(userAddress);
    
    if (totalBadges === 0) {
      return { allBadges: [], studentBadges: [] };
    }

    const allBadges = [];
    const studentBadges = [];
    
    // Buscar tokens incrementalmente
    for (let tokenId = 1; tokenId <= config.MAX_TOKEN_SEARCH; tokenId++) {
      try {
        if (await this.isOwnerOf(tokenId, userAddress)) {
          const badgeInfo = await this.getBadgeInfo(tokenId);
          
          const badge = {
            tokenId: tokenId.toString(),
            badgeType: badgeInfo.badgeType.toString(),
            issuedAt: new Date(badgeInfo.issuedAt * 1000).toISOString(),
            issuer: badgeInfo.issuer,
            isStudentBadge: badgeInfo.badgeType === 1
          };
          
          allBadges.push(badge);
          
          if (badgeInfo.badgeType === 1) { // Badge de estudiante
            studentBadges.push(badge);
          }
        }
      } catch (error) {
        // Token no existe o error de red, continuar
      }
      
      // Si ya encontramos todos los badges, podemos parar
      if (allBadges.length >= totalBadges) {
        break;
      }
    }

    return { allBadges, studentBadges };
  }

  // Verificar si usuario es estudiante
  async verifyStudent(userAddress) {
    try {
      const { allBadges, studentBadges } = await this.findUserBadges(userAddress);
      
      return {
        isStudent: studentBadges.length > 0,
        totalBadges: allBadges.length,
        studentBadges,
        allBadges
      };
    } catch (error) {
      throw new Error(`Error verificando estudiante: ${error.message}`);
    }
  }

  // Generar claim ID único basado en la prueba
  generateClaimId(proof) {
    return ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(proof)));
  }
}

module.exports = ContractService;