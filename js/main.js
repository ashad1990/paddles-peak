/* ── HTML Escape Utility ── */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', function () {
  updateCartBadge();
  initMobileMenu();

  const page = document.body.dataset.page;
  if (page === 'index') initIndex();
  else if (page === 'product') initProduct();
  else if (page === 'cart') initCart();
  else if (page === 'checkout') initCheckout();
  else if (page === 'admin') initAdmin();
});

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', function () {
    menu.classList.toggle('open');
  });
}

/* ── Gallery Switcher (shared) ── */
function initGallery(mainImgId, thumbsSelector) {
  const mainImg = document.getElementById(mainImgId);
  if (!mainImg) return;
  const thumbs = document.querySelectorAll(thumbsSelector);
  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener('click', function () {
      mainImg.src = thumb.dataset.src;
      mainImg.alt = thumb.dataset.alt || '';
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
    if (i === 0) thumb.classList.add('active');
  });
}

/* ── Index Page ── */
function initIndex() {
  initGallery('gallery-main', '.gallery-thumb');
  const addBtns = document.querySelectorAll('.add-to-cart-btn');
  addBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      addToCart(1);
      btn.textContent = '✓ Added to Cart!';
      setTimeout(() => { btn.textContent = 'Add to Cart — $59.99'; }, 2000);
    });
  });
}

/* ── Product Page ── */
function initProduct() {
  initGallery('gallery-main', '.gallery-thumb');

  // Qty selector
  const qtyDisplay = document.getElementById('qty-display');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  let qty = 1;

  if (qtyMinus) {
    qtyMinus.addEventListener('click', function () {
      if (qty > 1) { qty--; qtyDisplay.textContent = qty; }
    });
  }
  if (qtyPlus) {
    qtyPlus.addEventListener('click', function () {
      qty++;
      qtyDisplay.textContent = qty;
    });
  }

  // Add to cart
  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      addToCart(qty);
      addBtn.textContent = '✓ Added to Cart!';
      setTimeout(() => { addBtn.textContent = 'Add to Cart — $59.99'; }, 2000);
    });
  }

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById('tab-' + target);
      if (pane) pane.classList.add('active');
    });
  });
}

