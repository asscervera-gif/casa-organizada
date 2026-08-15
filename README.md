# Casa Organizada — sitio de afiliación (organización y productividad)

Sitio estático (Astro) con guías de compra sobre organización de casa/oficina, monetizado con enlaces de afiliado. Pensado para ejecutarse gratis (sin coste de hosting) y con el mínimo mantenimiento posible.

## Aviso honesto antes de nada

Esto **no** es un negocio que genere 400 €/día ni ninguna cifra garantizada. Es una base real de sitio de afiliación:

- Un sitio nuevo tarda **meses** en posicionar en Google y empezar a tener tráfico relevante.
- Los ingresos de afiliación dependen del tráfico, y el tráfico depende de contenido constante, indexación y algo de suerte con el algoritmo de búsqueda.
- Nada de esto está garantizado. Trátalo como un proyecto a medio plazo, no como una fuente de ingresos inmediata.

## Qué está hecho (automatizado)

- Sitio completo con 8 artículos de guía de compra reales (no relleno) en el nicho de organización del hogar/oficina.
- SEO técnico: sitemap automático, robots.txt, metadatos por página.
- Diseño responsive, modo claro/oscuro.
- Script (`npm run nuevo-articulo`) para generar el esqueleto de un artículo nuevo rápidamente.

## Qué te falta hacer a ti (no lo puedo hacer yo)

Estos pasos requieren tu identidad, pagos o cuentas personales — no puedo completarlos por ti:

1. **Comprar un dominio** (ej. Namecheap, Porkbun — unos 10 €/año). Alternativa 100% gratis: usar un subdominio de Cloudflare Pages o GitHub Pages sin dominio propio.
2. **Desplegar el sitio gratis**: crea una cuenta en [Cloudflare Pages](https://pages.cloudflare.com) o [GitHub Pages](https://pages.github.com), conecta este proyecto (o sube el resultado de `npm run build`) y despliega. Ambas opciones son gratuitas y sin tarjeta.
3. **Solicitar Amazon Associates** (u otro programa de afiliados): regístrate en [afiliados.amazon.es](https://afiliados.amazon.es), espera la aprobación (Amazon pide ventas en los primeros 180 días o cierra la cuenta, así que hazlo cuando el sitio ya esté publicado y recibiendo algo de tráfico).
4. Cuando tengas tu ID de afiliado, sustituye `AFFILIATE_ID_PENDING` por tu tag real en todos los archivos de `src/content/articulos/*.md` (búscalo y reemplázalo).
5. **Actualiza `astro.config.mjs`** y `public/robots.txt` con tu dominio real una vez lo tengas.
6. Opcional: crea cuenta en Google Search Console para que Google indexe el sitio más rápido.

## Cómo trabajar en local

```bash
npm install
npm run dev       # sirve el sitio en localhost para verlo mientras editas
npm run build     # genera la versión final en dist/
npm run preview   # sirve la versión final localmente
```

## Añadir un artículo nuevo

```bash
npm run nuevo-articulo -- "Título del artículo" "Categoría" slug-opcional
```

Esto crea el esqueleto en `src/content/articulos/`. Rellena el texto, los productos y los enlaces de afiliado antes de publicar. También puedes pedirle a Claude que escriba el contenido y lo guarde directamente en ese archivo.

## Mantener el sitio con contenido nuevo

Publicar 1-2 artículos nuevos por semana es lo que más impacto tiene en el tráfico a medio plazo. Si quieres automatizar el recordatorio (no la escritura, que conviene revisar siempre), puedes usar la skill `schedule` o `loop` de Claude Code para que te avise periódicamente de que toca publicar contenido nuevo.

## Estructura del proyecto

```
src/
  layouts/Layout.astro       # plantilla base (header, footer, estilos)
  pages/index.astro          # portada con listado de artículos
  pages/articulos/[...slug].astro  # plantilla de artículo individual
  content/articulos/*.md     # artículos (frontmatter + texto)
  content/config.ts          # esquema de datos de los artículos
scripts/generar_articulo.mjs # generador de esqueleto de artículo nuevo
public/robots.txt
```
