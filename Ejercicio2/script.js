document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Theme
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);
  themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Mobile nav
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  navToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Search + Sort
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const productsGrid = document.querySelector('.grid-products');
  const products = Array.from(document.querySelectorAll('.product'));

  function renderProducts(list) {
    productsGrid.innerHTML = '';
    list.forEach(p => productsGrid.appendChild(p));
  }

  function applyFilters() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    let filtered = products.filter(p => p.dataset.name.toLowerCase().includes(q));
    const sort = sortSelect.value;
    if (sort === 'price-asc') {
      filtered.sort((a,b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    } else if (sort === 'price-desc') {
      filtered.sort((a,b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    } // relevance = no-op
    renderProducts(filtered);
  }

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
  });
  searchInput?.addEventListener('input', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);

  // Cart
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const state = { items: {} }; // { id: { id, name, price, qty, img } }

  function fmt(n) {
    return '$' + n.toFixed(2);
  }
  function updateCartUI() {
    const itemsArr = Object.values(state.items);
    cartItems.innerHTML = '';
    let total = 0;
    itemsArr.forEach(it => {
      total += it.price * it.qty;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = \`
        <img src="\${it.img}" alt="\${it.name}" />
        <div>
          <div class="title">\${it.name}</div>
          <div class="muted">\${fmt(it.price)} · 
            <span class="qty">
              <button data-act="dec" data-id="\${it.id}" aria-label="Disminuir cantidad">−</button>
              <span>\${it.qty}</span>
              <button data-act="inc" data-id="\${it.id}" aria-label="Aumentar cantidad">+</button>
            </span>
          </div>
        </div>
        <button class="remove" data-act="rm" data-id="\${it.id}" aria-label="Quitar del carrito">✕</button>
      \`;
      cartItems.appendChild(row);
    });
    cartCount.textContent = itemsArr.reduce((a,c) => a + c.qty, 0);
    cartTotal.textContent = fmt(total);
    cartDrawer.setAttribute('aria-hidden', itemsArr.length ? 'false' : 'true');
  }

  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    const card = btn.closest('.product');
    const id = btn.dataset.id;
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const img = card.querySelector('img')?.src;
    const item = state.items[id] || { id, name, price, qty: 0, img };
    item.qty += 1;
    state.items[id] = item;
    updateCartUI();
    cartDrawer.classList.add('open');
  });

  cartToggle?.addEventListener('click', () => cartDrawer.classList.toggle('open'));
  cartClose?.addEventListener('click', () => cartDrawer.classList.remove('open'));

  cartItems?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const { act, id } = btn.dataset;
    const item = state.items[id];
    if (!item) return;
    if (act === 'inc') item.qty += 1;
    if (act === 'dec') item.qty = Math.max(1, item.qty - 1);
    if (act === 'rm') delete state.items[id];
    updateCartUI();
  });

  checkoutBtn?.addEventListener('click', () => {
    const count = Object.values(state.items).reduce((a,c) => a + c.qty, 0);
    if (!count) {
      alert('El carrito está vacío.');
      return;
    }
    alert('Compra simulada realizada. ¡Gracias por su preferencia!');
    // Reset fake cart
    Object.keys(state.items).forEach(k => delete state.items[k]);
    updateCartUI();
    cartDrawer.classList.remove('open');
  });

  // To top
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) toTop.style.display = 'inline-block';
    else toTop.style.display = 'none';
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
