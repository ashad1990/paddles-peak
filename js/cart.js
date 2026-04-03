const CART_KEY = 'ppCart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.id === productId);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  updateCartBadge();
  showCartToast(productId);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.id === productId);
  if (idx > -1) {
    if (qty <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx].qty = qty;
    }
  }
  saveCart(cart);
  updateCartBadge();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function showCartToast(productId) {
  const product = (typeof PRODUCTS !== 'undefined')
    ? PRODUCTS.find(p => p.id === productId)
    : null;
  const name = product ? product.name : 'Item';

  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-check">✓</span> <strong>${name}</strong> added to cart`;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}
