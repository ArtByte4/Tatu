#!/usr/bin/env node

/**
 * Script de verificación de variables de entorno para ImageKit
 * Ejecutar con: node check-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFiles = ['.env.local', '.env'];
const requiredVars = ['VITE_PRIVATE_KEY_IMAGEKIT', 'VITE_PUBLIC_KEY_IMAGEKIT', 'VITE_API_URL'];

console.log('🔍 Verificando configuración de variables de entorno...\n');

let envFileFound = false;
let envFile = '';

// Buscar archivo .env
for (const file of envFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    envFileFound = true;
    envFile = file;
    console.log(`✅ Archivo encontrado: ${file}\n`);
    break;
  }
}

if (!envFileFound) {
  console.log('❌ No se encontró archivo .env o .env.local');
  console.log('\n📝 Para crear el archivo:');
  console.log('   1. Copia .env.example a .env.local:');
  console.log('      cp .env.example .env.local');
  console.log('   2. Edita .env.local y completa los valores');
  console.log('   3. Reinicia el servidor de desarrollo\n');
  process.exit(1);
}

// Leer y parsear archivo .env
const envPath = path.join(__dirname, envFile);
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('📋 Variables encontradas:\n');

let allValid = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  const isDefined = value !== undefined && value !== '';
  const hasVitePrefix = varName.startsWith('VITE_');
  
  if (isDefined) {
    const length = value.length;
    const isValidLength = varName.includes('KEY') ? length > 10 : length > 0;
    
    console.log(`  ${isDefined && isValidLength ? '✅' : '⚠️'} ${varName}`);
    console.log(`     Definida: ${isDefined ? 'Sí' : 'No'}`);
    console.log(`     Longitud: ${length} caracteres`);
    console.log(`     Prefijo VITE_: ${hasVitePrefix ? 'Sí' : 'No'}`);
    
    if (!isValidLength) {
      console.log(`     ⚠️  ADVERTENCIA: El valor parece estar vacío o es muy corto`);
      allValid = false;
    }
    console.log('');
  } else {
    console.log(`  ❌ ${varName}`);
    console.log(`     Definida: No`);
    console.log(`     ⚠️  REQUERIDA: Esta variable debe estar definida\n`);
    allValid = false;
  }
});

if (allValid) {
  console.log('✅ Todas las variables están correctamente configuradas!');
  console.log('\n💡 Si aún tienes problemas:');
  console.log('   1. Asegúrate de haber reiniciado el servidor de desarrollo');
  console.log('   2. Verifica que los valores no tengan espacios extra');
  console.log('   3. Verifica que no haya comillas alrededor de los valores');
} else {
  console.log('❌ Hay problemas con la configuración');
  console.log('\n📝 Pasos para corregir:');
  console.log('   1. Edita el archivo .env.local o .env');
  console.log('   2. Completa todas las variables requeridas');
  console.log('   3. Asegúrate de que los valores no tengan comillas');
  console.log('   4. Reinicia el servidor de desarrollo\n');
}

