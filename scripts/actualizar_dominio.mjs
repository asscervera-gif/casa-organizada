#!/usr/bin/env node
// Sustituye el dominio placeholder por el real en todo el proyecto de una vez.
// Uso: npm run dominio -- https://tu-sitio-real.pages.dev

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const PLACEHOLDER = 'https://tu-dominio-pendiente.example.com';

const nuevaUrl = process.argv[2];
if (!nuevaUrl || !nuevaUrl.startsWith('http')) {
  console.error('Uso: npm run dominio -- https://tu-sitio-real.pages.dev');
  process.exit(1);
}
const urlLimpia = nuevaUrl.replace(/\/$/, '');

function reemplazarEnArchivo(ruta) {
  const contenido = readFileSync(ruta, 'utf8');
  if (!contenido.includes(PLACEHOLDER)) return false;
  writeFileSync(ruta, contenido.split(PLACEHOLDER).join(urlLimpia), 'utf8');
  return true;
}

let tocados = [];

if (reemplazarEnArchivo(join(root, 'astro.config.mjs'))) tocados.push('astro.config.mjs');
if (reemplazarEnArchivo(join(root, 'public', 'robots.txt'))) tocados.push('public/robots.txt');

const distribucionPath = join(root, 'estrategia', 'distribucion-pinterest-reddit.md');
const distribucion = readFileSync(distribucionPath, 'utf8');
if (distribucion.includes('[URL]')) {
  writeFileSync(distribucionPath, distribucion.split('[URL]').join(urlLimpia), 'utf8');
  tocados.push('estrategia/distribucion-pinterest-reddit.md ([URL] -> dominio real)');
}

console.log(`Dominio actualizado a: ${urlLimpia}`);
console.log('Archivos modificados:');
tocados.forEach((f) => console.log(`  - ${f}`));
if (tocados.length === 0) console.log('  (nada que actualizar, ya estaba configurado)');
