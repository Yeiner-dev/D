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

  // Filtros de galería
  const chips = Array.from(document.querySelectorAll('.chip[data-filter]'));
  const cards = Array.from(document.querySelectorAll('.project'));
  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    ch.classList.add('is-active');
    const f = ch.dataset.filter;
    cards.forEach(card => {
      const match = f === 'all' || card.dataset.cat === f;
      card.style.display = match ? '' : 'none';
    });
  }));

  // Lightbox modal (dialog)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.view');
    if (!btn) return;
    lightboxImg.src = btn.dataset.img;
    lightboxImg.alt = btn.dataset.title;
    lightboxTitle.textContent = btn.dataset.title;
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
  });
  lightboxClose?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (e) => {
    const within = e.target.closest('.lightbox__content');
    if (!within) lightbox.close();
  });

  // Validaciones de formularios
  function setHelp(el, txt='') {
    const help = el.parentElement.querySelector('.help');
    if (help) help.textContent = txt;
  }
  const quickForm = document.getElementById('contactForm');
  const quickEmail = document.getElementById('email');
  quickForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = quickEmail.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (!ok) { setHelp(quickEmail, 'Correo no válido.'); return; }
    setHelp(quickEmail, ''); alert('Gracias, me pondré en contacto pronto.'); quickForm.reset();
  });

  const projectForm = document.getElementById('projectForm');
  const name = document.getElementById('name');
  const email2 = document.getElementById('email2');
  const message = document.getElementById('message');
  projectForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    if (name.value.trim().length < 2) { setHelp(name, 'Ingrese su nombre.'); ok = false; } else setHelp(name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email2.value.trim())) { setHelp(email2, 'Correo no válido.'); ok = false; } else setHelp(email2);
    if (message.value.trim().length < 10) { setHelp(message, 'Describa su proyecto (10+ caracteres).'); ok = false; } else setHelp(message);
    if (!ok) return;
    alert('¡Gracias! Revisaré su proyecto y responderé pronto.');
    projectForm.reset();
  });

  // To top
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) toTop.style.display = 'inline-block';
    else toTop.style.display = 'none';
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
