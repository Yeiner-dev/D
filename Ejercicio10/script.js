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

  // Cálculo de total
  const pase = document.getElementById('pase');
  const talleres = Array.from(document.querySelectorAll('.chk-taller'));
  const totalEl = document.getElementById('total');
  function calcTotal() {
    const sel = pase.options[pase.selectedIndex];
    const base = Number(sel?.dataset?.precio || 0);
    const extras = talleres.filter(t => t.checked).reduce((a,c) => a + Number(c.dataset.precio || 0), 0);
    const sum = base + extras;
    totalEl.textContent = '$' + sum.toFixed(2);
  }
  pase?.addEventListener('change', calcTotal);
  talleres.forEach(t => t.addEventListener('change', calcTotal));
  calcTotal();

  // Validaciones
  const form = document.getElementById('regForm');
  const nombre = document.getElementById('nombre');
  const correo = document.getElementById('correo');
  const telefono = document.getElementById('telefono');
  const pais = document.getElementById('pais');
  const acepta = document.getElementById('acepto');

  function setHelp(input, text) {
    const help = input.parentElement.querySelector('.help');
    if (help) help.textContent = text || '';
  }
  function atLeastOneDay() {
    return Array.from(document.querySelectorAll('input[name="dias"]')).some(i => i.checked);
  }
  function validate() {
    let ok = true;
    // Nombre
    const n = nombre.value.trim();
    if (n.length < 3) { setHelp(nombre, 'Ingrese al menos 3 caracteres.'); ok = false; } else setHelp(nombre, '');
    // Correo
    const e = correo.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!re.test(e)) { setHelp(correo, 'Correo no válido.'); ok = false; } else setHelp(correo, '');
    // Teléfono (opcional, si se ingresa validar longitud mínima)
    const t = telefono.value.replace(/\D/g, '');
    if (telefono.value && t.length < 7) { setHelp(telefono, 'Teléfono demasiado corto.'); ok = false; } else setHelp(telefono, '');
    // País
    if (!pais.value) { setHelp(pais, 'Seleccione un país.'); ok = false; } else setHelp(pais, '');
    // Pase
    if (!pase.value) { setHelp(pase, 'Seleccione un pase.'); ok = false; } else setHelp(pase, '');
    // Días
    const diasGroup = document.querySelector('input[name="dias"]').closest('.form-group');
    const diasHelp = diasGroup?.querySelector('.help');
    if (!atLeastOneDay()) { if (diasHelp) diasHelp.textContent = 'Seleccione al menos un día.'; ok = false; } else if (diasHelp) diasHelp.textContent = '';
    // Pago
    const pagoSel = document.querySelector('input[name="pago"]:checked');
    const pagoGroup = document.querySelector('input[name="pago"]').closest('.form-group');
    const pagoHelp = pagoGroup?.querySelector('.help');
    if (!pagoSel) { if (pagoHelp) pagoHelp.textContent = 'Seleccione un método de pago.'; ok = false; } else if (pagoHelp) pagoHelp.textContent = '';
    // Términos
    if (!acepta.checked) { acepta.parentElement.nextElementSibling.textContent = 'Debe aceptar los términos.'; ok = false; } else acepta.parentElement.nextElementSibling.textContent = '';
    return ok;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert('¡Gracias! Su inscripción ha sido registrada (simulado).\nTotal: ' + totalEl.textContent);
    form.reset();
    calcTotal();
  });

  // To top
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) toTop.style.display = 'inline-block';
    else toTop.style.display = 'none';
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
