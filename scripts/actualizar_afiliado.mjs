#!/usr/bin/env node
// Sustituye AFFILIATE_ID_PENDING por tu ID real de Amazon Associates en todos los artículos.
// Uso: npm run afiliado -- tuid-21

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const articulosDir = join(__dirname, '..', 'src', 'content', 'articulos');

const id = process.argv[2];
if (!id) {
  console.error('Uso: npm run afiliado -- tuid-21');
  process.exit(1);
}

const archivos = readdirSync(articulosDir).filter((f) => f.endsWith('.md'));
let total = 0;

for (const archivo of archivos) {
  const ruta = join(articulosDir, archivo);
  const contenido = readFileSync(ruta, 'utf8');
  if (!contenido.includes('AFFILIATE_ID_PENDING')) continue;
  const nuevo = contenido.split('AFFILIATE_ID_PENDING').join(id);
  writeFileSync(ruta, nuevo, 'utf8');
  total++;
}

console.log(`ID de afiliado actualizado a "${id}" en ${total} artículo(s).`);
