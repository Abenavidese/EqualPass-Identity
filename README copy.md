cd frontend

npm install

cd contracts

npm install

npx hardhat compile

create .env

PRIVATE_KEY="YOUR_PRIVATE_KEY"

DEPLOY CONTRACT -- only manager 

rmdir /s /q ignition\deployments   

npx hardhat clean

npx hardhat ignition deploy ./ignition/modules/DeployEqualPass.ts --network passetHubTestnet

CONTRACT DETAILS

 Contract Successfully Deployed!
Contract Address: 0xe2F7E0961630a8308527FE55c962259F93b6D440

Network: Paseo TestNet (Chain ID: 420420422)

Block Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/address/0xe2F7E0961630a8308527FE55c962259F93b6D440

📄 Contract ABI Location
The complete ABI is located at:

install\contracts\artifacts-pvm\contracts\EqualPassIdentityBadge.sol\EqualPassIdentityBadge.json

C:\Users\florg\Music\equalpass-project\install\contracts\artifacts-pvm\contracts\EqualPassIdentityBadge.sol\EqualPassIdentityBadge.json

https://paseo.subscan.io/account/0xe0638c03000Bb2B864a71F3EeF84F18045cCB633

RESOURCES

https://polkadot-survival-guide.w3d.community/es

https://faucet.polkadot.io/?parachain=1111


# Flujo Completo de EqualPass: Desde la Prueba ZK hasta el NFT Soulbound en Paseo

Este esquema muestra cada paso del proceso, integrando frontend, backend, pruebas ZK y el contrato en Polkadot Paseo para emitir y verificar un NFT Soulbound que certifica atributos (“subsidio activo”, “estudiante”, “discapacidad”) sin exponer datos sensibles.

## 1. Inicio en Frontend

- Usuario entra a “/” en la aplicación Next.js.
- La app, usando Wagmi/RainbowKit, detecta:
    - Si la wallet está conectada.
    - Si la red es Paseo Testnet (Chain ID 420420422).
- Si no está conectado, muestra “Connect Wallet”; si está en otra red, solicita cambiar a Paseo.

## 2. Carga de datos y solicitud de Prueba ZK

- Usuario sube su JSON de evidencia mock, por ejemplo: { subsidyStatus: 1, monthlyIncome: 250 }.
- El frontend envía POST /api/verify al backend con ese JSON.

## 3. Backend genera la Prueba ZK

- Recibe datos y ejecuta el circuito Circom (eligibility.circom) para compilar WASM y R1CS.
- Usa snarkjs para generar la prueba Groth16:
    
    snarkjs groth16 fullprove input.json eligibility.wasm eligibility.zkey proof.json publicSignals.json.
    
- Devuelve al frontend { proof, publicSignals }.

## 4. Validación off-chain (opcional)

- El frontend puede llamar POST /api/verify-offchain con { proof, publicSignals }.
- El backend verifica la prueba:
    
    snarkjs groth16 verify verification_key.json publicSignals.json proof.json.
    
- Retorna true/false; si es true, habilita “Claim Badge”.

## 5. Mint del NFT Soulbound en Paseo

- Usuario hace clic en “Claim Badge”.
- Frontend construye claimId (por ejemplo, hash aleatorio) y llama con Wagmi:
    
    writeContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "mintBadge", args: [userAddress, badgeType, claimId] }).
    
- La transacción se firma con la cuenta con MINTER_ROLE (backend o signer delegado).
- Contrato EqualPassIdentityBadge.sol en Paseo:
    - Verifica onlyRole(MINTER_ROLE).
    - Asigna tokenId = _tokenIdCounter.current(), incrementa contador.
    - Llama _safeMint(to, tokenId).
    - Guarda badgeInfo[tokenId] = { badgeType, issuedAt: block.timestamp, issuer: msg.sender }.
    - Emite evento BadgeMinted(to, tokenId, badgeType, claimId).

## 6. Confirmación y lectura de estado

