// =============================================
// main.js — Paddles Peak core JS logic
// =============================================

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  updateCartBadge();
  initSmoothScroll();

  const page = detectPage();
  if (page === "index") initHomepage();
  if (page === "shop") initShop();
  if (page === "product") initProductPage();
  if (page === "cart") initCartPage();
  if (page === "checkout") initCheckout();
  if (page === "admin") initAdmin();
});

// ── Page Detection ──────────────────────────────────────────────
function detectPage() {
  const path = window.location.pathname;
  if (path.includes("shop")) return "shop";
  if (path.includes("product")) return "product";
  if (path.includes("cart")) return "cart";
  if (path.includes("checkout")) return "checkout";
  if (path.includes("admin")) return "admin";
  return "index";
}

// ── Navigation ──────────────────────────────────────────────────
function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", menu.classList.contains("open"));
    });
  }

  // Sticky nav shadow on scroll
  const nav = document.querySelector(".navbar");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (menu && !menu.contains(e.target) && toggle && !toggle.contains(e.target)) {
      menu.classList.remove("open");
    }
  });
}

// ── Smooth Scroll ───────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ── Homepage ────────────────────────────────────────────────────
function initHomepage() {
  renderProductCards(document.getElementById("products-grid"), PRODUCTS);
}

function renderProductCards(container, products) {
  if (!container) return;
  container.innerHTML = products.map(productCardHTML).join("");
  container.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(parseInt(btn.dataset.id), 1);
      btn.textContent = "Added!";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.classList.remove("added");
      }, 1500);
    });
  });
}

function productCardHTML(p) {
  const stars = renderStars(p.rating);
  return `
    <div class="product-card">
      <a href="/product.html?id=${p.id}" class="product-card-img-link">
        <div class="product-card-img" style="background-image:url('${p.image}')">
          <div class="product-card-img-overlay"></div>
          ${p.category === "bundles" ? '<span class="badge-best">Best Value</span>' : ""}
        </div>
      </a>
      <div class="product-card-body">
        <p class="product-card-cat">${p.category}</p>
        <a href="/product.html?id=${p.id}" class="product-card-title">${p.name}</a>
        <p class="product-card-desc">${p.shortDescription}</p>
        <div class="product-card-rating">${stars} <span class="rating-count">(${p.reviews})</span></div>
        <div class="product-card-footer">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="btn btn-teal btn-add-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = "";
  for (let i = 0; i < full; i++) html += '<span class="star full">★</span>';
  if (half) html += '<span class="star half">★</span>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<span class="star empty">☆</span>';
  return `<span class="stars">${html}</span><span class="rating-num">${rating}</span>`;
}

// ── Shop Page ────────────────────────────────────────────────────
function initShop() {
  const grid = document.getElementById("shop-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const sortSelect = document.getElementById("sort-select");
  let activeFilter = "all";

  function applyFilterSort() {
    let list = [...PRODUCTS];
    if (activeFilter !== "all") list = list.filter((p) => p.category === activeFilter);
    const sort = sortSelect ? sortSelect.value : "popular";
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.reviews - a.reviews); // popularity
    renderProductCards(grid, list);
    const count = document.getElementById("results-count");
    if (count) count.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      applyFilterSort();
    });
  });

  if (sortSelect) sortSelect.addEventListener("change", applyFilterSort);

  applyFilterSort();
}

// ── Product Detail Page ──────────────────────────────────────────
function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id")) || 1;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;

  // Set basic info
  setText("product-name", product.name);
  setText("product-price", `$${product.price.toFixed(2)}`);
  setText("product-description", product.description);
  setText("product-category", product.category);

  // Star ratings
  const ratingEl = document.getElementById("product-rating");
  if (ratingEl) ratingEl.innerHTML = renderStars(product.rating) + ` <span class="review-count">(${product.reviews} reviews)</span>`;

  // Stock
  const stockEl = document.getElementById("product-stock");
  if (stockEl) {
    stockEl.textContent = product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} left!` : "In Stock") : "Out of Stock";
    stockEl.className = "stock-badge " + (product.stock > 10 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-stock");
  }

  // Main image
  const mainImg = document.getElementById("product-main-img");
  if (mainImg) {
    mainImg.src = product.images[0];
    mainImg.alt = product.name;
  }

  // Thumbnails
  const thumbContainer = document.getElementById("product-thumbs");
  if (thumbContainer) {
    thumbContainer.innerHTML = product.images
      .map(
        (img, i) =>
          `<img src="${img}" alt="${product.name} view ${i + 1}" class="thumb${i === 0 ? " active" : ""}" data-src="${img}">`
      )
      .join("");
    thumbContainer.querySelectorAll(".thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        if (mainImg) {
          mainImg.src = thumb.dataset.src;
        }
        thumbContainer.querySelectorAll(".thumb").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });
  }

  // Specs
  const specsEl = document.getElementById("product-specs-table");
  if (specsEl) {
    specsEl.innerHTML = Object.entries(product.specs)
      .map(([k, v]) => `<tr><td class="spec-key">${capitalize(k)}</td><td class="spec-val">${v}</td></tr>`)
      .join("");
  }

  // Quantity
  const qtyInput = document.getElementById("qty-input");
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  if (qtyInput && qtyMinus && qtyPlus) {
    qtyMinus.addEventListener("click", () => {
      const v = parseInt(qtyInput.value);
      if (v > 1) qtyInput.value = v - 1;
    });
    qtyPlus.addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });
  }

  // Add to cart
  const addBtn = document.getElementById("add-to-cart-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const qty = parseInt(qtyInput ? qtyInput.value : 1);
      addToCart(product.id, qty);
      addBtn.textContent = "Added to Cart!";
      addBtn.classList.add("added");
      setTimeout(() => {
        addBtn.textContent = "Add to Cart";
        addBtn.classList.remove("added");
      }, 2000);
    });
  }

  // Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      const panel = document.getElementById("tab-" + btn.dataset.tab);
      if (panel) panel.classList.add("active");
    });
  });

  // Related products
  const relatedGrid = document.getElementById("related-grid");
  if (relatedGrid) {
    const related = PRODUCTS.filter((p) => p.id !== product.id);
    renderProductCards(relatedGrid, related);
  }

  // Wishlist
  const wishBtn = document.getElementById("wishlist-btn");
  if (wishBtn) {
    wishBtn.addEventListener("click", () => {
      wishBtn.classList.toggle("wishlisted");
      wishBtn.textContent = wishBtn.classList.contains("wishlisted") ? "♥ Wishlisted" : "♡ Add to Wishlist";
    });
  }
}

