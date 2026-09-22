# Latin Urban Dance & Fitness — Propuesta de remaquetación de la homepage

Prototipo de homepage para **Latin Urban Dance & Fitness**, studio de baile latino y urbano + fitness en Ciudad Lineal (Madrid), con programa propio (LUDF), formación certificada de instructores y masterclasses en Hamburgo y Berlín.

**Qué es:** la misma home que tienen hoy — sus bloques, en su orden, con sus textos y sus imágenes — remaquetada con los colores de su propio logo.
**Qué no es:** no añade secciones ni contenido nuevo. Las mejoras de fondo se recogen aparte, en la propuesta.

**Dirección estética:** *"Neón"* — su logo es un rótulo de neón (contorno turquesa, sombra dura azul, relleno naranja→magenta) diseñado sobre negro, y su web lo pone sobre blanco. Aquí la página es la sala donde ese neón está encendido, y el tratamiento del logo se convierte en sistema tipográfico.

**El cambio con más valor:** su calendario de clases era **una imagen JPG**. Aquí es una tabla real — la lee Google, la lee un lector de pantalla y se cambia una hora sin abrir Canva. Con ella salen a la luz los niveles, las profesoras (Naomi, Valeria) y el Bailetón Latino de los sábados, que hoy están invisibles dentro del archivo.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Fuentes autoalojadas (Anton + Outfit) e imágenes del cliente en WebP.

## Estructura
```
prototype/          Prototipo navegable (se publica en gh-pages con git subtree)
  index.html
  assets/css/       global.css · home.css
  assets/js/        main.js
  assets/fonts/     anton · outfit (woff2, latino)
  assets/img/       logo y banners del cliente
```

## Ver en local
```bash
cd prototype && python -m http.server 8000
```
Parámetro útil para revisar: `?ss` (sin animaciones, para capturas).

## Publicar
```bash
git subtree push --prefix=prototype origin gh-pages
```

---
Diseño y desarrollo: **Juan Jurado** · [jjuradogarciadelrio.com](https://jjuradogarciadelrio.com)
