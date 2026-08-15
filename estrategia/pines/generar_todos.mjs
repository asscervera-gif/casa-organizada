import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, 'plantilla.html');
const html = fs.readFileSync(templatePath, 'utf-8');

const articulosDir = path.join(__dirname, '..', '..', 'src', 'content', 'articulos');
const archivos = fs.readdirSync(articulosDir).filter((f) => f.endsWith('.md'));

function extraerFrontmatter(contenido) {
  const match = contenido.match(/^---\n([\s\S]*?)\n---/);
  const bloque = match[1];
  const titleMatch = bloque.match(/title:\s*"([^"]+)"/);
  const descMatch = bloque.match(/description:\s*"([^"]+)"/);
  return { title: titleMatch ? titleMatch[1] : '', description: descMatch ? descMatch[1] : '' };
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 } });

for (const archivo of archivos) {
  const slug = archivo.replace(/\.md$/, '');
  const contenido = fs.readFileSync(path.join(articulosDir, archivo), 'utf-8');
  const { title, description } = extraerFrontmatter(contenido);
  if (!title) continue;

  const subtitulo = description.length > 110 ? description.slice(0, 107) + '…' : description;

  let pageHtml = html
    .replace('TÍTULO DEL ARTÍCULO', escapeHtml(title))
    .replace('Subtítulo breve del artículo', escapeHtml(subtitulo));

  await page.setContent(pageHtml);
  await page.screenshot({ path: path.join(__dirname, `${slug}.png`) });
  console.log('Generado:', slug);
}

await browser.close();
console.log(`\nTotal: ${archivos.length} pines generados en estrategia/pines/`);
