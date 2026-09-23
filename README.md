# Latin Urban Dance & Fitness — Propuesta de homepage

Prototipo de homepage para **Studio Latin Urban Dance & Fitness**, studio de baile latino y urbano + fitness en Ciudad Lineal (Madrid), con programa propio (LUDF), formación certificada de instructores y masterclasses en Hamburgo y Berlín.

**Dirección estética:** *"Compás"* — el baile latino se cuenta en ochos. La página se maqueta sobre una retícula de 8 tiempos porque el método que enseña Junior Monzón combina *"baile, fitness y entrenamiento mental **en bloques**"*. La estructura de la página es la estructura musical del producto.

**El hero:** el nombre de la marca en cuatro líneas que encajan a sangre, alternando contorno turquesa, degradado naranja→magenta con sombra dura azul y blanco macizo — la construcción literal de su logo, a tamaño de cartel. El encaje es exacto (0 px de desbordamiento, verificado a 390 y 1440 px): `font-size: calc(100cqw / 5.4)` con un `font-stretch` por línea resuelto por bisección sobre el eje `wdth` de Anybody.

**El cambio con más valor:** su calendario de clases era **una imagen JPG**. Aquí es una tabla real, filtrable — la lee Google, la lee un lector de pantalla y se cambia una hora sin abrir Canva. Con ella salen a la luz los niveles ("Nivel básico", repetido en cada clase), las profesoras (Naomi, Valeria) y el Bailetón Latino de los sábados.

**Bloques nuevos** (con sus textos reales, ninguno inventado): el método LUDF · las 10 disciplinas explicadas · el horario filtrable · las objeciones ("No sé bailar nada", "No tengo pareja") · los 9 instructores con su bio.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Fuentes variables autoalojadas (Anybody + Archivo, 147 KB) e imágenes del cliente en WebP.

## Estructura
```
prototype/          Prototipo navegable (se publica en gh-pages con git subtree)
  index.html
  assets/css/       global.css · home.css
  assets/js/        main.js
  assets/fonts/     anybody · archivo (woff2 variables, latino)
  assets/img/       logo, sala y carteles del cliente
```

## Ver en local
```bash
cd prototype && python -m http.server 8000
```
Parámetro útil: `?ss` (sin animaciones, para capturas).

## Publicar
```bash
git subtree push --prefix=prototype origin gh-pages
```

---
Diseño y desarrollo: **Juan Jurado** · [jjuradogarciadelrio.com](https://jjuradogarciadelrio.com)
