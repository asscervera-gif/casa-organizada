#!/usr/bin/env node
// Crea el esqueleto de un nuevo artículo en src/content/articulos/.
// Uso: npm run nuevo-articulo -- "Título del artículo" "categoria" "slug-del-articulo"
// El contenido real (texto, productos, enlaces de afiliado) hay que rellenarlo
// a mano o pidiéndole a Claude que lo escriba y lo guarde en el archivo generado.

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const [title, category, slugArg] = process.argv.slice(2);

if (!title || !category) {
  console.error('Uso: npm run nuevo-articulo -- "Título" "Categoría" [slug-opcional]');
  process.exit(1);
}

const slug =
  slugArg ||
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const dir = join(__dirname, '..', 'src', 'content', 'articulos');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const filePath = join(dir, `${slug}.md`);
if (existsSync(filePath)) {
  console.error(`Ya existe un artículo con ese slug: ${filePath}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const template = `---
title: "${title}"
description: "TODO: escribe una descripción de 1-2 frases para SEO/meta."
pubDate: ${today}
category: "${category}"
products:
  - name: "TODO: nombre del producto"
    priceRange: "TODO: rango de precio"
    pros: ["TODO"]
    cons: ["TODO"]
    affiliateUrl: "https://www.amazon.es/s?k=TODO&tag=AFFILIATE_ID_PENDING"
---

TODO: cuerpo del artículo (introducción, guía de compra, preguntas frecuentes).
`;

writeFileSync(filePath, template, 'utf8');
console.log(`Artículo creado: ${filePath}`);
console.log('Rellena el contenido antes de publicar (título, descripción, productos y texto).');
