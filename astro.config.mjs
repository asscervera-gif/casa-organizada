import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambia esto por tu dominio real cuando lo tengas (ver README.md)
const SITE_URL = 'https://tu-dominio-pendiente.example.com';

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
});