// ── Cart Page ────────────────────────────────────────────────────
function initCartPage() {
  renderCartPage();
}

function renderCartPage() {
  const cart = getCart();
  const tbody = document.getElementById("cart-tbody");
  const emptyMsg = document.getElementById("cart-empty");
  const cartContent = document.getElementById("cart-content");

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
    if (cartContent) cartContent.style.display = "none";
    return;
  }
  if (emptyMsg) emptyMsg.style.display = "none";
  if (cartContent) cartContent.style.display = "grid";

  if (!tbody) return;

  tbody.innerHTML = cart
    .map((item) => {
      const p = PRODUCTS.find((pr) => pr.id === item.id);
      if (!p) return "";
      const lineTotal = (p.price * item.qty).toFixed(2);
      return `
      <tr data-id="${p.id}">
        <td class="cart-product-cell">
          <div class="cart-product-img" style="background-image:url('${p.image}')"></div>
          <div>
            <a href="/product.html?id=${p.id}" class="cart-product-name">${p.name}</a>
            <p class="cart-product-cat">${p.category}</p>
          </div>
        </td>
        <td>$${p.price.toFixed(2)}</td>
        <td>
          <div class="qty-control">
            <button class="qty-btn cart-qty-minus" data-id="${p.id}">−</button>
            <input type="number" class="cart-qty-input" value="${item.qty}" min="1" data-id="${p.id}">
            <button class="qty-btn cart-qty-plus" data-id="${p.id}">+</button>
          </div>
        </td>
        <td class="cart-line-total">$${lineTotal}</td>
        <td><button class="btn-remove-cart" data-id="${p.id}">✕</button></td>
      </tr>`;
    })
    .join("");

  updateCartSummary();

  // Attach events
  tbody.querySelectorAll(".cart-qty-minus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = getCart().find((i) => i.id === id);
      if (item) updateCartQty(id, item.qty - 1);
      renderCartPage();
    });
  });
  tbody.querySelectorAll(".cart-qty-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = getCart().find((i) => i.id === id);
      if (item) updateCartQty(id, item.qty + 1);
      renderCartPage();
    });
  });
  tbody.querySelectorAll(".cart-qty-input").forEach((input) => {
    input.addEventListener("change", () => {
      updateCartQty(parseInt(input.dataset.id), parseInt(input.value) || 1);
      renderCartPage();
    });
  });
  tbody.querySelectorAll(".btn-remove-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(parseInt(btn.dataset.id));
      renderCartPage();
    });
  });
}

