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

  // Slider de logos (simple)
  const track = document.querySelector('.logos-slider .track');
  const logos = Array.from(track?.children || []);
  let offset = 0;
  function slide(dir = 1) {
    const step = 220; // px aproximados por logo
    offset += (dir > 0 ? -step : step);
    // límites simples
    const maxOffset = -(step * (logos.length - 4));
    if (offset < maxOffset) offset = 0;
    if (offset > 0) offset = maxOffset;
    track.style.transform = 'translateX(' + offset + 'px)';
  }
  document.querySelector('[data-dir="next"]')?.addEventListener('click', () => slide(1));
  document.querySelector('[data-dir="prev"]')?.addEventListener('click', () => slide(-1));
  // auto-scroll
  setInterval(() => slide(1), 4000);

  // Estimador rápido de cotización
  const servicio = document.getElementById('qServicio');
  const presupuesto = document.getElementById('qPresupuesto');
  const estimado = document.getElementById('qEstimado');
  function calc() {
    const base = Number(presupuesto.value || 0);
    const factor = { redes: 0.9, seo: 1.0, paid: 1.1, brandweb: 1.2 }[servicio.value] || 0;
    const val = Math.max(0, Math.round(base * factor));
    estimado.textContent = '$' + val.toLocaleString();
  }
  servicio?.addEventListener('change', calc);
  presupuesto?.addEventListener('input', calc);

  // Validación del formulario de cotización
  const form = document.getElementById('quoteForm');
  const nombre = document.getElementById('qNombre');
  const email = document.getElementById('qEmail');
  const mensaje = document.getElementById('qMensaje');

  function setHelp(el, txt='') {
    const help = el.parentElement.querySelector('.help');
    if (help) help.textContent = txt;
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    if (nombre.value.trim().length < 2) { setHelp(nombre, 'Ingrese su nombre.'); ok = false; } else setHelp(nombre);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { setHelp(email, 'Correo no válido.'); ok = false; } else setHelp(email);
    if (!servicio.value) { setHelp(servicio, 'Seleccione un servicio.'); ok = false; } else setHelp(servicio);
    if (Number(presupuesto.value || 0) < 100) { setHelp(presupuesto, 'Mínimo 100 USD.'); ok = false; } else setHelp(presupuesto);
    if (mensaje.value.trim().length < 10) { setHelp(mensaje, 'Describa su proyecto (10+ caracteres).'); ok = false; } else setHelp(mensaje);
    if (!ok) return;
    alert('Gracias. Hemos recibido su solicitud de cotización.');
    form.reset();
    estimado.textContent = '$0';
  });

  // To top
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) toTop.style.display = 'inline-block';
    else toTop.style.display = 'none';
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
