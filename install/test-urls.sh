#!/bin/bash

# 🎯 SCRIPT DE TESTING - URLs DINÁMICAS
# ====================================

echo "🔧 EqualPass - Sistema de URLs Dinámicas"
echo "========================================"

echo ""
echo "✅ ARCHIVOS ACTUALIZADOS:"
echo ""

echo "📁 FRONTEND (equalpass-system/)"
echo "  ✅ lib/api-config.ts - Config centralizada API"
echo "  ✅ src/lib/api.ts - Cliente API principal" 
echo "  ✅ src/lib/webauthn-utils.ts - URLs de NFT"
echo "  ✅ components/mint/mint-card.tsx - Endpoint claim"
echo "  ✅ components/zk/webauthn-card.tsx - Endpoint WebAuthn"
echo "  ✅ components/home/evidence-card.tsx - Endpoint eligibilidad"
echo "  ✅ vite.config.ts - Puerto de desarrollo"
echo "  ✅ .env - Variables de entorno del frontend"

echo ""
echo "📁 BACKEND (backend/)"
echo "  ✅ config/app.js - Config centralizada"
echo "  ✅ server-modular.js - Metadatos NFT y logs"
echo "  ✅ Endpoint /api/config - Config dinámica"

echo ""
echo "📁 CONFIGURACIÓN"
echo "  ✅ .env - Variables principales"
echo "  ✅ .env.test - Ejemplo con puertos 4000/4001"
echo "  ✅ DEPLOYMENT-GUIDE.md - Guía completa"

echo ""
echo "🧪 PARA PROBAR CON OTROS PUERTOS:"
echo ""
echo "1. Copia los archivos de test:"
echo "   cp .env.test .env"
echo "   cp equalpass-system/.env.test equalpass-system/.env"
echo ""
echo "2. Inicia el backend:"
echo "   cd backend && node server-modular.js"
echo ""
echo "3. Inicia el frontend:"
echo "   cd equalpass-system && npm run dev"
echo ""
echo "4. Verifica que use los puertos 4000/4001"

echo ""
echo "🌐 PARA DEPLOY EN PRODUCCIÓN:"
echo ""
echo "Edita .env principal y equalpass-system/.env con tus dominios:"
echo "FRONTEND_URL=https://tu-dominio.com"
echo "BACKEND_URL=https://api.tu-dominio.com"

echo ""
echo "🎉 ¡CONFIGURACIÓN COMPLETADA!"
echo "   No más URLs hardcodeadas = Deploy flexible ✨"