function updateCartSummary() {
  const cart = getCart();
  let subtotal = 0;
  cart.forEach((item) => {
    const p = PRODUCTS.find((pr) => pr.id === item.id);
    if (p) subtotal += p.price * item.qty;
  });
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  setText("cart-subtotal", `$${subtotal.toFixed(2)}`);
  setText("cart-shipping", shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`);
  setText("cart-tax", `$${tax.toFixed(2)}`);
  setText("cart-total", `$${total.toFixed(2)}`);

  const shippingNote = document.getElementById("shipping-note");
  if (shippingNote) {
    shippingNote.textContent =
      shipping === 0
        ? "✓ You qualify for free shipping!"
        : `Add $${(75 - subtotal).toFixed(2)} more for free shipping`;
    shippingNote.className = shipping === 0 ? "shipping-note good" : "shipping-note";
  }
}

// ── Checkout ─────────────────────────────────────────────────────
function initCheckout() {
  let currentStep = 1;
  const steps = document.querySelectorAll(".checkout-step");
  const stepIndicators = document.querySelectorAll(".step-indicator");

  function goToStep(n) {
    currentStep = n;
    steps.forEach((s, i) => s.classList.toggle("active", i + 1 === n));
    stepIndicators.forEach((s, i) => {
      s.classList.toggle("active", i + 1 === n);
      s.classList.toggle("done", i + 1 < n);
    });
    window.scrollTo(0, 0);
  }

  // Order summary in checkout
  renderCheckoutSummary();

  const nextBtns = document.querySelectorAll(".btn-next-step");
  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const form = btn.closest(".checkout-step");
      if (form && !validateStep(form)) return;
      goToStep(currentStep + 1);
    });
  });

  const backBtns = document.querySelectorAll(".btn-prev-step");
  backBtns.forEach((btn) => {
    btn.addEventListener("click", () => goToStep(currentStep - 1));
  });

  // Place order
  const placeBtn = document.getElementById("place-order-btn");
  if (placeBtn) {
    placeBtn.addEventListener("click", () => {
      const contact = gatherFormData("step1-form");
      const payment = gatherFormData("step2-form");
      const cart = getCart();
      let total = 0;
      const items = cart.map((item) => {
        const p = PRODUCTS.find((pr) => pr.id === item.id);
        if (p) total += p.price * item.qty;
        return { id: item.id, name: p ? p.name : item.id, qty: item.qty, price: p ? p.price : 0 };
      });
      const shipping = total > 75 ? 0 : 9.99;
      const tax = total * 0.08;
      total = total + shipping + tax;

      const order = placeOrder({ contact, items, subtotal: total - shipping - tax, shipping, tax, total });

      const modal = document.getElementById("order-success-modal");
      if (modal) {
        modal.style.display = "flex";
        setText("order-number", order.id);
      }
    });
  }

  const closeModal = document.getElementById("close-order-modal");
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      window.location.href = "/index.html";
    });
  }

  // Credit card visual
  const cardNum = document.getElementById("card-number");
  const cardDisplay = document.getElementById("card-number-display");
  if (cardNum && cardDisplay) {
    cardNum.addEventListener("input", () => {
      const v = cardNum.value.replace(/\D/g, "").slice(0, 16);
      cardNum.value = v.replace(/(.{4})/g, "$1 ").trim();
      cardDisplay.textContent = v.padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim();
    });
  }

  const cardName = document.getElementById("card-name");
  const cardNameDisplay = document.getElementById("card-name-display");
  if (cardName && cardNameDisplay) {
    cardName.addEventListener("input", () => {
      cardNameDisplay.textContent = cardName.value || "FULL NAME";
    });
  }

  const cardExpiry = document.getElementById("card-expiry");
  const cardExpiryDisplay = document.getElementById("card-expiry-display");
  if (cardExpiry && cardExpiryDisplay) {
    cardExpiry.addEventListener("input", () => {
      cardExpiryDisplay.textContent = cardExpiry.value || "MM/YY";
    });
  }

  goToStep(1);
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkout-summary-items");
  if (!container) return;
  const cart = getCart();
  let subtotal = 0;
  container.innerHTML = cart
    .map((item) => {
      const p = PRODUCTS.find((pr) => pr.id === item.id);
      if (!p) return "";
      subtotal += p.price * item.qty;
      return `<div class="summary-item">
        <span>${p.name} × ${item.qty}</span>
        <span>$${(p.price * item.qty).toFixed(2)}</span>
      </div>`;
    })
    .join("");
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  setText("checkout-subtotal", `$${subtotal.toFixed(2)}`);
  setText("checkout-shipping", shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`);
  setText("checkout-tax", `$${tax.toFixed(2)}`);
  setText("checkout-total", `$${(subtotal + shipping + tax).toFixed(2)}`);
}

