#!/usr/bin/env node
// Publica automáticamente los 40 pines en Pinterest vía API oficial (v5).
//
// Requiere un token que TÚ generas en developers.pinterest.com y guardas en
// un archivo .env local (nunca se pega en el chat ni se sube a git).
//
// Uso:
//   1. Copia scripts/pinterest.env.example a .env en la raíz del proyecto
//   2. Rellena PINTEREST_ACCESS_TOKEN con tu token (ver README abajo)
//   3. npm run pinterest
//
// El script crea el tablero si no existe, sube cada pin como imagen en base64
// (no necesita hosting externo), y guarda un registro de lo ya publicado en
// estrategia/pines/publicados.json para no duplicar si se ejecuta de nuevo.

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function cargarEnv() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) {
    console.error('No existe .env en la raíz del proyecto. Copia scripts/pinterest.env.example a .env y rellénalo.');
    process.exit(1);
  }
  const contenido = readFileSync(envPath, 'utf8');
  const vars = {};
  for (const linea of contenido.split('\n')) {
    const m = linea.match(/^([A-Z_]+)=(.*)$/);
    if (m) vars[m[1]] = m[2].trim();
  }
  return vars;
}

const env = cargarEnv();
const TOKEN = env.PINTEREST_ACCESS_TOKEN;
let BOARD_ID = env.PINTEREST_BOARD_ID;
const SITE_URL = env.SITE_URL || 'https://casa-organizada.pages.dev';
const BOARD_NAME = env.PINTEREST_BOARD_NAME || 'Organización del hogar y oficina';

if (!TOKEN || TOKEN.includes('tu_token_aqui')) {
  console.error('Falta PINTEREST_ACCESS_TOKEN en .env (o sigue con el valor de ejemplo sin rellenar).');
  process.exit(1);
}

const API = 'https://api.pinterest.com/v5';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function obtenerOCrearTablero() {
  if (BOARD_ID) return BOARD_ID;

  const lista = await apiFetch('/boards?page_size=100');
  const existente = (lista.items || []).find((b) => b.name === BOARD_NAME);
  if (existente) {
    console.log(`Usando tablero existente: ${existente.name} (${existente.id})`);
    return existente.id;
  }

  const nuevo = await apiFetch('/boards', {
    method: 'POST',
    body: JSON.stringify({
      name: BOARD_NAME,
      description: 'Guías de compra y comparativas sobre organización del hogar y oficina.',
    }),
  });
  console.log(`Tablero creado: ${nuevo.name} (${nuevo.id})`);
  console.log(`Guarda esto en tu .env para no crear tableros duplicados: PINTEREST_BOARD_ID=${nuevo.id}`);
  return nuevo.id;
}

function extraerFrontmatter(contenido) {
  const match = contenido.match(/^---\n([\s\S]*?)\n---/);
  const bloque = match[1];
  const titleMatch = bloque.match(/title:\s*"([^"]+)"/);
  const descMatch = bloque.match(/description:\s*"([^"]+)"/);
  return { title: titleMatch ? titleMatch[1] : '', description: descMatch ? descMatch[1] : '' };
}

function cargarPublicados() {
  const p = join(root, 'estrategia', 'pines', 'publicados.json');
  if (!existsSync(p)) return {};
  return JSON.parse(readFileSync(p, 'utf8'));
}

function guardarPublicados(publicados) {
  const p = join(root, 'estrategia', 'pines', 'publicados.json');
  writeFileSync(p, JSON.stringify(publicados, null, 2), 'utf8');
}

async function crearPin(boardId, slug, title, description) {
  const imagenPath = join(root, 'estrategia', 'pines', `${slug}.png`);
  const imagenBase64 = readFileSync(imagenPath).toString('base64');

  const body = {
    board_id: boardId,
    title: title.slice(0, 100),
    description: description.slice(0, 500),
    link: `${SITE_URL}/articulos/${slug}/`,
    media_source: {
      source_type: 'image_base64',
      content_type: 'image/png',
      data: imagenBase64,
    },
  };

  return apiFetch('/pins', { method: 'POST', body: JSON.stringify(body) });
}

async function main() {
  const boardId = await obtenerOCrearTablero();
  const articulosDir = join(root, 'src', 'content', 'articulos');
  const archivos = readdirSync(articulosDir).filter((f) => f.endsWith('.md'));
  const publicados = cargarPublicados();

  let creados = 0;
  let saltados = 0;

  for (const archivo of archivos) {
    const slug = archivo.replace(/\.md$/, '');
    if (publicados[slug]) {
      saltados++;
      continue;
    }
    const contenido = readFileSync(join(articulosDir, archivo), 'utf8');
    const { title, description } = extraerFrontmatter(contenido);
    if (!title) continue;

    try {
      const pin = await crearPin(boardId, slug, title, description);
      publicados[slug] = { pinId: pin.id, fecha: new Date().toISOString() };
      guardarPublicados(publicados);
      creados++;
      console.log(`✓ Publicado: ${slug} (pin ${pin.id})`);
    } catch (err) {
      console.error(`✘ Error en ${slug}: ${err.message}`);
    }

    // Pausa entre pines para no saturar la API
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\nTotal: ${creados} pines publicados, ${saltados} ya estaban publicados de antes.`);
}

main();
