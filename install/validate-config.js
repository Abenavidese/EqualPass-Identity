#!/usr/bin/env node

// Script de validación de configuración de URLs
console.log("🔍 Validando configuración de URLs...\n");

// Validar variables de entorno del proyecto principal
require("dotenv").config({ path: "./.env" });

const requiredMainVars = ["FRONTEND_URL", "BACKEND_URL"];
const missingMainVars = [];

requiredMainVars.forEach(varName => {
  if (!process.env[varName]) {
    missingMainVars.push(varName);
  } else {
    console.log(`✅ ${varName}: ${process.env[varName]}`);
  }
});

if (missingMainVars.length > 0) {
  console.log(`❌ Variables faltantes en .env principal: ${missingMainVars.join(", ")}`);
  process.exit(1);
}

// Validar archivo .env del frontend
try {
  const fs = require("fs");
  const frontendEnv = fs.readFileSync("./equalpass-system/.env", "utf8");
  
  const frontendRequiredVars = [
    "NEXT_PUBLIC_FRONTEND_URL",
    "NEXT_PUBLIC_BACKEND_URL", 
    "NEXT_PUBLIC_API_BASE_URL",
    "NEXT_PUBLIC_NFT_BASE_URL"
  ];
  
  frontendRequiredVars.forEach(varName => {
    if (frontendEnv.includes(varName)) {
      console.log(`✅ Frontend ${varName}: configurado`);
    } else {
      console.log(`❌ Frontend ${varName}: faltante`);
    }
  });
  
} catch (error) {
  console.log("❌ No se encontró .env del frontend");
}

// Verificar que no queden URLs hardcodeadas
const { execSync } = require("child_process");

try {
  console.log("\n🔍 Buscando URLs hardcodeadas restantes...");
  
  // Buscar en frontend
  try {
    const frontendMatches = execSync('grep -r "localhost:300" equalpass-system/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null || true', { encoding: 'utf8' });
    if (frontendMatches.trim()) {
      console.log("⚠️  URLs hardcodeadas encontradas en frontend:");
      console.log(frontendMatches);
    } else {
      console.log("✅ No se encontraron URLs hardcodeadas en frontend");
    }
  } catch (e) {
    console.log("✅ No se encontraron URLs hardcodeadas en frontend");
  }
  
  // Buscar en backend
  try {
    const backendMatches = execSync('grep -r "localhost:300" backend/ --include="*.js" 2>/dev/null || true', { encoding: 'utf8' });
    if (backendMatches.trim()) {
      console.log("⚠️  URLs hardcodeadas encontradas en backend:");
      console.log(backendMatches);
    } else {
      console.log("✅ No se encontraron URLs hardcodeadas en backend JS");
    }
  } catch (e) {
    console.log("✅ No se encontraron URLs hardcodeadas en backend JS");
  }
  
} catch (error) {
  console.log("⚠️  No se pudo ejecutar búsqueda de URLs (grep no disponible en Windows)");
}

console.log("\n🎉 Validación completada!");
console.log("\n📝 Para probar con diferentes URLs:");
console.log("1. Modifica las URLs en el archivo .env principal");
console.log("2. Modifica las URLs en equalpass-system/.env");
console.log("3. Reinicia ambos servicios");