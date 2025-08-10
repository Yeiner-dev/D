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

  // Filtros de carta
  const chips = Array.from(document.querySelectorAll('.chip[data-filter]'));
  const platos = Array.from(document.querySelectorAll('.plato'));
  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    ch.classList.add('is-active');
    const f = ch.dataset.filter;
    platos.forEach(p => p.style.display = (f === 'all' || p.dataset.cat === f) ? '' : 'none');
  }));

  // Pedido ficticio
  const pedidoDrawer = document.getElementById('pedidoDrawer');
  const pedidoItems = document.getElementById('pedidoItems');
  const pedidoClose = document.getElementById('pedidoClose');
  const pedidoConfirm = document.getElementById('pedidoConfirm');
  const state = { items: {} }; // id -> {name, qty}

  function renderPedido() {
    pedidoItems.innerHTML = '';
    Object.values(state.items).forEach(it => {
      const row = document.createElement('div');
      row.className = 'pedido-item';
      row.innerHTML = \`
        <span>\${it.name}</span>
        <span>x \${it.qty}</span>
      \`;
      pedidoItems.appendChild(row);
    });
    pedidoDrawer.classList.toggle('open', Object.keys(state.items).length > 0);
    pedidoDrawer.setAttribute('aria-hidden', Object.keys(state.items).length ? 'false' : 'true');
  }

  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.add');
    if (!btn) return;
    const card = btn.closest('.plato');
    const id = btn.dataset.id;
    const name = card.dataset.name;
    const it = state.items[id] || { name, qty: 0 };
    it.qty += 1;
    state.items[id] = it;
    renderPedido();
  });

  pedidoClose?.addEventListener('click', () => {
    pedidoDrawer.classList.remove('open');
  });

  pedidoConfirm?.addEventListener('click', () => {
    if (!Object.keys(state.items).length) {
      alert('No hay selecciones.');
      return;
    }
    alert('Pedido enviado (simulado). ¡Gracias!');
    for (const k of Object.keys(state.items)) delete state.items[k];
    renderPedido();
    pedidoDrawer.classList.remove('open');
  });

  // Validación de reservas
  const form = document.getElementById('resForm');
  const nombre = document.getElementById('resNombre');
  const email = document.getElementById('resEmail');
  const fecha = document.getElementById('resFecha');
  const hora = document.getElementById('resHora');
  const personas = document.getElementById('resPersonas');

  function setHelp(el, txt='') {
    const help = el.parentElement.querySelector('.help');
    if (help) help.textContent = txt;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    if (nombre.value.trim().length < 3) { setHelp(nombre, 'Ingrese al menos 3 caracteres.'); ok = false; } else setHelp(nombre);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { setHelp(email, 'Correo no válido.'); ok = false; } else setHelp(email);
    if (!fecha.value) { setHelp(fecha, 'Seleccione una fecha.'); ok = false; } else setHelp(fecha);
    if (!hora.value) { setHelp(hora, 'Seleccione una hora.'); ok = false; } else setHelp(hora);
    const n = parseInt(personas.value || '0', 10);
    if (!(n >= 1 && n <= 12)) { setHelp(personas, 'Ingrese entre 1 y 12 personas.'); ok = false; } else setHelp(personas);
    if (!ok) return;
    alert('Reserva recibida. Le enviaremos confirmación por correo.');
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
