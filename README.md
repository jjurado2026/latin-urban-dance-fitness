# Latin Urban Dance & Fitness — Propuesta de homepage

Prototipo de homepage para **Studio Latin Urban Dance & Fitness**, studio de baile latino y urbano + fitness en Ciudad Lineal (Madrid), con programa propio (LUDF), formación certificada de instructores y masterclasses en Hamburgo y Berlín.

**Dirección estética:** *"Compás"* — el baile latino se cuenta en ochos. La página se maqueta sobre una retícula de 8 tiempos porque el método que enseña Junior Monzón combina *"baile, fitness y entrenamiento mental **en bloques**"*. La estructura de la página es la estructura musical del producto.

**El hero:** el nombre de la marca en cuatro líneas que encajan a sangre en su columna, alternando contorno turquesa, degradado naranja→magenta con sombra dura azul y blanco macizo — la construcción literal de su logo, a tamaño de cartel. **Se ve entero sin hacer scroll en cualquier pantalla** (verificado de 320×460 a 2560×1300, también móvil en horizontal): el rótulo se dimensiona con el ancho de su columna y con el alto disponible, y `main.js` lo afina con medidas reales. Entra con una **cuenta de entrada** (la regla cuenta 1…8 y cada línea aparece en un tiempo) y después el compás sigue latiendo a 120 ppm; un foco de luz sigue al cursor. Al lado, la **próxima clase**, calculada en vivo con el propio horario.

**Movimiento, sección a sección:** títulos que entran palabra a palabra · la cinta de disciplinas acelera y se inclina con el scroll · *Baila, Entrena, Desafía* con su gesto (ecualizador de 8 barras, pulso, secuencia que memorizar) · las clases como **discos**: al pasar, el vinilo sale y gira; al pulsar, la funda se da la vuelta con la descripción · horario con **neón por familia** y vista previa al pasar por cada filtro · el equipo como **acreditaciones colgadas de un riel** que se balancean con física de péndulo · el abono ilimitado con un borde de luz que gira · la gira como **un libro que se hojea** en 3D · un sello de certificación que gira · el claim del pie letra a letra. Solo `transform` y `opacity`; los bucles solo corren con su sección a la vista; todo se desactiva con `prefers-reduced-motion`. Sin etiquetas pequeñas sobre los títulos.

**El cambio con más valor:** su calendario de clases era **una imagen JPG**. Aquí es una tabla real, filtrable — la lee Google, la lee un lector de pantalla y se cambia una hora sin abrir Canva. Con ella salen a la luz los niveles ("Nivel básico"), las clases para niños por edades y el Bailetón Latino de los sábados. Datos de la imagen vigente el 24-09-2026 ("horarios temporada 2026"); el cliente la cambió en dos días, que es justo el argumento.

**Bloques nuevos** (con sus textos reales, ninguno inventado): el método LUDF · las 10 disciplinas explicadas · el horario filtrable · las objeciones ("No sé bailar nada", "No tengo pareja") · los 9 instructores con su bio. Las imágenes son todas suyas (sala y carteles), sin stock.

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
