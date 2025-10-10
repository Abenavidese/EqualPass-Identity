# ZK-Scholar Identity - Contexto Completo del Proyecto

## Descripción General del Proyecto

**ZK-Scholar** es un sistema de verificación de identidad estudiantil que combina **Zero-Knowledge Proofs (ZK) + WebAuthn** para crear un sistema de credenciales seguro y anti-fraude. Está construido para la red **Polkadot Paseo TestNet** y permite a estudiantes obtener NFTs verificados que prueban su estatus sin revelar información personal.

## Arquitectura Técnica Actual

### 🔧 **Stack Tecnológico**

- **Smart Contracts:** Solidity ^0.8.28 en Polkadot Paseo TestNet
- **ZK Proofs:** Circom circuits + snarkjs para verificación de elegibilidad
- **Autenticación:** WebAuthn para verificación biométrica
- **Backend:** Node.js + Express con arquitectura modular
- **Frontend:** HTML5 + Vanilla JavaScript + MetaMask integration
- **Blockchain:** Polkadot Paseo PassetHub (Chain ID: 420420422)

### 🌐 **Configuración de Red**

```javascript
Network Name: Paseo PassetHub
Chain ID: 420420422 (0x190f1b46)
RPC URL: https://testnet-passet-hub-eth-rpc.polkadot.io
Currency Symbol: PAS
Block Explorer: https://blockscout-passet-hub.parity-testnet.parity.io
```

### 📁 **Estructura del Proyecto**

```
ZK-Scholar-hackathon/
├── backend/
│   ├── server-modular.js              # Servidor principal con arquitectura modular
│   ├── demo-webauthn.html             # Demo principal con flujo completo
│   ├── verificador-seguro.html        # Verificador para instituciones
│   ├── config/
│   │   ├── app.js                     # Configuración de aplicación
│   │   └── contract.js                # Configuración del contrato
│   ├── services/
│   │   ├── challenge.service.js       # Gestión de challenges WebAuthn
│   │   ├── zk.service.js              # Servicio de Zero-Knowledge Proofs
│   │   └── contract.service.js        # Interacción con smart contracts
│   ├── routes/
│   │   ├── auth.js                    # Rutas de autenticación WebAuthn
│   │   ├── verification.js           # Rutas de verificación
│   │   └── challenge.js               # Rutas de challenges
│   ├── circuits/                      # Archivos de circuitos ZK
│   │   ├── eligibility_student.circom # Circuito principal
│   │   ├── eligibility_student.zkey   # Clave de prueba
│   │   ├── verification_key.json      # Clave de verificación
│   │   └── eligibility_student_js/    # Archivos compilados
│   └── nft_mint/
│       └── nft.png                    # Imagen del NFT
├── contracts/
│   ├── contracts/
│   │   └── ZK-ScholarIdentityBadge.sol # Smart contract principal
│   ├── ignition/modules/
│   │   └── DeployZK-Scholar.ts         # Script de deployment
│   └── hardhat.config.ts              # Configuración de Hardhat
└── frontend/                          # Frontend React (opcional)
```

## 🎯 **Funcionalidades Implementadas**

### ✅ **1. Verificación Zero-Knowledge**

- Circuito Circom que verifica elegibilidad estudiantil sin revelar datos personales
- Inputs: `studentStatus`, `enrollmentYear`, `universityHash`, `userSecret`
- Genera pruebas verificables sin exponer información sensible

### ✅ **2. Autenticación WebAuthn**

- Registro de dispositivos biométricos (huella, face ID, etc.)
- Verificación de identidad usando credenciales del dispositivo
- Sistema de challenges para prevenir replay attacks

### ✅ **3. Smart Contract NFT**

- Contrato `ZK-ScholarIdentityBadge` que mintea badges estudiantiles
- Función `mintBadge()` que acepta pruebas ZK
- Metadata dinámico con `tokenURI()` pointing a servidor local
- Deployed en Polkadot Paseo TestNet

### ✅ **4. Integración MetaMask**

- Auto-configuración de red Polkadot Paseo
- Importación automática de NFTs a wallet
- Fallback a instrucciones manuales si falla la importación automática

### ✅ **5. Sistema Anti-Fraude**

- Demo que muestra cómo un atacante con solo datos ZK NO puede autenticarse
- Requiere tanto prueba ZK como verificación biométrica para alta seguridad

## 🔄 **Flujo de Usuario Actual**

### **Paso 1: Datos de Estudiante**

Usuario ingresa: dirección wallet, status estudiante, año matrícula, hash universidad, secreto

### **Paso 2: Generar Prueba ZK**

- Sistema genera prueba zero-knowledge con datos del estudiante
- Prueba que es estudiante sin revelar información personal
- Mintea NFT con seguridad estándar

### **Paso 3: Registro WebAuthn (Opcional)**

- Usuario registra dispositivo biométrico una sola vez
- Genera credenciales WebAuthn únicas por dispositivo

### **Paso 4: Prueba ZK + WebAuthn (Alta Seguridad)**

