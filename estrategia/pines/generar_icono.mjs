import { chromium } from 'playwright';
import path from 'path';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
await page.goto('file://' + path.join(process.cwd(), 'icono_app.html'));
await page.screenshot({ path: path.join(process.cwd(), 'icono_app.png') });
await browser.close();
console.log('Generado icono_app.png');
