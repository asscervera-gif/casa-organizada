import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, 'plantilla.html');
let html = fs.readFileSync(templatePath, 'utf-8');

const pines = [
  { archivo: 'armario-duplicar-espacio.png', titulo: '3 sistemas para duplicar el espacio de tu armario', subtitulo: 'Cajas plegables, colgantes y separadores de cajón — comparativa con precios' },
  { archivo: 'bano-espacio.png', titulo: 'Cómo ganar espacio en un baño pequeño', subtitulo: 'Estantería sobre inodoro, organizador de ducha y cesta giratoria' },
  { archivo: 'perchas-15-euros.png', titulo: 'El cambio de 15€ que duplica la capacidad de tu armario', subtitulo: 'Perchas en cascada vs terciopelo vs plegables: cuál elegir' },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 } });

for (const pin of pines) {
  let pageHtml = html
    .replace('TÍTULO DEL ARTÍCULO', pin.titulo)
    .replace('Subtítulo breve del artículo', pin.subtitulo);
  await page.setContent(pageHtml);
  await page.screenshot({ path: path.join(__dirname, pin.archivo) });
  console.log('Generado:', pin.archivo);
}

await browser.close();
