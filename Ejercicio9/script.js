document.addEventListener('DOMContentLoaded', () => {
  // Año
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Tema
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) html.setAttribute('data-theme', saved);
  themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Menú móvil
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  navToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Búsqueda y orden
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const grid = document.querySelector('.grid-posts');
  const posts = Array.from(document.querySelectorAll('.post'));

  function render(list) {
    grid.innerHTML = '';
    list.forEach(p => grid.appendChild(p));
  }
  function apply() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    let list = posts.filter(p => p.dataset.title.toLowerCase().includes(q));
    const sort = sortSelect.value;
    if (sort === 'recientes') {
      list.sort((a,b) => b.dataset.date.localeCompare(a.dataset.date));
    } else if (sort === 'antiguos') {
      list.sort((a,b) => a.dataset.date.localeCompare(b.dataset.date));
    } else if (sort === 'titulo') {
      list.sort((a,b) => a.dataset.title.localeCompare(b.dataset.title));
    }
    render(list);
  }
  searchForm?.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
  searchInput?.addEventListener('input', apply);
  sortSelect?.addEventListener('change', apply);

  // Filtros por categoría
  const chips = Array.from(document.querySelectorAll('.chip[data-filter]'));
  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    ch.classList.add('is-active');
    const f = ch.dataset.filter;
    posts.forEach(p => {
      p.style.display = (f === 'all' || p.dataset.cat === f) ? '' : 'none';
    });
  }));

  // Lectura ampliada (dialog con contenido simulado)
  const reader = document.getElementById('reader');
  const readerTitle = document.getElementById('readerTitle');
  const readerBody = document.getElementById('readerBody');
  const readerClose = document.getElementById('readerClose');
  const corpus = {
    p1: {
      title: 'Chips de próxima generación impulsan la IA en el borde',
      body: [
        'Los nuevos aceleradores introducen núcleos especializados y memoria compartida para cargas de inferencia locales.',
        'Fabricantes señalan mejoras en eficiencia energética y latencia, habilitando experiencias sin conexión.'
      ]
    },
    p2: {
      title: 'GPUs con memoria HBM4 llegan al mercado',
      body: [
        'La cuarta generación de HBM incrementa el ancho de banda y densidad, impulsando el rendimiento.',
        'Primeras tarjetas enfocadas en data centers y entrenamiento de modelos.'
      ]
    },
    p3: {
      title: 'Nuevo framework web prioriza el streaming de datos',
      body: [
        'El framework adopta renderizado progresivo y caching incremental por defecto.',
        'Mejoras notables en TTFB y en experiencias colaborativas en tiempo real.'
      ]
    },
    p4: {
      title: 'Investigadores alertan sobre ataque a cadenas de suministro',
      body: [
        'El reporte sugiere firmar artefactos y monitorear integridad de dependencias.',
        'Crecen los incidentes de inyección en pipelines CI/CD.'
      ]
    },
    p5: {
      title: 'Gran fusión en el sector de semiconductores',
      body: [
        'La operación busca sinergias en diseño y fabricación para competir por liderazgo.',
        'Reguladores analizarán el impacto en competencia e innovación.'
      ]
    }
  };
  function openReader(id) {
    const art = corpus[id];
    if (!art) return;
    readerTitle.textContent = art.title;
    readerBody.innerHTML = art.body.map(p => '<p>' + p + '</p>').join('');
    if (typeof reader.showModal === 'function') reader.showModal();
  }
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.read');
    if (!btn) return;
    e.preventDefault();
    openReader(btn.dataset.id);
  });
  readerClose?.addEventListener('click', () => reader.close());
  reader?.addEventListener('click', (e) => {
    const inside = e.target.closest('.reader__content');
    if (!inside) reader.close();
  });

  // Acciones del lector (simuladas)
  document.getElementById('shareBtn')?.addEventListener('click', () => alert('Compartido (simulado).'));
  document.getElementById('saveBtn')?.addEventListener('click', () => alert('Guardado (simulado).'));

  // Cargar más (simulado)
  const loadMore = document.getElementById('loadMore');
  loadMore?.addEventListener('click', () => {
    const tpl = [
      { id:'p6', cat:'ia', date:'2025-06-30', title:'Modelo ligero mejora rendimiento en móviles', img:'https://picsum.photos/seed/p6/800/480' },
      { id:'p7', cat:'software', date:'2025-06-22', title:'Herramienta CLI acelera despliegues', img:'https://picsum.photos/seed/p7/800/480' },
      { id:'p8', cat:'seguridad', date:'2025-06-10', title:'Nueva guía de hardening para contenedores', img:'https://picsum.photos/seed/p8/800/480' }
    ];
    tpl.forEach(t => {
      const card = document.createElement('article');
      card.className = 'post card';
      card.dataset.cat = t.cat;
      card.dataset.date = t.date;
      card.dataset.id = t.id;
      card.dataset.title = t.title;
      card.innerHTML = \`
        <img src="\${t.img}" alt="\${t.title}" loading="lazy" />
        <h2>\${t.title}</h2>
        <p class="muted">Resumen de la nota.</p>
        <div class="meta">\${t.cat.charAt(0).toUpperCase() + t.cat.slice(1)} · <time datetime="\${t.date}">\${t.date}</time></div>
        <button class="btn read" data-id="\${t.id}">Leer</button>
      \`;
      grid.appendChild(card);
      posts.push(card);
      corpus[t.id] = { title: t.title, body: ['Contenido ampliado simulado para ' + t.title + '.'] };
    });
    alert('Se cargaron más noticias (simulado).');
  });

  // Validación de contacto
  const form = document.getElementById('contactForm');
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  function setHelp(el, txt='') { const help = el.parentElement.querySelector('.help'); if (help) help.textContent = txt; }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    if (name.value.trim().length < 3) { setHelp(name, 'Ingrese al menos 3 caracteres.'); ok = false; } else setHelp(name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { setHelp(email, 'Correo no válido.'); ok = false; } else setHelp(email);
    if (message.value.trim().length < 10) { setHelp(message, 'Mensaje demasiado corto.'); ok = false; } else setHelp(message);
    if (!ok) return;
    alert('Gracias por contactarnos. Pronto responderemos su mensaje.');
    form.reset();
  });

  // To top
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) toTop.style.display = 'inline-block';
    else toTop.style.display = 'none';
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