/* ── Cart Page ── */
function initCart() {
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-container');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart"><h2>Your cart is empty</h2><p>Looks like you haven\'t added anything yet.</p><a href="product.html" class="btn-primary" style="width:auto;display:inline-block;padding:14px 40px;">Shop Now</a></div>';
    return;
  }

  const item = cart[0];
  const subtotal = getCartTotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const imgSrc = escapeHtml(item.image || '');
  const itemName = escapeHtml(item.name || '');

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-left">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th></th>
              <th>Quantity</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="cart-body">
            <tr>
              <td><img class="cart-item-img" src="${imgSrc}" alt="${itemName}"></td>
              <td>
                <div class="cart-item-name">${itemName}</div>
                <div class="cart-item-sub">Summit Paddle + Paddles Peak Carry Case</div>
              </td>
              <td>
                <div class="qty-control">
                  <button class="qty-btn" id="cart-minus">−</button>
                  <span class="qty-num" id="cart-qty">${item.qty}</span>
                  <button class="qty-btn" id="cart-plus">+</button>
                </div>
              </td>
              <td style="font-weight:700;color:#111;">$${(item.price * item.qty).toFixed(2)}</td>
              <td><button class="remove-btn" id="cart-remove">Remove</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Shipping</span><span class="${shipping === 0 ? 'free-ship' : ''}">${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span></div>
        <div class="summary-row"><span>Estimated Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
        <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
        <a href="checkout.html" class="btn-primary" style="margin-top:20px;">Proceed to Checkout</a>
      </div>
    </div>`;

  document.getElementById('cart-minus').addEventListener('click', function () {
    const c = getCart();
    if (c[0] && c[0].qty > 1) {
      c[0].qty--;
      saveCart(c);
    }
    updateCartBadge();
    renderCart();
  });
  document.getElementById('cart-plus').addEventListener('click', function () {
    const c = getCart();
    if (c[0]) {
      c[0].qty++;
      saveCart(c);
    }
    updateCartBadge();
    renderCart();
  });
  document.getElementById('cart-remove').addEventListener('click', function () {
    clearCart();
    renderCart();
  });
}

// saveCart needed here for cart page
function saveCart(cart) {
  localStorage.setItem('ppCart', JSON.stringify(cart));
}

/* ── Checkout Page ── */
function initCheckout() {
  let currentStep = 1;
  showStep(1);

  const continueBtn = document.getElementById('continue-to-payment');
  if (continueBtn) {
    continueBtn.addEventListener('click', function () {
      const form = document.getElementById('shipping-form');
      if (form && validateForm(form)) {
        showStep(2);
        currentStep = 2;
      }
    });
  }

  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function () {
      const form = document.getElementById('payment-form');
      if (form && validateForm(form)) {
        submitOrder();
      }
    });
  }

  // Render checkout summary
  renderCheckoutSummary();
}

function showStep(n) {
  document.querySelectorAll('.checkout-step').forEach(function (el, i) {
    el.classList.toggle('active', i + 1 === n);
  });
  document.querySelectorAll('.progress-step').forEach(function (el, i) {
    el.classList.remove('active', 'done');
    if (i + 1 === n) el.classList.add('active');
    else if (i + 1 < n) el.classList.add('done');
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(function (input) {
    if (!input.value.trim()) {
      input.style.borderColor = '#e53e3e';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  return valid;
}

function submitOrder() {
  const orderNum = 'PP-' + Math.floor(10000 + Math.random() * 90000);
  const cart = getCart();
  const total = getCartTotal();
  const tax = total * 0.08;
  const shipping = total >= 50 ? 0 : 5.99;

  const getVal = function (id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const order = {
    orderNum: orderNum,
    date: new Date().toLocaleDateString(),
    customer: (getVal('first-name') + ' ' + getVal('last-name')).trim(),
    email: getVal('email'),
    items: cart,
    subtotal: total,
    shipping: shipping,
    tax: tax,
    total: total + shipping + tax,
    status: 'Pending'
  };

  // Save order
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('ppOrders') || '[]'); } catch { orders = []; }
  orders.unshift(order);
  localStorage.setItem('ppOrders', JSON.stringify(orders));

  // Clear cart
  clearCart();

  // Show confirmation
  const orderNumEl = document.getElementById('order-number');
  if (orderNumEl) orderNumEl.textContent = orderNum;
  const confirmName = document.getElementById('confirm-name');
  if (confirmName) confirmName.textContent = order.customer;
  const confirmTotal = document.getElementById('confirm-total');
  if (confirmTotal) confirmTotal.textContent = '$' + order.total.toFixed(2);

  showStep(3);
}

function renderCheckoutSummary() {
  const cart = getCart();
  const subtotal = getCartTotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const itemsEl = document.getElementById('checkout-items');
  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = '<p style="color:#888;font-size:.85rem;">Cart is empty</p>';
    } else {
      itemsEl.innerHTML = cart.map(function (item) {
        const imgSrc = escapeHtml(item.image || '');
        const itemName = escapeHtml(item.name || '');
        return `<div class="checkout-item">
          <img src="${imgSrc}" alt="${itemName}">
          <div>
            <div class="checkout-item-name">${itemName}</div>
            <div class="checkout-item-sub">Qty: ${Number(item.qty)}</div>
          </div>
          <div style="margin-left:auto;font-weight:700;color:#111;">$${(item.price * item.qty).toFixed(2)}</div>
        </div>`;
      }).join('');
    }
  }

  const el = document.getElementById('checkout-subtotal');
  if (el) el.textContent = '$' + subtotal.toFixed(2);
  const shipEl = document.getElementById('checkout-shipping');
  if (shipEl) shipEl.textContent = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
  const taxEl = document.getElementById('checkout-tax');
  if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
  const totalEl = document.getElementById('checkout-total');
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

/* ── Admin Page ── */
function initAdmin() {
  const loginBox = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');
  const loginBtn = document.getElementById('admin-login-btn');
  const passInput = document.getElementById('admin-password');
  const errorEl = document.getElementById('admin-error');

  if (!loginBox) return;

  // Check if already authed in session
  if (sessionStorage.getItem('ppAdmin') === '1') {
    loginBox.style.display = 'none';
    if (dashboard) { dashboard.style.display = 'block'; renderAdminDashboard(); }
    return;
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', function () {
      if (passInput && passInput.value === 'admin123') {
        sessionStorage.setItem('ppAdmin', '1');
        loginBox.style.display = 'none';
        if (dashboard) { dashboard.style.display = 'block'; renderAdminDashboard(); }
      } else {
        if (errorEl) errorEl.textContent = 'Incorrect password. Please try again.';
        if (passInput) passInput.value = '';
      }
    });
  }

  if (passInput) {
    passInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') loginBtn.click();
    });
  }
}

function renderAdminDashboard() {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('ppOrders') || '[]'); } catch {}

  let inventory = 23;
  try {
    const inv = JSON.parse(localStorage.getItem('ppInventory') || 'null');
    if (inv !== null) inventory = inv;
  } catch {}

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const lowStock = inventory < 10;

  // Stats
  const el = function(id, val) { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('stat-orders', totalOrders);
  el('stat-revenue', '$' + totalRevenue.toFixed(2));
  el('stat-stock', inventory);
  el('stat-low', lowStock ? 'LOW STOCK' : 'OK');

  const lowCard = document.getElementById('stat-low-card');
  if (lowCard) lowCard.classList.toggle('alert', lowStock);

  // Inventory
  const stockInput = document.getElementById('stock-input');
  if (stockInput) {
    stockInput.value = inventory;
    const saveBtn = document.getElementById('save-stock-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        const newStock = parseInt(stockInput.value, 10) || 0;
        localStorage.setItem('ppInventory', JSON.stringify(newStock));
        el('stat-stock', newStock);
        const isLow = newStock < 10;
        el('stat-low', isLow ? 'LOW STOCK' : 'OK');
        if (lowCard) lowCard.classList.toggle('alert', isLow);
        const badge = document.getElementById('inv-badge');
        if (badge) {
          badge.textContent = isLow ? 'Low Stock' : 'In Stock';
          badge.className = 'badge ' + (isLow ? 'badge-danger' : 'badge-success');
        }
        saveBtn.textContent = 'Saved!';
        setTimeout(() => { saveBtn.textContent = 'Save'; }, 2000);
      });
    }
  }

  // Orders table
  const tbody = document.getElementById('orders-tbody');
  if (tbody) {
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#888;">No orders yet</td></tr>';
    } else {
      tbody.innerHTML = orders.map(function (o, i) {
        const orderNum = escapeHtml(o.orderNum || '#' + (i + 1));
        const date = escapeHtml(o.date || '');
        const customer = escapeHtml(o.customer || '');
        const items = escapeHtml(o.items ? o.items.map(function (it) { return it.name + ' x' + it.qty; }).join(', ') : '');
        const total = (o.total || 0).toFixed(2);
        const status = o.status || 'Pending';
        return `<tr>
          <td><strong>${orderNum}</strong></td>
          <td>${date}</td>
          <td>${customer}</td>
          <td>${items}</td>
          <td><strong>$${total}</strong></td>
          <td>
            <select class="status-select" data-idx="${i}">
              <option${status === 'Pending' ? ' selected' : ''}>Pending</option>
              <option${status === 'Shipped' ? ' selected' : ''}>Shipped</option>
              <option${status === 'Delivered' ? ' selected' : ''}>Delivered</option>
            </select>
          </td>
        </tr>`;
      }).join('');

      // Attach change listeners after DOM insertion
      tbody.querySelectorAll('.status-select').forEach(function (sel) {
        sel.addEventListener('change', function () {
          updateOrderStatus(parseInt(sel.dataset.idx, 10), sel.value);
        });
      });
    }
  }
}

function updateOrderStatus(idx, status) {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('ppOrders') || '[]'); } catch {}
  if (orders[idx]) {
    orders[idx].status = status;
    localStorage.setItem('ppOrders', JSON.stringify(orders));
  }
}
