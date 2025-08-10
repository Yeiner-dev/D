document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const categoryList = document.getElementById('categoryList');
  const searchInput = document.getElementById('searchInput');
  const posts = Array.from(document.querySelectorAll('.post'));
  const subscribeForm = document.getElementById('subscribeForm');
  const emailInput = document.getElementById('email');
  const emailHelp = document.getElementById('emailHelp');
  const toTop = document.getElementById('toTop');
  const yearSpan = document.getElementById('year');

  // Año dinámico en footer
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Tema (oscuro / claro) con persistencia
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  }
  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', current);
    localStorage.setItem('theme', current);
  });

  // Menú móvil
  navToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  // Filtrado por categoría (chips)
  categoryList?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    categoryList.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
    btn.classList.add('is-active');

    const filter = btn.getAttribute('data-filter');
    filterPosts({ category: filter === 'all' ? null : filter, query: searchInput?.value || '' });
  });

  // Búsqueda
  searchInput?.addEventListener('input', () => {
    const activeChip = categoryList?.querySelector('.chip.is-active');
    const category = activeChip?.getAttribute('data-filter');
    filterPosts({ category: category === 'all' ? null : category, query: searchInput.value });
  });

  function filterPosts({ category = null, query = '' }) {
    const q = query.trim().toLowerCase();
    posts.forEach(post => {
      const matchesCategory = !category || post.dataset.category === category;
      const text = post.innerText.toLowerCase();
      const matchesText = !q || text.includes(q);
      post.style.display = matchesCategory && matchesText ? '' : 'none';
    });
  }

  // Validación simple de suscripción
  subscribeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    emailHelp.textContent = '';
    const value = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (!isValid) {
      emailHelp.textContent = 'Ingrese un correo válido.';
      emailInput.focus();
      return;
    }
    subscribeForm.reset();
    alert('¡Gracias por suscribirse! 🎉');
  });

  // Botón volver arriba
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      toTop.style.display = 'inline-block';
    } else {
      toTop.style.display = 'none';
    }
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
