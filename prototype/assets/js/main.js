/* =====================================================================
   LATIN URBAN DANCE & FITNESS — "Compás"
   Todo el contenido es legible sin JavaScript: el horario es una tabla
   real, las clases son texto y los precios están en el HTML.
   Esto añade: duplicado de las cintas, filtros del horario, etiquetas de
   día en móvil, menú, cabecera compacta y barra fija.
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

  /* ---------- Entrada por scroll ---------- */
  const entradas = $$('.entra');
  if (quieto || !('IntersectionObserver' in window)) {
    entradas.forEach(el => el.classList.add('visible'));
  } else {
    const obs = new IntersectionObserver((es, o) => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        o.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .04 });
    entradas.forEach(el => obs.observe(el));
  }

  /* ---------- Cintas: se duplican para que el bucle no tenga corte ----------
     La copia se oculta a la tecnología asistiva: las disciplinas se leen
     una sola vez. */
  if (!quieto) {
    ['cinta-a', 'cinta-b'].forEach(id => {
      const lista = document.getElementById(id);
      if (!lista) return;
      const copia = lista.cloneNode(true);
      copia.removeAttribute('id');
      copia.setAttribute('aria-hidden', 'true');
      $$('li', copia).forEach(li => li.setAttribute('tabindex', '-1'));
      lista.parentElement.appendChild(copia);
    });
  }

  const cinta = $('.cinta');
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

  /* ---------- Horario ---------- */
  const tabla = $('#tabla');

  if (tabla) {
    /* En móvil la tabla se apila, así que cada clase necesita decir de qué
       día es. Se toma del encabezado de columna, no se escribe a mano. */
    const dias = $$('thead th', tabla).slice(1).map(th => th.textContent.trim());
    $$('tbody tr', tabla).forEach(tr => {
      $$('td', tr).forEach((td, i) => {
        const cl = $('.cl', td);
        if (cl && dias[i]) cl.setAttribute('data-dia', dias[i].slice(0, 3));
      });
    });

    /* Filtros: ocultan clases sin recargar ni mover la retícula */
    const filtros = $$('.filtro');
    const clases = $$('.cl', tabla);

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
          const cats = (cl.dataset.c || '').split(/\s+/);
          const ok = f === 'todo' || cats.includes(f);
          cl.classList.toggle('oculta', !ok);
          if (ok) visibles++;
        });

        // Se anuncia el resultado a quien no ve la tabla
        let avisa = $('#filtro-estado');
        if (!avisa) {
          avisa = document.createElement('p');
          avisa.id = 'filtro-estado';
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

  /* ---------- Menú de móvil ---------- */
  const btnMenu = $('#cab-menu');
  const nav = $('#nav');

  if (btnMenu && nav) {
    const cerrar = () => {
      nav.classList.remove('abierto');
      btnMenu.setAttribute('aria-expanded', 'false');
    };

    btnMenu.addEventListener('click', () => {
      const abierto = nav.classList.toggle('abierto');
      btnMenu.setAttribute('aria-expanded', String(abierto));
    });

    nav.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('abierto')) {
        cerrar();
        btnMenu.focus();
      }
    });

    matchMedia('(min-width: 1024px)').addEventListener('change', e => {
      if (e.matches) cerrar();
    });
  }

  /* ---------- Cabecera compacta y barra fija ---------- */
  const cab = $('#cab');
  const fija = $('#fija');
  const hero = $('.hero');

  if (cab || fija) {
    let tick = false;

    const alScroll = () => {
      const y = scrollY;
      if (cab) cab.classList.toggle('compacta', y > 24);
      if (fija) {
        const limite = hero ? hero.offsetHeight * .8 : 600;
        const visible = y > limite;
        fija.classList.toggle('visible', visible);
        fija.setAttribute('aria-hidden', String(!visible));
      }
      tick = false;
    };

    addEventListener('scroll', () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(alScroll);
    }, { passive: true });

    alScroll();
  }
})();
