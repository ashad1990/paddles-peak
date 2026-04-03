// ============================================================
// Paddles Peak — app.js
// Cart uses localStorage key 'ppCart'
// Orders use localStorage key 'ppOrders'
// Inventory uses localStorage key 'ppInventory'
// ============================================================

const PRODUCTS = {
  'summit-paddle': {
    id: 'summit-paddle',
    name: 'The Summit Paddle',
    price: 89.99,
    image: 'images/paddle-main.svg',
    description: 'Dominate every game with the Summit Paddle, engineered for competitive players who demand peak performance. Our premium carbon fiber face delivers unmatched power and control with every swing.',
    specs: {
      'Face Material': 'Premium Carbon Fiber',
      'Core': 'Polypropylene Honeycomb',
      'Weight': '7.8 oz',
      'Grip Length': '5.25"',
      'Grip Circumference': '4.25"',
      'Paddle Length': '16.5"',
      'Paddle Width': '7.5"',
      'Edge Guard': 'Composite'
    },
    category: 'paddle'
  },
  'base-camp-bundle': {
    id: 'base-camp-bundle',
    name: 'The Base Camp Bundle',
    price: 59.99,
    image: 'images/paddle-main.svg',
    description: 'Everything you need to start your pickleball journey. The Base Camp Bundle includes our high-performance paddle and a premium carry case, giving you the best value to hit the courts in style.',
    specs: {
      'Includes': 'Paddle + Carry Case',
      'Face Material': 'Fiberglass Composite',
      'Core': 'Polymer Honeycomb',
      'Weight': '8.1 oz',
      'Grip Length': '5.0"',
      'Grip Circumference': '4.25"',
      'Paddle Length': '16.0"',
      'Paddle Width': '7.5"',
      'Case': 'Neoprene zip case'
    },
    category: 'bundle',
    badge: 'Best Value',
    includes: 'Paddle + Case Included'
  }
};

// ============================================================
// Cart Functions
// ============================================================

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('ppCart')) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('ppCart', JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS[productId];
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCount();
}

function updateQty(productId, qty) {
  if (qty < 1) {
    removeFromCart(productId);
    return;
  }
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = qty;
    saveCart(cart);
    updateCartCount();
  }
}

function getCartTotal() {
  return getCart().reduce((total, item) => {
    const product = PRODUCTS[item.id];
    return total + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((count, item) => count + item.qty, 0);
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ============================================================
// Orders Functions
// ============================================================

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('ppOrders')) || [];
  } catch {
    return [];
  }
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('ppOrders', JSON.stringify(orders));
}

// ============================================================
// Inventory Functions
// ============================================================

const DEFAULT_INVENTORY = {
  'summit-paddle': 50,
  'base-camp-bundle': 30
};

function getInventory() {
  try {
    const stored = localStorage.getItem('ppInventory');
    return stored ? JSON.parse(stored) : { ...DEFAULT_INVENTORY };
  } catch {
    return { ...DEFAULT_INVENTORY };
  }
}

function saveInventory(inv) {
  localStorage.setItem('ppInventory', JSON.stringify(inv));
}

// ============================================================
// HTML Escape — prevents XSS when inserting values into innerHTML
// ============================================================

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// Toast Notification
// ============================================================

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast${type === 'error' ? ' error' : ''}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================
// Navbar scroll effect
// ============================================================

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

// ============================================================
// Cart Page Rendering
// ============================================================