function validateStep(stepEl) {
  const inputs = stepEl.querySelectorAll("input[required], select[required]");
  let valid = true;
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("invalid");
      valid = false;
    } else {
      input.classList.remove("invalid");
    }
  });
  return valid;
}

function gatherFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return {};
  const data = {};
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    if (el.name) data[el.name] = el.value;
  });
  return data;
}

// ── Admin ─────────────────────────────────────────────────────────
function initAdmin() {
  const gate = document.getElementById("admin-gate");
  const dashboard = document.getElementById("admin-dashboard");
  const loginForm = document.getElementById("admin-login-form");

  if (sessionStorage.getItem("pp_admin") === "true") {
    showAdminDashboard();
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pw = document.getElementById("admin-password").value;
      if (pw === "admin123") {
        sessionStorage.setItem("pp_admin", "true");
        showAdminDashboard();
      } else {
        const err = document.getElementById("login-error");
        if (err) err.style.display = "block";
      }
    });
  }

  function showAdminDashboard() {
    if (gate) gate.style.display = "none";
    if (dashboard) dashboard.style.display = "block";
    renderAdminStats();
    renderInventoryTable();
    renderOrdersTable();
  }
}

function renderAdminStats() {
  const orders = getOrders();
  const revenue = getTotalRevenue();
  const totalStock = PRODUCTS.reduce((s, p) => s + p.stock, 0);
  const lowStock = PRODUCTS.filter((p) => p.stock < 10).length;
  setText("stat-orders", orders.length);
  setText("stat-revenue", `$${revenue.toFixed(2)}`);
  setText("stat-stock", totalStock);
  setText("stat-lowstock", lowStock);
}

function renderInventoryTable() {
  const tbody = document.getElementById("inventory-tbody");
  if (!tbody) return;
  tbody.innerHTML = PRODUCTS.map(
    (p) => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td>
        <div class="stock-edit">
          <input type="number" class="stock-input" value="${p.stock}" data-id="${p.id}" min="0">
          ${p.stock < 10 ? '<span class="badge-low">Low Stock</span>' : ""}
        </div>
      </td>
      <td>${renderStars(p.rating)} <small>(${p.reviews})</small></td>
    </tr>`
  ).join("");

  tbody.querySelectorAll(".stock-input").forEach((input) => {
    input.addEventListener("change", () => {
      const prod = PRODUCTS.find((p) => p.id === parseInt(input.dataset.id));
      if (prod) {
        prod.stock = parseInt(input.value) || 0;
        renderInventoryTable();
        renderAdminStats();
      }
    });
  });
}

function renderOrdersTable() {
  const tbody = document.getElementById("orders-tbody");
  if (!tbody) return;
  const orders = getOrders();
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#94a3b8;">No orders yet</td></tr>';
    return;
  }
  tbody.innerHTML = orders
    .map(
      (o) => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${new Date(o.date).toLocaleDateString()}</td>
      <td>${o.contact ? o.contact.firstName + " " + o.contact.lastName : "—"}</td>
      <td>${o.items ? o.items.map((i) => `${i.name} ×${i.qty}`).join(", ") : "—"}</td>
      <td>$${(o.total || 0).toFixed(2)}</td>
      <td>
        <select class="order-status-select status-${(o.status || "Pending").toLowerCase()}" data-id="${o.id}">
          <option ${o.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${o.status === "Shipped" ? "selected" : ""}>Shipped</option>
          <option ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
        </select>
      </td>
    </tr>`
    )
    .join("");

  tbody.querySelectorAll(".order-status-select").forEach((sel) => {
    sel.addEventListener("change", () => {
      updateOrderStatus(sel.dataset.id, sel.value);
      sel.className = `order-status-select status-${sel.value.toLowerCase()}`;
    });
  });
}

// ── Utilities ─────────────────────────────────────────────────────
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, " $1");
}
