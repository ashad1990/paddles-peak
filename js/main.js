/* main.js — Paddles Peak */

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += '<span class="star filled">★</span>';
    else if (i === full && half) html += '<span class="star half">★</span>';
    else html += '<span class="star empty">☆</span>';
  }
  return html;
}

function renderProductCards(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = products.map(p => `
    <div class="product-card">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      <a href="product.html?id=${p.id}" class="product-card-img-link">
        <div class="product-card-img-wrap">
          <img src="${p.primaryImage}" alt="${p.name}" class="product-card-img" loading="lazy">
        </div>
      </a>
      <div class="product-card-body">
        <h3 class="product-card-name">
          <a href="product.html?id=${p.id}">${p.name}</a>
        </h3>
        <p class="product-card-desc">${p.shortDesc}</p>
        <div class="product-card-rating">
          ${renderStars(p.rating)}
          <span class="rating-count">(${p.reviewCount})</span>
        </div>
        <div class="product-card-footer">
          <span class="product-card-price">$${p.price.toFixed(2)}</span>
          <button class="btn btn-primary btn-add-cart" onclick="addToCart('${p.id}')">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function initCartBadge() {
  updateCartBadge();
}

/* ── NAV TOGGLE ── */
function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }
}

/* ── PRODUCT PAGE ── */
function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) {
    document.getElementById('product-detail')?.remove();
    const main = document.querySelector('main') || document.body;
    main.innerHTML = '<div class="container" style="padding:4rem 1rem;text-align:center"><h2>Product not found</h2><a href="shop.html" class="btn btn-primary" style="margin-top:1rem">Back to Shop</a></div>';
    return;
  }

  // Breadcrumb
  const bc = document.getElementById('breadcrumb-product');
  if (bc) bc.textContent = product.name;

  // Title & meta
  document.title = `${product.name} — Paddles Peak`;
  const nameEl = document.getElementById('product-name');
  if (nameEl) nameEl.textContent = product.name;

  const priceEl = document.getElementById('product-price');
  if (priceEl) priceEl.textContent = `$${product.price.toFixed(2)}`;

  const descEl = document.getElementById('product-short-desc');
  if (descEl) descEl.textContent = product.shortDesc;

  const starsEl = document.getElementById('product-stars');
  if (starsEl) starsEl.innerHTML = renderStars(product.rating);

  const rcEl = document.getElementById('product-review-count');
  if (rcEl) rcEl.textContent = `(${product.reviewCount} reviews)`;

  // Badge
  if (product.badge) {
    const badgeEl = document.getElementById('product-badge');
    if (badgeEl) { badgeEl.textContent = product.badge; badgeEl.style.display = 'inline-block'; }
  }

  // Gallery
  const mainImg = document.getElementById('product-main-img');
  if (mainImg) {
    mainImg.src = product.primaryImage;
    mainImg.alt = product.name;
  }
  const thumbsEl = document.getElementById('product-thumbs');
  if (thumbsEl) {
    thumbsEl.innerHTML = product.images.map((img, i) => `
      <img src="${img}" alt="${product.name} view ${i+1}" class="product-thumb ${i === 0 ? 'active' : ''}"
           onclick="setMainImage('${img}', this)">
    `).join('');
  }

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  // Description tab
  const descTab = document.getElementById('tab-description');
  if (descTab) descTab.innerHTML = `<p>${product.description}</p>`;

  // Specs tab
  const specsTab = document.getElementById('tab-specs');
  if (specsTab) {
    specsTab.innerHTML = '<table class="specs-table">' +
      Object.entries(product.specs).map(([k, v]) =>
        `<tr><th>${k}</th><td>${v}</td></tr>`
      ).join('') + '</table>';
  }

  // Reviews tab
  const reviewsTab = document.getElementById('tab-reviews');
  if (reviewsTab) {
    reviewsTab.innerHTML = `
      <div class="review-summary">
        <div class="review-score">${product.rating}</div>
        <div>${renderStars(product.rating)}</div>
        <div class="review-total">${product.reviewCount} reviews</div>
      </div>
      <div class="review-list">
        <div class="review-item">
          <div class="review-stars">${renderStars(5)}</div>
          <p class="review-text">"Game-changer for my spins. The carbon fiber grip on the ball is insane."</p>
          <div class="review-author">— Marcus T., Verified Buyer</div>
        </div>
        <div class="review-item">
          <div class="review-stars">${renderStars(5)}</div>
          <p class="review-text">"Best paddle I've owned. Performs like paddles costing 3x the price."</p>
          <div class="review-author">— Sarah L., Verified Buyer</div>
        </div>
        <div class="review-item">
          <div class="review-stars">${renderStars(4)}</div>
          <p class="review-text">"Great control and power. Shipping was fast too. Highly recommend."</p>
          <div class="review-author">— Ryan K., Verified Buyer</div>
        </div>
      </div>`;
  }

  // Qty selector
  let qty = 1;
  const qtyDisplay = document.getElementById('qty-display');
  document.getElementById('qty-minus')?.addEventListener('click', () => {
    if (qty > 1) { qty--; if (qtyDisplay) qtyDisplay.textContent = qty; }
  });
  document.getElementById('qty-plus')?.addEventListener('click', () => {
    qty++;
    if (qtyDisplay) qtyDisplay.textContent = qty;
  });

  // Add to cart
  document.getElementById('btn-add-cart')?.addEventListener('click', () => {
    addToCart(product.id, qty);
  });

  // Related products
  const related = PRODUCTS.filter(p => p.id !== product.id);
  renderProductCards(related, 'related-products-grid');
}

function setMainImage(src, thumbEl) {
  const mainImg = document.getElementById('product-main-img');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

/* ── SHOP PAGE ── */
function initShopPage() {
  let current = [...PRODUCTS];

  function render() {
    renderProductCards(current, 'shop-grid');
  }

  const sortEl = document.getElementById('sort-select');
  if (sortEl) {
    sortEl.addEventListener('change', () => {
      const val = sortEl.value;
      if (val === 'price-asc') current.sort((a, b) => a.price - b.price);
      else if (val === 'price-desc') current.sort((a, b) => b.price - a.price);
      else current = [...PRODUCTS];
      render();
    });
  }

  render();
}

/* ── CART PAGE ── */
function initCartPage() {
  function renderCart() {
    const cart = getCart();
    const empty = document.getElementById('cart-empty');
    const filled = document.getElementById('cart-filled');
    if (!cart.length) {
      if (empty) empty.style.display = 'block';
      if (filled) filled.style.display = 'none';
      return;
    }
    if (empty) empty.style.display = 'none';
    if (filled) filled.style.display = 'block';

    const itemsEl = document.getElementById('cart-items');
    if (itemsEl) {
      itemsEl.innerHTML = cart.map(item => {
        const p = PRODUCTS.find(pr => pr.id === item.id);
        if (!p) return '';
        return `
          <tr class="cart-row" data-id="${p.id}">
            <td class="cart-img-cell">
              <img src="${p.primaryImage}" alt="${p.name}" class="cart-item-img">
            </td>
            <td class="cart-info-cell">
              <div class="cart-item-name">${p.name}</div>
              <div class="cart-item-desc">${p.shortDesc}</div>
            </td>
            <td class="cart-qty-cell">
              <div class="qty-control">
                <button class="qty-btn" onclick="changeQty('${p.id}', ${item.qty - 1})">−</button>
                <span class="qty-val">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${p.id}', ${item.qty + 1})">+</button>
              </div>
            </td>
            <td class="cart-price-cell">$${(p.price * item.qty).toFixed(2)}</td>
            <td class="cart-remove-cell">
              <button class="cart-remove-btn" onclick="removeFromCart('${p.id}'); renderCartSummary();" title="Remove">×</button>
            </td>
          </tr>`;
      }).join('');
    }
    renderCartSummary();
  }

  window.changeQty = function(id, qty) {
    updateCartQty(id, qty);
    renderCart();
  };

  function renderCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
    const shipping = subtotal >= 75 ? 0 : 9.99;
    const total = subtotal + shipping;

    const subEl = document.getElementById('cart-subtotal');
    const shipEl = document.getElementById('cart-shipping');
    const totEl = document.getElementById('cart-total');
    const shipMsg = document.getElementById('cart-shipping-msg');

    if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shipEl) shipEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (totEl) totEl.textContent = `$${total.toFixed(2)}`;
    if (shipMsg) shipMsg.style.display = subtotal > 0 && subtotal < 75 ? 'block' : 'none';
  }

  renderCart();

  // Re-render on remove (removeFromCart triggers updateCartBadge but not renderCart)
  const origRemove = window.removeFromCart;
  if (origRemove) {
    window.removeFromCart = function(id) {
      origRemove(id);
      renderCart();
    };
  }
}

/* ── CHECKOUT PAGE ── */
function initCheckoutPage() {
  let currentStep = 1;
  const steps = [1, 2, 3];

  function showStep(n) {
    steps.forEach(s => {
      const el = document.getElementById('step-' + s);
      const ind = document.getElementById('step-ind-' + s);
      if (el) el.style.display = s === n ? 'block' : 'none';
      if (ind) {
        ind.classList.toggle('active', s === n);
        ind.classList.toggle('done', s < n);
      }
    });
    currentStep = n;
  }

  showStep(1);

  document.getElementById('btn-to-step2')?.addEventListener('click', () => {
    const form = document.getElementById('form-shipping');
    if (form && !form.checkValidity()) { form.reportValidity(); return; }
    showStep(2);
  });

  document.getElementById('btn-back-step1')?.addEventListener('click', () => showStep(1));

  document.getElementById('btn-place-order')?.addEventListener('click', () => {
    const form = document.getElementById('form-payment');
    if (form && !form.checkValidity()) { form.reportValidity(); return; }

    const cart = getCart();
    const customerInfo = {
      firstName: document.getElementById('ship-first')?.value || '',
      lastName: document.getElementById('ship-last')?.value || '',
      email: document.getElementById('ship-email')?.value || '',
      phone: document.getElementById('ship-phone')?.value || '',
      address: document.getElementById('ship-address')?.value || '',
      city: document.getElementById('ship-city')?.value || '',
      state: document.getElementById('ship-state')?.value || '',
      zip: document.getElementById('ship-zip')?.value || ''
    };

    const order = createOrder(cart, customerInfo);
    clearCart();

    const orderIdEl = document.getElementById('confirm-order-id');
    if (orderIdEl) orderIdEl.textContent = order.id;
    const orderEmailEl = document.getElementById('confirm-email');
    if (orderEmailEl) orderEmailEl.textContent = customerInfo.email;
    const orderTotalEl = document.getElementById('confirm-total');
    if (orderTotalEl) orderTotalEl.textContent = `$${order.total.toFixed(2)}`;

    showStep(3);
  });

  // Show cart summary in checkout
  const cart = getCart();
  const summaryEl = document.getElementById('checkout-summary-items');
  if (summaryEl) {
    let subtotal = 0;
    summaryEl.innerHTML = cart.map(item => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      if (!p) return '';
      subtotal += p.price * item.qty;
      return `<div class="checkout-summary-row">
        <span>${p.name} × ${item.qty}</span>
        <span>$${(p.price * item.qty).toFixed(2)}</span>
      </div>`;
    }).join('');
    const shipping = subtotal >= 75 ? 0 : 9.99;
    summaryEl.innerHTML += `
      <div class="checkout-summary-row checkout-summary-divider">
        <span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
      </div>
      <div class="checkout-summary-row checkout-summary-total">
        <span>Total</span><span>$${(subtotal + shipping).toFixed(2)}</span>
      </div>`;
  }
}

/* ── ADMIN PAGE ── */
function initAdminPage() {
  const AUTH_KEY = 'ppAdminAuth';
  const gate = document.getElementById('admin-gate');
  const dashboard = document.getElementById('admin-dashboard');

  function checkAuth() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  function showDashboard() {
    if (gate) gate.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    renderAdminStats();
    renderInventoryTable();
    renderOrdersTable();
  }

  if (checkAuth()) {
    showDashboard();
  } else {
    if (gate) gate.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
  }

  document.getElementById('admin-login-btn')?.addEventListener('click', () => {
    const pw = document.getElementById('admin-password')?.value;
    if (pw === 'admin123') {
      sessionStorage.setItem(AUTH_KEY, 'true');
      showDashboard();
    } else {
      const err = document.getElementById('admin-login-error');
      if (err) { err.textContent = 'Incorrect password.'; err.style.display = 'block'; }
    }
  });

  document.getElementById('admin-signout-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    if (gate) gate.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
  });

  function renderAdminStats() {
    const orders = getOrders();
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const totalStock = PRODUCTS.reduce((s, p) => s + p.stock, 0);
    const lowStock = PRODUCTS.filter(p => p.stock < 10).length;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('stat-orders', orders.length);
    set('stat-revenue', '$' + totalRevenue.toFixed(2));
    set('stat-stock', totalStock);
    set('stat-lowstock', lowStock);
  }

  function renderInventoryTable() {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;
    tbody.innerHTML = PRODUCTS.map(p => `
      <tr class="${p.stock < 10 ? 'low-stock-row' : ''}">
        <td>${p.name}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td>
          <input type="number" class="stock-input" value="${p.stock}" min="0"
                 onchange="updateStock('${p.id}', this.value)">
          ${p.stock < 10 ? '<span class="low-stock-badge">Low Stock</span>' : ''}
        </td>
        <td>${p.rating} ★ (${p.reviewCount})</td>
      </tr>
    `).join('');
  }

  window.updateStock = function(id, val) {
    const p = PRODUCTS.find(pr => pr.id === id);
    if (p) {
      p.stock = parseInt(val) || 0;
      renderInventoryTable();
      renderAdminStats();
    }
  };

  function renderOrdersTable() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    const orders = getOrders();
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-table">No orders yet.</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><code>${o.id}</code></td>
        <td>${new Date(o.date).toLocaleDateString()}</td>
        <td>${o.customer ? o.customer.firstName + ' ' + o.customer.lastName : '—'}</td>
        <td>${o.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
        <td>$${o.total.toFixed(2)}</td>
        <td>
          <select class="status-select" onchange="updateOrderStatus('${o.id}', this.value)">
            ${['Pending','Processing','Shipped','Delivered'].map(s =>
              `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`
            ).join('')}
          </select>
        </td>
      </tr>
    `).join('');
  }
}

/* ── HOME PAGE ── */
function initHomePage() {
  renderProductCards(PRODUCTS, 'products-grid');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initCartBadge();
  initNavToggle();

  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '' || page === '/') {
    initHomePage();
  } else if (page === 'shop.html') {
    initShopPage();
  } else if (page === 'product.html') {
    initProductPage();
  } else if (page === 'cart.html') {
    initCartPage();
  } else if (page === 'checkout.html') {
    initCheckoutPage();
  } else if (page === 'admin.html') {
    initAdminPage();
  }
});
