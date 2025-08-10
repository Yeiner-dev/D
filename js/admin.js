document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const toTop = document.getElementById('toTop');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  // Persist theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Sidebar behavior
  const mq = window.matchMedia('(max-width: 820px)');
  function updateSidebarMode() {
    if (mq.matches) {
      sidebar.classList.remove('collapsed');
    } else {
      sidebar.classList.remove('open');
    }
  }
  updateSidebarMode();
  mq.addEventListener('change', updateSidebarMode);

  sidebarToggle?.addEventListener('click', () => {
    if (mq.matches) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  // To top
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) toTop.style.display = 'inline-block';
    else toTop.style.display = 'none';
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
