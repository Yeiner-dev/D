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

  // Slider de capturas
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  let idx = 0;
  function showSlide(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
  }
  document.querySelector('[data-dir="prev"]')?.addEventListener('click', () => showSlide(idx - 1));
  document.querySelector('[data-dir="next"]')?.addEventListener('click', () => showSlide(idx + 1));
  dots.forEach((d, k) => d.addEventListener('click', () => showSlide(k)));
  setInterval(() => showSlide(idx + 1), 7000);

  // Lista de espera (validación)
  const form = document.getElementById('waitlistForm');
  const email = document.getElementById('wlEmail');
  function setHelp(txt='') {
    const help = form.querySelector('.help');
    if (help) help.textContent = txt;
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (email.value || '').trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (!ok) { setHelp('Correo no válido.'); return; }
    setHelp('¡Gracias! Le avisaremos pronto.');
    form.reset();
  });

  // Botones de descarga (alerta ficticia)
  document.querySelectorAll('.store').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Descarga en ' + (a.dataset.platform || 'su tienda preferida') + ' (simulado).');
    });
  });

  // To top
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) toTop.style.display = 'inline-block';
    else toTop.style.display = 'none';
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
