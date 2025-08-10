document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
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

  // Slider sencillo de opiniones
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
  // Auto-rotación
  setInterval(() => showSlide(idx + 1), 6000);

  // Validación de formulario
  const form = document.getElementById('contactForm');
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');

  function setHelp(input, text) {
    const help = input.parentElement.querySelector('.help');
    if (help) help.textContent = text || '';
  }
  function validate() {
    let ok = true;
    // Nombre
    const n = name.value.trim();
    if (n.length < 3) { setHelp(name, 'Ingrese al menos 3 caracteres.'); ok = false; } else setHelp(name, '');
    // Email
    const e = email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!re.test(e)) { setHelp(email, 'Correo no válido.'); ok = false; } else setHelp(email, '');
    // Mensaje
    const m = message.value.trim();
    if (m.length < 10) { setHelp(message, 'Describa su consulta (10+ caracteres).'); ok = false; } else setHelp(message, '');
    return ok;
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert('Gracias. Hemos recibido su mensaje.');
    form.reset();
  });

  // Botón volver arriba
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) toTop.style.display = 'inline-block';
    else toTop.style.display = 'none';
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
