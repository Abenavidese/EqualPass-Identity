const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const config = require('./app');

// Cargar ABI del contrato
const loadContractABI = () => {
  try {
    const abiPath = path.join(__dirname, '..', 'contract-abi.json');
    return JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  } catch (error) {
    console.error('Error loading contract ABI:', error);
    return null;
  }
};

// Configurar provider y contrato
const setupContract = () => {
  try {
    const provider = new ethers.JsonRpcProvider(config.RPC_URL);
    const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
    const abi = loadContractABI();
    
    if (!abi) {
      throw new Error('Could not load contract ABI');
    }
    
    const contract = new ethers.Contract(config.CONTRACT_ADDRESS, abi, wallet);
    
    console.log('✅ Contrato configurado:', config.CONTRACT_ADDRESS);
    console.log('✅ Wallet configurado:', wallet.address);
    
    return { provider, wallet, contract };
  } catch (error) {
    console.error('❌ Error configurando contrato:', error.message);
    return null;
  }
};

module.exports = {
  loadContractABI,
  setupContract
};