- Frontend suscribe a BadgeMinted, recibe txHash y detalles.
- Muestra al usuario:
    - TX Hash con link a Blockscout Paseo.
    - Datos del evento: dirección, tokenId, badgeType, claimId.
- Llama funciones de lectura on-chain:
    - balanceOf(userAddress) → número de badges.
    - badgeInfo(tokenId) → { badgeType, issuedAt, issuer }.

## 7. Verificación por terceros

- Cualquiera puede usar el contrato para leer:
    - ownerOf(tokenId) → propietario.
    - badgeInfo(tokenId) → datos públicos del badge.
- Permite validar atributos sin exponer información privada.

## 8. Seguridad y buenas prácticas

- La clave con MINTER_ROLE queda solo en el backend; nunca en el frontend.
- La página /test usa meta noindex para evitar indexación de buscadores.
- Transferencias bloqueadas en _update, preservando soulbound (no transferible).
- Contrato desplegado en Paseo Testnet (sin valor real) con Chain ID 420420422, RPC y Blockscout oficiales.

## Comandos para Pruebas 

1) Clonar e instalar dependencias
```powershell
git clone <TU_REPO_URL>
cd EqualPass-Identity\install\backend
npm install
# si falta snarkjs:
npm install --no-audit --no-fund snarkjs
```

2) Ejecutar el servidor
```powershell
# en una terminal
node server.js
# el servidor escucha en http://localhost:3001
```

3) Generar una prueba (en otra terminal)
```powershell
$body='{"studentStatus":1,"enrollmentYear":2025,"universityHash":12345,"userSecret":67890}'
Invoke-RestMethod -Method Post -Uri "http://localhost:3001/api/generate-proof" -Body $body -ContentType 'application/json' -Verbose
```

4) Verificar la prueba con el backend
```powershell
# desde install/backend
$proofObj  = Get-Content .\circuits\proof.json -Raw | ConvertFrom-Json
$publicObj = Get-Content .\circuits\public.json -Raw | ConvertFrom-Json
$bodyJson  = @{ proof = $proofObj; publicSignals = $publicObj } | ConvertTo-Json -Depth 20
Invoke-RestMethod -Method Post -Uri "http://localhost:3001/api/verify-proof" -Body $bodyJson -ContentType 'application/json' -Verbose
```

5) Verificar localmente con snarkjs (debug)
```powershell
cd .\circuits
npx snarkjs groth16 verify .\verification_key.json .\public.json .\proof.json
# salida esperada: [INFO]  snarkJS: OK!
```

6) Git: ejemplo rápido para subir cambios
```powershell
git add install/backend/server.js install/backend/package.json install/backend/circuits README.md install/backend/.env.example
git commit -m "backend + circuits artifacts"
git push origin main
```

Notas rápidas
- NO subas `.env` con claves. Incluye `.env.example` en el repo.
- Asegúrate de incluir en `install/backend/circuits` los artefactos necesarios: `.wasm`, `.r1cs`, `.zkey`, `verification_key.json`, `pot12_final.ptau`, `input_example.json`.
- Si hay problemas con PowerShell/JSON, usa los comandos que leen los archivos crudos (`Get-Content -Raw | ConvertFrom-Json`) como en el ejemplo.

## Diagrama simplificado de flujo

- Usuario → Frontend “/” (Next.js + Wagmi).
- Frontend → POST /api/verify → Backend (Node.js + Circom + snarkjs).
- Backend → { proof, publicSignals } → Frontend.
- Frontend → Wagmi/Ethers.js → Contrato Paseo: mintBadge(user, badgeType, claimId).
- Contrato → emite BadgeMinted y guarda badgeInfo on-chain.
- Frontend → muestra txHash, evento, balanceOf, badgeInfo.
- Terceros → llamadas read on-chain para verificar badge.

Con este flujo integrado, EqualPass demuestra el uso completo de pruebas ZK y NFTs Soulbound en Polkadot Paseo, cumpliendo requisitos de funcionalidad, seguridad y demo exigidos por el hackathon, y utilizando endpoints y herramientas recomendadas del ecosistema Polkadot.