/* =====================================================================
   LATIN URBAN DANCE & FITNESS — "Neón"
   Todo el contenido es legible sin JavaScript. Esto añade: la aparición
   al hacer scroll, el duplicado de la marquesina, su botón de pausa, el
   menú de móvil, la cabecera compacta y la barra fija.
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

  /* ---------- Rótulos: capa de contorno y sombra ----------
     El degradado va en el elemento; el contorno turquesa y la sombra dura
     azul van en una copia colocada detrás. Se hace aquí y no con
     ::before{content:attr()} porque los titulares llevan <br>. La copia se
     oculta a la tecnología asistiva. */
  $$('.rotulo').forEach(el => {
    if (el.querySelector('.rotulo__eco')) return;
    const eco = document.createElement('span');
    eco.className = 'rotulo__eco';
    eco.setAttribute('aria-hidden', 'true');
    eco.innerHTML = el.innerHTML;
    el.insertBefore(eco, el.firstChild);
  });

  /* ---------- Aparición al entrar en pantalla ---------- */
  const apariciones = $$('.aparece');
  if (quieto || !('IntersectionObserver' in window)) {
    apariciones.forEach(el => el.classList.add('visible'));
  } else {
    const obs = new IntersectionObserver((entradas, o) => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        o.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .05 });
    apariciones.forEach(el => obs.observe(el));
  }

  /* ---------- Marquesina de disciplinas ----------
     Se duplica la lista para que el bucle no tenga corte visible. La copia
     se oculta a la tecnología asistiva: el lector de pantalla lee las 13
     disciplinas una sola vez. */
  const tira  = $('.tira');
  const pista = $('#tira-pista');
  const lista = $('#tira-lista');
  const btnTira = $('#tira-btn');

  if (pista && lista && !quieto) {
    const copia = lista.cloneNode(true);
    copia.removeAttribute('id');
    copia.setAttribute('aria-hidden', 'true');
    $$('li', copia).forEach(li => li.setAttribute('tabindex', '-1'));
    pista.appendChild(copia);
  }

  if (btnTira && tira) {
    btnTira.addEventListener('click', () => {
      const pausada = tira.classList.toggle('pausada');
      btnTira.setAttribute('aria-pressed', String(pausada));
      $('.vo', btnTira).textContent = pausada
        ? 'Reanudar el movimiento de las disciplinas'
        : 'Pausar el movimiento de las disciplinas';
    });
  }

  /* ---------- Menú de móvil ---------- */
  const btnMenu = $('#cab-menu');
  const nav     = $('#nav');

  if (btnMenu && nav) {
    const cerrar = () => {
      nav.classList.remove('abierto');
      btnMenu.setAttribute('aria-expanded', 'false');
    };

    btnMenu.addEventListener('click', () => {
      const abierto = nav.classList.toggle('abierto');
      btnMenu.setAttribute('aria-expanded', String(abierto));
    });

    nav.addEventListener('click', e => {
      if (e.target.closest('a')) cerrar();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('abierto')) {
        cerrar();
        btnMenu.focus();
      }
    });

    matchMedia('(min-width: 1080px)').addEventListener('change', e => {
      if (e.matches) cerrar();
    });
  }

  /* ---------- Cabecera compacta y barra fija ---------- */
  const cab  = $('#cab');
  const fija = $('#fija');
  const hero = $('.hero');

  if (cab || fija) {
    let ticking = false;

    const alScroll = () => {
      const y = scrollY;

      if (cab) cab.classList.toggle('compacta', y > 12);

      if (fija) {
        const limite = hero ? hero.offsetHeight * .75 : 600;
        const visible = y > limite;
        fija.classList.toggle('visible', visible);
        fija.setAttribute('aria-hidden', String(!visible));
      }

      ticking = false;
    };

    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(alScroll);
    }, { passive: true });

    alScroll();
  }
})();
