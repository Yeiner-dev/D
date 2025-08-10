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

  // Filtros de oferta
  const nivel = document.getElementById('nivel');
  const q = document.getElementById('q');
  const programas = Array.from(document.querySelectorAll('.programa'));
  function applyFilters() {
    const nv = nivel.value;
    const text = (q.value || '').trim().toLowerCase();
    programas.forEach(p => {
      const byNivel = nv === 'all' || p.dataset.nivel === nv;
      const byText = !text || p.dataset.name.toLowerCase().includes(text);
      p.style.display = byNivel && byText ? '' : 'none';
    });
  }
  nivel?.addEventListener('change', applyFilters);
  q?.addEventListener('input', applyFilters);

  // Calendario de eventos (simple)
  const calBody = document.getElementById('calBody');
  const calTitle = document.getElementById('calTitle');
  const eventsUl = document.getElementById('eventsUl');
  const prevMonth = document.getElementById('prevMonth');
  const nextMonth = document.getElementById('nextMonth');

  const events = {
    // yyyy-mm-dd : [ "Evento 1", "Evento 2" ]
    "2025-08-12": ["Charla de admisiones"],
    "2025-08-20": ["Feria de posgrados"],
    "2025-08-28": ["Taller de portafolios"],
    "2025-09-05": ["Inicio de clases"],
    "2025-09-18": ["Conferencia de IA"],
  };

  let current = new Date();
  current.setDate(1);

  function fmt(y, m, d) {
    return y + "-" + String(m+1).padStart(2,'0') + "-" + String(d).padStart(2,'0');
  }
  function monthName(date) {
    return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  }
  function renderCalendar() {
    const y = current.getFullYear();
    const m = current.getMonth();
    calTitle.textContent = monthName(current).replace(/^./, c => c.toUpperCase());
    calBody.innerHTML = '';

    const firstDay = new Date(y, m, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7; // lunes=0
    const daysInMonth = new Date(y, m+1, 0).getDate();
    // padding
    for (let i=0; i<startWeekday; i++) {
      const pad = document.createElement('div');
      pad.className = 'day pad';
      calBody.appendChild(pad);
    }
    // days
    for (let d=1; d<=daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'day';
      const key = fmt(y, m, d);
      const has = !!events[key];
      cell.innerHTML = '<div class="num">' + d + (has ? '<span class="dot"></span>' : '') + '</div>';
      if (has) {
        cell.setAttribute('data-date', key);
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', () => showEvents(key));
      }
      calBody.appendChild(cell);
    }
    // eventos del mes
    showMonthEvents(y, m);
  }
  function showEvents(dateKey) {
    eventsUl.innerHTML = '';
    (events[dateKey] || []).forEach(t => {
      const li = document.createElement('li');
      li.innerHTML = '<strong>' + t + '</strong> <span class="when">(' + dateKey + ')</span>';
      eventsUl.appendChild(li);
    });
  }
  function showMonthEvents(y, m) {
    eventsUl.innerHTML = '';
    Object.keys(events).forEach(k => {
      const [yy, mm] = k.split('-').map(Number);
      if (yy === y && mm === m+1) {
        events[k].forEach(t => {
          const li = document.createElement('li');
          li.innerHTML = '<strong>' + t + '</strong> <span class="when">(' + k + ')</span>';
          eventsUl.appendChild(li);
        });
      }
    });
  }
  prevMonth?.addEventListener('click', () => { current.setMonth(current.getMonth()-1); renderCalendar(); });
  nextMonth?.addEventListener('click', () => { current.setMonth(current.getMonth()+1); renderCalendar(); });
  renderCalendar();

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
