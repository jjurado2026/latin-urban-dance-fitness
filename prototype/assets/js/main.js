/* =====================================================================
   LATIN URBAN DANCE & FITNESS — "Compás"
   Todo el contenido es legible sin JavaScript: el horario es una tabla
   real, las clases son texto y los precios están en el HTML.
   Esto añade: entradas por scroll, próxima clase, filtros del horario,
   cintas, carrusel de fechas, menú, cabecera compacta, progreso de
   lectura y barra fija.
   Parámetro ?ss → sin animaciones (para capturas).
   ===================================================================== */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const captura  = location.search.includes('ss');
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const quieto   = captura || reducido;

  if (captura) {
    document.documentElement.classList.add('captura');
    $$('img[loading="lazy"]').forEach(i => (i.loading = 'eager'));
  }

  /* ---------- Horario: una sola fuente de datos ----------
     La próxima clase del hero y las etiquetas de día en móvil salen de la
     tabla. Cambiar una hora en el HTML la cambia en todas partes. */
  const tabla = $('#tabla');
  const dias = tabla ? $$('thead th', tabla).slice(1).map(th => th.textContent.trim()) : [];
  const clasesSemana = [];

  if (tabla) {
    $$('tbody tr', tabla).forEach((tr, fila) => {
      const inicio = ($('.hora', tr)?.firstChild?.textContent || '').trim();
      const [hh, mm] = inicio.split(':').map(Number);
      $$('td', tr).forEach((td, col) => {
        const cl = $('.cl', td);
        if (!cl) return;
        if (dias[col]) cl.setAttribute('data-dia', dias[col].slice(0, 3));
        // Barrido de la semana: izquierda → derecha, franja a franja
        td.classList.add('g');
        td.style.setProperty('--i', col + fila);
        clasesSemana.push({
          dia: col + 1,                              // lunes = 1 … sábado = 6 (Date.getDay)
          min: hh * 60 + mm,
          hora: inicio,
          nombre: $('.cl__n', cl)?.textContent.trim() || '',
          basico: !!$('.badge', cl),
          extra: $('.cl__extra', cl)?.textContent.trim() || ''
        });
      });
    });
  }

  /* ---------- Próxima clase (hero) ---------- */
  const proxima = $('#proxima');
  if (proxima && clasesSemana.length) {
    const ahora = new Date();
    const hoy = ahora.getDay();
    const minAhora = ahora.getHours() * 60 + ahora.getMinutes();
    let hallada = null;

    for (let d = 0; d < 7 && !hallada; d++) {
      const dia = (hoy + d) % 7;
      const candidatas = clasesSemana
        .filter(c => c.dia === dia && (d > 0 || c.min > minAhora))
        .sort((a, b) => a.min - b.min);
      if (candidatas.length) hallada = { c: candidatas[0], d, dia };
    }

    if (hallada) {
      const { c, d, dia } = hallada;
      const cuando = d === 0 ? 'Hoy' : d === 1 ? 'Mañana' : (dias[dia - 1] || '');
      $('#proxima-cuando').textContent = `${cuando}, ${c.hora}`;
      const que = $('#proxima-que');
      que.textContent = c.nombre + (c.extra ? ` · ${c.extra}` : '');
      if (c.basico) {
        const b = document.createElement('b');
        b.className = 'badge';
        b.textContent = 'Nivel básico';
        que.append(b);
      }
      proxima.setAttribute('aria-label', `Próxima clase: ${cuando}, ${c.hora}, ${c.nombre}. Ver el horario`);
      proxima.hidden = false;
    }
  }

  /* ---------- Ola: el --i de cada tarjeta es su columna real ----------
     Así las rejillas entran fila a fila, de izquierda a derecha, sea cual
     sea el número de columnas del ancho actual. */
  const olas = $$('[data-ola]');
  const numerarOla = () => {
    olas.forEach(lista => {
      const cols = getComputedStyle(lista).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
      [...lista.children].forEach((el, i) => el.style.setProperty('--i', i % cols));
    });
  };
  numerarOla();

  /* ---------- Entradas por scroll: una vez por elemento ---------- */
  const entradas = $$('.entra, [data-grupo]');
  if (quieto || !('IntersectionObserver' in window)) {
    entradas.forEach(el => el.classList.add('visible'));
  } else {
    const obs = new IntersectionObserver((es, o) => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        o.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    entradas.forEach(el => obs.observe(el));
  }

  /* ---------- Cintas: se duplican para que el bucle no tenga corte ----------
     La copia se oculta a la tecnología asistiva: las disciplinas se leen
     una sola vez. Fuera de pantalla se paran (no gastan batería). */
  const cinta = $('.cinta');
  if (!quieto) {
    ['cinta-a', 'cinta-b'].forEach(id => {
      const lista = document.getElementById(id);
      if (!lista) return;
      const copia = lista.cloneNode(true);
      copia.removeAttribute('id');
      copia.setAttribute('aria-hidden', 'true');
      lista.parentElement.appendChild(copia);
    });
    if (cinta && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => cinta.classList.toggle('fuera', !e.isIntersecting))
        .observe(cinta);
    }
  }

  const btnCinta = $('#cinta-btn');
  if (cinta && btnCinta) {
    btnCinta.addEventListener('click', () => {
      const pausada = cinta.classList.toggle('pausada');
      btnCinta.setAttribute('aria-pressed', String(pausada));
      $('.vo', btnCinta).textContent = pausada
        ? 'Reanudar el movimiento de las disciplinas'
        : 'Pausar el movimiento de las disciplinas';
    });
  }

  /* ---------- Filtros del horario ---------- */
  if (tabla) {
    const filtros = $$('.filtro');
    const clases = $$('.cl', tabla);
    let avisa = null;

    filtros.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.f;

        filtros.forEach(b => {
          const on = b === btn;
          b.classList.toggle('filtro--on', on);
          b.setAttribute('aria-pressed', String(on));
        });

        let visibles = 0;
        clases.forEach(cl => {
          const ok = f === 'todo' || (cl.dataset.c || '').split(/\s+/).includes(f);
          cl.classList.toggle('oculta', !ok);
          cl.tabIndex = ok ? 0 : -1;       // atenuadas: siguen a la vista, fuera del tabulador
          if (ok) visibles++;
        });

        // Se anuncia el resultado a quien no ve la tabla
        if (!avisa) {
          avisa = document.createElement('p');
          avisa.className = 'vo';
          avisa.setAttribute('role', 'status');
          $('.filtros').after(avisa);
        }
        avisa.textContent = f === 'todo'
          ? `Mostrando las ${visibles} clases de la semana.`
          : `${visibles} clases coinciden con el filtro.`;
      });
    });
  }

  /* ---------- Carrusel de fechas: flechas y arrastre con ratón ---------- */
  const pista = $('#tour-pista');
  if (pista) {
    const botones = $$('.tour__b');
    const paso = () => (pista.querySelector('.fecha')?.getBoundingClientRect().width || 300) + 20;

    const actualizar = () => {
      const max = pista.scrollWidth - pista.clientWidth - 2;
      botones.forEach(b => {
        b.disabled = b.dataset.dir === '-1' ? pista.scrollLeft <= 2 : pista.scrollLeft >= max;
      });
    };
    botones.forEach(b => b.addEventListener('click', () => {
      pista.scrollBy({ left: Number(b.dataset.dir) * paso(), behavior: quieto ? 'auto' : 'smooth' });
    }));
    pista.addEventListener('scroll', actualizar, { passive: true });
    addEventListener('resize', actualizar);
    actualizar();

    // Arrastre: solo con ratón; el táctil ya desliza de forma nativa
    let x0 = 0, s0 = 0, movido = false, activo = false;
    pista.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      activo = true; movido = false; x0 = e.clientX; s0 = pista.scrollLeft;
    });
    addEventListener('pointermove', e => {
      if (!activo) return;
      const dx = e.clientX - x0;
      if (!movido && Math.abs(dx) > 6) { movido = true; pista.classList.add('arrastrando'); }
      if (movido) pista.scrollLeft = s0 - dx;
    });
    addEventListener('pointerup', () => {
      if (!activo) return;
      activo = false;
      if (movido) {
        // Suelta y deja que el snap asiente la tarjeta más cercana
        requestAnimationFrame(() => pista.classList.remove('arrastrando'));
      }
    });
    // Si se arrastró, el soltar no debe abrir el enlace
    pista.addEventListener('click', e => { if (movido) { e.preventDefault(); movido = false; } }, true);
  }

  /* ---------- Menú de móvil ---------- */
  const btnMenu = $('#cab-menu');
  const nav = $('#nav');

  if (btnMenu && nav) {
    const cerrar = (instante = false) => {
      if (instante) nav.classList.add('al-instante');
      nav.classList.remove('abierto');
      btnMenu.setAttribute('aria-expanded', 'false');
      if (instante) requestAnimationFrame(() => nav.classList.remove('al-instante'));
    };

    btnMenu.addEventListener('click', () => {
      const abierto = nav.classList.toggle('abierto');
      btnMenu.setAttribute('aria-expanded', String(abierto));
    });

    nav.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });

    // Con teclado no se anima: Escape cierra al instante
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('abierto')) {
        cerrar(true);
        btnMenu.focus();
      }
    });

    document.addEventListener('click', e => {
      if (nav.classList.contains('abierto') && !e.target.closest('#nav, #cab-menu')) cerrar();
    });

    matchMedia('(min-width: 1024px)').addEventListener('change', e => {
      if (e.matches) cerrar(true);
    });
  }

  /* ---------- Cabecera compacta, progreso y barra fija ---------- */
  const cab = $('#cab');
  const fija = $('#fija');
  const hero = $('.hero');
  const progreso = $('#progreso');
  const progresoNativo = CSS.supports && CSS.supports('animation-timeline: scroll()');

  let tick = false;
  const alScroll = () => {
    const y = scrollY;
    if (cab) cab.classList.toggle('compacta', y > 24);
    if (progreso && !progresoNativo) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progreso.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
    if (fija) {
      const limite = hero ? hero.offsetHeight * .8 : 600;
      const visible = y > limite;
      fija.classList.toggle('visible', visible);
      fija.setAttribute('aria-hidden', String(!visible));
      fija.inert = !visible;               // escondida = no enfocable
    }
    tick = false;
  };

  addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(alScroll);
  }, { passive: true });

  let rz;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { numerarOla(); alScroll(); }, 150);
  });

  alScroll();
})();
