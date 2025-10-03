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
