import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const MOCK_BADGES: Record<string, { owner: string; badgeType: number; issuedAt: number; issuer: string } | null> = {
  '1': { owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', badgeType: 1, issuedAt: Math.floor(Date.now()/1000 - 86400*30), issuer: '0x1234567890123456789012345678901234567890' },
  '2': { owner: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', badgeType: 2, issuedAt: Math.floor(Date.now()/1000 - 86400*60), issuer: '0x1234567890123456789012345678901234567890' },
  '3': { owner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', badgeType: 3, issuedAt: Math.floor(Date.now()/1000 - 86400*90), issuer: '0x1234567890123456789012345678901234567890' },
};

export const VerifierForm: React.FC = () => {
  const [tokenId, setTokenId] = useState('');
  const [address, setAddress] = useState('');
  const [mode, setMode] = useState<'token'|'address'>('token');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyToken = async () => {
    if (!tokenId) { setError('Ingresa un Token ID'); return; }
    setLoading(true); setResult(null); setError(null);
    await new Promise(r => setTimeout(r, 800));
    const badge = MOCK_BADGES[tokenId];
    if (badge) setResult(badge); else setError('Badge no encontrado. Prueba 1, 2 o 3');
    setLoading(false);
  };

  const verifyAddress = async () => {
    if (!address) { setError('Ingresa una dirección'); return; }
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setError('Verificación por dirección en desarrollo');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Verificador (demo)</h3>
      <div className="mb-3 flex gap-2">
        <button className={`px-3 py-1 rounded ${mode==='token' ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white' : 'bg-gray-100'}`} onClick={() => setMode('token')}>Por Token ID</button>
        <button className={`px-3 py-1 rounded ${mode==='address' ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white' : 'bg-gray-100'}`} onClick={() => setMode('address')}>Por Dirección</button>
      </div>

      {mode==='token' ? (
        <div className="space-y-3">
          <Input placeholder="Ej: 1, 2 o 3" value={tokenId} onChange={(e) => setTokenId((e.target as HTMLInputElement).value)} />
          <Button onClick={verifyToken} loading={loading}>Verificar Badge</Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Input placeholder="0x..." value={address} onChange={(e) => setAddress((e.target as HTMLInputElement).value)} />
          <Button onClick={verifyAddress} loading={loading}>Verificar Dirección</Button>
        </div>
      )}

      <div className="mt-4">
        {result && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded">
            <div className="font-medium">Badge Verificado ✓</div>
            <div className="text-sm mt-2">Tipo: {result.badgeType}</div>
            <div className="text-sm">Propietario: <code className="font-mono text-xs break-all">{result.owner}</code></div>
          </div>
        )}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded text-sm">{error}</div>
        )}
      </div>
    </div>
  );
};

export default VerifierForm;
