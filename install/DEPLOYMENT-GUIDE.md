# 🌐 Guía de Configuración de URLs para Deploy

## 📋 Resumen

Este proyecto ahora usa variables de entorno para todas las URLs, lo que permite cambiar fácilmente entre localhost, staging y producción sin modificar código.

## 🔧 Configuración

### 1. Variables principales (archivo `.env` raíz)
```bash
# URLs Base del Sistema
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Configuración de Puertos
FRONTEND_PORT=3000
BACKEND_PORT=3001
```

### 2. Variables del Frontend (`equalpass-system/.env`)
```bash
# Frontend Configuration
FRONTEND_PORT=3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# API Endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_NFT_BASE_URL=http://localhost:3001
```

## 🚀 Para Deploy en Producción

### Cambiar URLs para producción:

1. **Archivo `.env` principal:**
```bash
FRONTEND_URL=https://tu-dominio-frontend.com
BACKEND_URL=https://tu-dominio-backend.com
FRONTEND_PORT=3000
BACKEND_PORT=3001
```

2. **Archivo `equalpass-system/.env`:**
```bash
FRONTEND_PORT=3000
NEXT_PUBLIC_FRONTEND_URL=https://tu-dominio-frontend.com
NEXT_PUBLIC_BACKEND_URL=https://tu-dominio-backend.com
NEXT_PUBLIC_API_BASE_URL=https://tu-dominio-backend.com/api
NEXT_PUBLIC_NFT_BASE_URL=https://tu-dominio-backend.com
```

## 🧪 Testing con URLs Personalizadas

Para probar con diferentes puertos o dominios:

```bash
# Ejemplo: Frontend en 4000, Backend en 4001
FRONTEND_URL=http://localhost:4000
BACKEND_URL=http://localhost:4001
FRONTEND_PORT=4000
BACKEND_PORT=4001
```

Y actualizar el frontend:
```bash
NEXT_PUBLIC_FRONTEND_URL=http://localhost:4000
NEXT_PUBLIC_BACKEND_URL=http://localhost:4001
NEXT_PUBLIC_API_BASE_URL=http://localhost:4001/api
NEXT_PUBLIC_NFT_BASE_URL=http://localhost:4001
```

## ✅ Validación

Ejecuta el script de validación:
```bash
node validate-config.js
```

## 🎯 Ubicaciones Actualizadas

### Frontend:
- ✅ `lib/api-config.ts` - Configuración centralizada de API
- ✅ `src/lib/api.ts` - Cliente API
- ✅ `src/lib/webauthn-utils.ts` - URLs de NFT
- ✅ `components/mint/mint-card.tsx` - Endpoint de claim
- ✅ `components/zk/webauthn-card.tsx` - Endpoint de WebAuthn
- ✅ `components/home/evidence-card.tsx` - Endpoint de eligibilidad
 
### Backend:
- ✅ `config/app.js` - Configuración centralizada
- ✅ `server-modular.js` - Metadatos NFT y logs
- ✅ Endpoint `/api/config` - Configuración dinámica

## 🔄 Comandos de Inicio

```bash
# Backend
cd backend
node server-modular.js

# Frontend (en otra terminal)
cd equalpass-system  
npm run dev
```

## 🌍 Ejemplos de Deploy

### Localhost
```bash
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

### Desarrollo/Testing
```bash
FRONTEND_URL=http://192.168.1.100:3000
BACKEND_URL=http://192.168.1.100:3001
```

### Producción
```bash
FRONTEND_URL=https://equalpass.com
BACKEND_URL=https://api.equalpass.com
```

¡Ahora puedes cambiar las URLs sin tocar ni una línea de código! 🎉