function renderCart() {
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;

  const cart = getCart();
  const summaryContainer = document.getElementById('cart-summary-container');

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="shop.html" class="btn btn-primary">Shop Now</a>
      </div>`;
    if (summaryContainer) summaryContainer.style.display = 'none';
    return;
  }

  if (summaryContainer) summaryContainer.style.display = '';

  let rows = '';
  cart.forEach(item => {
    const product = PRODUCTS[item.id];
    if (!product) return;
    const lineTotal = (product.price * item.qty).toFixed(2);
    const safeId = escapeHtml(item.id);
    const safeName = escapeHtml(product.name);
    const safeImage = escapeHtml(product.image);
    rows += `
      <tr data-product-id="${safeId}">
        <td>
          <div class="cart-product-cell">
            <img src="${safeImage}" alt="${safeName}" class="cart-product-img">
            <div>
              <div class="cart-product-name">${safeName}</div>
              <div class="cart-product-id">${safeId}</div>
            </div>
          </div>
        </td>
        <td>$${product.price.toFixed(2)}</td>
        <td>
          <div class="cart-qty-controls">
            <button class="cart-qty-btn" data-action="dec" data-id="${safeId}">−</button>
            <span class="cart-qty-value">${escapeHtml(item.qty)}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${safeId}">+</button>
          </div>
        </td>
        <td>$${lineTotal}</td>
        <td>
          <button class="cart-remove-btn" data-remove="${safeId}" title="Remove">×</button>
        </td>
      </tr>`;
  });

  cartContainer.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;

  const subtotal = getCartTotal();
  const shipping = subtotal >= 100 ? 0 : 5.99;
  const total = subtotal + shipping;

  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) {
    shippingEl.innerHTML = shipping === 0
      ? '<span class="summary-shipping-free">FREE</span>'
      : `$${shipping.toFixed(2)}`;
  }
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  // Bind qty/remove events
  cartContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = getCart().find(i => i.id === id);
      if (!item) return;
      const newQty = btn.dataset.action === 'inc' ? item.qty + 1 : item.qty - 1;
      updateQty(id, newQty);
      renderCart();
    });
  });

  cartContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.remove);
      renderCart();
    });
  });
}

// ============================================================
// Checkout Page Logic
// ============================================================

function initCheckout() {
  const checkoutPage = document.getElementById('checkout-page');
  if (!checkoutPage) return;

  let currentStep = 1;

  function showStep(step) {
    document.querySelectorAll('.checkout-step').forEach((el, i) => {
      el.style.display = (i + 1 === step) ? '' : 'none';
    });
    document.querySelectorAll('.step').forEach((el, i) => {
      el.classList.remove('active', 'completed');
      if (i + 1 < step) el.classList.add('completed');
      if (i + 1 === step) el.classList.add('active');
    });
    currentStep = step;
  }

  // Render order summary in checkout sidebar
  const checkoutItemsContainer = document.getElementById('checkout-items');
  if (checkoutItemsContainer) {
    const cart = getCart();
    let html = '';
    cart.forEach(item => {
      const product = PRODUCTS[item.id];
      if (!product) return;
      const safeName = escapeHtml(product.name);
      const safeImage = escapeHtml(product.image);
      html += `
        <div class="checkout-item">
          <img src="${safeImage}" alt="${safeName}" class="checkout-item-img">
          <div class="checkout-item-details">
            <div class="checkout-item-name">${safeName}</div>
            <div class="checkout-item-qty">Qty: ${escapeHtml(item.qty)}</div>
          </div>
          <div class="checkout-item-price">$${(product.price * item.qty).toFixed(2)}</div>
        </div>`;
    });
    checkoutItemsContainer.innerHTML = html || '<p style="color:var(--text-muted);font-size:.88rem">Cart is empty</p>';

    const subtotal = getCartTotal();
    const shipping = subtotal >= 100 ? 0 : 5.99;
    const total = subtotal + shipping;

    const subEl = document.getElementById('co-subtotal');
    const shipEl = document.getElementById('co-shipping');
    const totEl = document.getElementById('co-total');

    if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shipEl) shipEl.innerHTML = shipping === 0
      ? '<span class="summary-shipping-free">FREE</span>'
      : `$${shipping.toFixed(2)}`;
    if (totEl) totEl.textContent = `$${total.toFixed(2)}`;
  }

  showStep(1);

  // Step 1 → 2
  const step1Form = document.getElementById('step1-form');
  if (step1Form) {
    step1Form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateStep1()) showStep(2);
    });
  }

  // Step 2 → 3 (place order)
  const step2Form = document.getElementById('step2-form');
  if (step2Form) {
    step2Form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateStep2()) placeOrder();
    });
  }

  const backBtn = document.getElementById('back-to-step1');
  if (backBtn) backBtn.addEventListener('click', () => showStep(1));

  function validateStep1() {
    const fields = ['first-name', 'last-name', 'email', 'address', 'city', 'state', 'zip', 'country'];
    let valid = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) {
        el.classList.add('error');
        valid = false;
      } else if (el) {
        el.classList.remove('error');
      }
    });
    if (!valid) showToast('Please fill in all required fields.', 'error');
    return valid;
  }

  function validateStep2() {
    const fields = ['card-number', 'card-name', 'card-expiry', 'card-cvv'];
    let valid = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) {
        el.classList.add('error');
        valid = false;
      } else if (el) {
        el.classList.remove('error');
      }
    });
    if (!valid) showToast('Please complete your payment details.', 'error');
    return valid;
  }

  function placeOrder() {
    const orderNumber = 'PP' + Math.floor(100000 + Math.random() * 900000);
    const cart = getCart();
    const subtotal = getCartTotal();
    const shipping = subtotal >= 100 ? 0 : 5.99;

    const order = {
      id: orderNumber,
      date: new Date().toISOString(),
      customer: {
        firstName: document.getElementById('first-name')?.value || '',
        lastName: document.getElementById('last-name')?.value || '',
        email: document.getElementById('email')?.value || '',
        address: document.getElementById('address')?.value || '',
        city: document.getElementById('city')?.value || '',
        state: document.getElementById('state')?.value || '',
        zip: document.getElementById('zip')?.value || '',
        country: document.getElementById('country')?.value || ''
      },
      items: cart.map(item => ({
        id: item.id,
        name: PRODUCTS[item.id]?.name || item.id,
        qty: item.qty,
        price: PRODUCTS[item.id]?.price || 0
      })),
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: 'pending'
    };

    saveOrder(order);
    saveCart([]);
    updateCartCount();

    // Show confirmation step
    const orderNumEl = document.getElementById('confirm-order-num');
    const confirmEmailEl = document.getElementById('confirm-email');
    const confirmTotalEl = document.getElementById('confirm-total');

    if (orderNumEl) orderNumEl.textContent = `#${orderNumber}`;
    if (confirmEmailEl) confirmEmailEl.textContent = order.customer.email;
    if (confirmTotalEl) confirmTotalEl.textContent = `$${order.total.toFixed(2)}`;

    showStep(3);
  }

  // Card number formatting
  const cardInput = document.getElementById('card-number');
  if (cardInput) {
    cardInput.addEventListener('input', e => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 16);
      e.target.value = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
  }

  // Expiry formatting
  const expiryInput = document.getElementById('card-expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', e => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 4);
      if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
      e.target.value = val;
    });
  }
}