- Combina prueba ZK con verificación biométrica
- Nivel máximo de seguridad anti-fraude
- Mintea NFT con seguridad alta

### **Paso 5: Obtener NFT**

- Descarga automática de NFT a MetaMask
- Configuración automática de red Polkadot si es necesario
- NFT muestra credencial estudiantil verificada

## 🛡️ **Verificador para Instituciones**

### **verificador-seguro.html**

- Interface para que instituciones verifiquen estudiantes
- Verificación automática al conectar wallet
- Muestra solo: conexión, propiedad de wallet, firma digital, credenciales estudiantiles
- **NO muestra** datos biométricos ni niveles de seguridad (como solicitaste)

## 🚀 **APIs y Endpoints**

### **Servidor (Puerto 3001)**

```javascript
// WebAuthn
POST /api/webauthn/register/begin
POST /api/webauthn/register/finish
POST /api/webauthn/authenticate/begin
POST /api/webauthn/authenticate/finish
GET  /api/webauthn/status/:address

// ZK + Minting
POST /api/verify-zk          # Verificación solo ZK
POST /api/mint               # Mint con ZK
POST /api/mint-secure        # Mint con ZK + WebAuthn

// NFT
GET  /api/metadata/:tokenId  # Metadata del NFT
GET  /nft/nft.png           # Imagen del NFT

// Demo
POST /api/demo-fraud         # Simulación de fraude
```

## 🎨 **Configuración NFT**

```javascript
{
  "name": "ZK-Scholar Student Badge #[tokenId]",
  "description": "Credencial estudiantil verificada con Zero-Knowledge Proofs y WebAuthn...",
  "image": "http://localhost:3001/nft/nft.png",
  "external_url": "http://localhost:3001/verificador",
  "attributes": [
    {"trait_type": "Badge Type", "value": "Student Credential"},
    {"trait_type": "Security Level", "value": "High"},
    {"trait_type": "Verification Method", "value": "Zero-Knowledge + WebAuthn"}
  ]
}
```

## 🔧 **Configuración Clave**

### **Hardhat Config**

```javascript
module.exports = {
  solidity: "0.8.28",
  resolc: { version: "0.3.0", compilerSource: "npm" },
  networks: {
    passetHub: {
      polkavm: true,
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
      accounts: [vars.get("PRIVATE_KEY")],
    },
  },
};
```

### **Variables de Entorno**

- `PRIVATE_KEY`: Clave privada para deployment (sin 0x prefix)
- Servidor corre en puerto 3001
- Todos los endpoints apuntan a localhost:3001

## 🎯 **Objetivos y Casos de Uso**

### **Para Hackathon**

- Demostrar seguridad anti-fraude con ZK + WebAuthn
- Mostrar diferencia entre verificación estándar vs alta seguridad
- Proof of concept de credenciales estudiantiles descentralizadas

### **Casos de Uso Reales**

1. **Descuentos Estudiantiles:** Verificar estatus sin revelar universidad específica
2. **Acceso a Recursos:** Bibliotecas, software estudiantil, eventos
3. **Verificación Institucional:** Proceso automatizado para instituciones
4. **Sistema Anti-Fraude:** Prevenir uso de credenciales robadas

## 🔍 **Puntos Técnicos Importantes**

### **Seguridad**

- Pruebas ZK son verificables pero no revelan datos
- WebAuthn previene fraude con dispositivos robados
- NFTs son proof of ownership en blockchain

### **UX Considerations**

- Flujo progresivo: ZK básico → registro biométrico → alta seguridad
- Auto-configuración de MetaMask para mejor experiencia
- Fallbacks manuales cuando la auto-configuración falla

### **Limitaciones Actuales**

- Testnet solo (Polkadot Paseo)
- Circuitos ZK con datos mock para demo
- Servidor local (no producción)

## 📋 **Estado Actual del Proyecto**

### ✅ **Completado**

- Smart contract deployed y funcionando
- Circuitos ZK generando pruebas válidas
- WebAuthn registration y authentication
- NFT minting con metadata dinámico
- MetaMask integration con auto-network setup
- Verificador institucional limpio
- Sistema anti-fraude demostrable

### 🔄 **Listo para Demo**

- Flujo completo ZK → WebAuthn → NFT
- URLs de acceso:
  - Demo principal: `http://localhost:3001/demo-webauthn.html`
  - Verificador: `http://localhost:3001/verificador-seguro.html`

## 💡 **Para Continuar el Desarrollo**

Si necesitas modificar o extender este proyecto:

1. **Servidor:** Ejecutar `node server-modular.js` en `/backend`
2. **Contratos:** Están en `/contracts` con Hardhat configurado
3. **ZK Circuits:** En `/backend/circuits` - modificar `eligibility_student.circom`
4. **Frontend:** Archivos HTML en `/backend` o React app en `/frontend`

El proyecto está estructurado modularmente para facilitar modificaciones y está documentado para que otra IA pueda entender rápidamente la arquitectura y continuar el desarrollo.
