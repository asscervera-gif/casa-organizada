#!/usr/bin/env node
// Verificación pre-lanzamiento: comprueba en segundos si el sitio está listo
// para desplegar de verdad, o qué falta exactamente. Uso: npm run verificar

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

let avisos = [];
let ok = [];

// 1. Dominio real configurado
const astroConfig = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
if (astroConfig.includes('tu-dominio-pendiente.example.com')) {
  avisos.push('astro.config.mjs sigue con el dominio placeholder — actualízalo con la URL real (Cloudflare Pages o dominio propio).');
} else {
  ok.push('Dominio configurado en astro.config.mjs.');
}

// 2. robots.txt con dominio real
const robots = readFileSync(join(root, 'public', 'robots.txt'), 'utf8');
if (robots.includes('tu-dominio-pendiente.example.com')) {
  avisos.push('public/robots.txt sigue apuntando al sitemap con el dominio placeholder.');
} else {
  ok.push('robots.txt con sitemap correcto.');
}

// 3. ID de afiliado pendiente
const articulosDir = join(root, 'src', 'content', 'articulos');
const archivos = readdirSync(articulosDir).filter((f) => f.endsWith('.md'));
let pendientes = 0;
for (const archivo of archivos) {
  const contenido = readFileSync(join(articulosDir, archivo), 'utf8');
  if (contenido.includes('AFFILIATE_ID_PENDING')) pendientes++;
}
if (pendientes > 0) {
  avisos.push(`${pendientes} artículo(s) todavía con AFFILIATE_ID_PENDING — sustituir en cuanto tengas el ID de Amazon Associates.`);
} else {
  ok.push('Todos los artículos tienen ID de afiliado real.');
}

// 4. Cada artículo tiene su pin de Pinterest generado
const pinesDir = join(root, 'estrategia', 'pines');
const slugsArticulos = archivos.map((f) => f.replace(/\.md$/, '')).sort();
let slugsPines = [];
if (existsSync(pinesDir)) {
  slugsPines = readdirSync(pinesDir)
    .filter((f) => f.endsWith('.png'))
    .map((f) => f.replace(/\.png$/, ''))
    .sort();
}
const sinPin = slugsArticulos.filter((s) => !slugsPines.includes(s));
if (sinPin.length > 0) {
  avisos.push(`${sinPin.length} artículo(s) sin pin de Pinterest generado: ${sinPin.join(', ')}`);
} else {
  ok.push(`Los ${slugsArticulos.length} artículos tienen su pin de Pinterest generado.`);
}

// 5. Repo git inicializado
if (!existsSync(join(root, '.git'))) {
  avisos.push('No hay repo git inicializado.');
} else {
  ok.push('Repo git local inicializado.');
}

console.log(`\n=== Verificación pre-lanzamiento — ${archivos.length} artículos ===\n`);
console.log('OK:');
ok.forEach((m) => console.log(`  ✓ ${m}`));
console.log('\nPendiente:');
if (avisos.length === 0) {
  console.log('  Ninguno — el sitio está listo para publicar tal cual.');
} else {
  avisos.forEach((m) => console.log(`  ⚠ ${m}`));
}
console.log('');