// ============================================================
// Product Detail Page Logic
// ============================================================

function initProductPage() {
  const productPage = document.getElementById('product-page');
  if (!productPage) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = PRODUCTS[productId];

  if (!product) {
    productPage.innerHTML = `
      <div style="text-align:center;padding:80px 0">
        <h2>Product not found</h2>
        <p style="color:var(--text-secondary);margin:16px 0">That product doesn't exist.</p>
        <a href="shop.html" class="btn btn-primary">Back to Shop</a>
      </div>`;
    return;
  }

  // Populate name/price/etc
  const nameEls = document.querySelectorAll('.pd-name');
  const priceEls = document.querySelectorAll('.pd-price');
  const descEl = document.getElementById('pd-description');
  const imgEl = document.getElementById('pd-image');
  const badgeEl = document.getElementById('pd-badge');
  const breadcrumbName = document.getElementById('breadcrumb-name');

  nameEls.forEach(el => { el.textContent = product.name; });
  priceEls.forEach(el => { el.textContent = `$${product.price.toFixed(2)}`; });
  if (descEl) descEl.textContent = product.description;
  if (imgEl) { imgEl.src = product.image; imgEl.alt = product.name; }
  if (breadcrumbName) breadcrumbName.textContent = product.name;
  if (badgeEl) {
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.style.display = '';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  // Specs table
  const specsTable = document.getElementById('specs-table-body');
  if (specsTable && product.specs) {
    specsTable.innerHTML = Object.entries(product.specs)
      .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
      .join('');
  }

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Qty selector
  let qty = 1;
  const qtyDisplay = document.getElementById('qty-display');
  const qtyInc = document.getElementById('qty-inc');
  const qtyDec = document.getElementById('qty-dec');

  function updateQtyDisplay() {
    if (qtyDisplay) qtyDisplay.value = qty;
  }

  if (qtyInc) qtyInc.addEventListener('click', () => { qty++; updateQtyDisplay(); });
  if (qtyDec) qtyDec.addEventListener('click', () => { if (qty > 1) { qty--; updateQtyDisplay(); } });

  // Add to cart
  const addBtn = document.getElementById('pd-add-to-cart');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addToCart(productId, qty);
    });
  }

  // Page title
  document.title = `${product.name} — Paddles Peak`;
}

// ============================================================
// Shop Page
// ============================================================

function initShopPage() {
  if (!document.getElementById('shop-page')) return;
  // Sort/filter are visual only — no dynamic behavior required
}

// ============================================================
// Admin Page
// ============================================================

function initAdminPage() {
  const adminGate = document.getElementById('admin-gate');
  const adminDashboard = document.getElementById('admin-dashboard');
  if (!adminGate && !adminDashboard) return;

  const passwordForm = document.getElementById('admin-password-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', e => {
      e.preventDefault();
      const pw = document.getElementById('admin-password');
      if (pw && pw.value === 'admin123') {
        adminGate.style.display = 'none';
        adminDashboard.style.display = '';
        renderOrders();
        renderInventory();
      } else {
        showToast('Incorrect password.', 'error');
        if (pw) { pw.value = ''; pw.classList.add('error'); }
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById('admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      adminDashboard.style.display = 'none';
      adminGate.style.display = '';
    });
  }

  // Admin tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-panel').forEach(p => p.style.display = 'none');
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.style.display = '';
    });
  });
}

function renderOrders() {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  const orders = getOrders();
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="no-data"><div class="no-data-icon">📋</div>No orders yet</div></td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const date = new Date(order.date).toLocaleDateString();
    const customerName = escapeHtml(`${order.customer.firstName} ${order.customer.lastName}`);
    const customerEmail = escapeHtml(order.customer.email);
    const itemsSummary = escapeHtml(order.items.map(i => `${i.name} ×${i.qty}`).join(', '));
    const orderId = escapeHtml(order.id);
    const statusClass = `status-${escapeHtml(order.status)}`;
    const statusLabel = escapeHtml(order.status);
    return `
      <tr>
        <td>#${orderId}</td>
        <td>${date}</td>
        <td>${customerName}<br><small style="color:var(--text-muted)">${customerEmail}</small></td>
        <td style="font-size:.82rem;max-width:200px">${itemsSummary}</td>
        <td style="color:var(--teal);font-weight:700">$${order.total.toFixed(2)}</td>
        <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
      </tr>`;
  }).join('');
}

function renderInventory() {
  const tbody = document.getElementById('inventory-tbody');
  if (!tbody) return;

  const inventory = getInventory();

  tbody.innerHTML = Object.keys(PRODUCTS).map(id => {
    const product = PRODUCTS[id];
    const stock = inventory[id] !== undefined ? inventory[id] : DEFAULT_INVENTORY[id];
    const safeName = escapeHtml(product.name);
    const safeImage = escapeHtml(product.image);
    const safeId = escapeHtml(id);
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:12px">
            <img src="${safeImage}" alt="${safeName}" style="width:40px;height:40px;object-fit:contain;background:radial-gradient(circle,rgba(45,212,191,0.1) 0%,#111827 100%);border-radius:8px;padding:2px">
            ${safeName}
          </div>
        </td>
        <td style="color:var(--teal);font-weight:700">$${product.price.toFixed(2)}</td>
        <td>
          <input type="number" class="inv-qty-input" data-id="${safeId}" value="${escapeHtml(stock)}" min="0">
        </td>
        <td>
          <button class="btn btn-sm btn-primary inv-save-btn" data-id="${safeId}">Save</button>
        </td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('.inv-save-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const input = tbody.querySelector(`.inv-qty-input[data-id="${id}"]`);
      if (!input) return;
      const inv = getInventory();
      inv[id] = parseInt(input.value, 10) || 0;
      saveInventory(inv);
      showToast('Inventory updated!');
    });
  });
}

// ============================================================
// Init on DOM Ready
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initNavbar();
  initProductPage();
  initCheckout();
  initShopPage();
  initAdminPage();

  // Add-to-cart buttons (index.html / shop.html)
  document.querySelectorAll('[data-product-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.productId;
      if (id) addToCart(id, 1);
    });
  });
});
