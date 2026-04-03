// Cart stored in localStorage key: ppCart
// Format: { id: string, name: string, price: number, qty: number, image: string }

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('ppCart') || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('ppCart', JSON.stringify(cart));
}

function addToCart(qty) {
  qty = qty || 1;
  const cart = getCart();
  const idx = cart.findIndex(item => item.id === PRODUCT.id);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({
      id: PRODUCT.id,
      name: PRODUCT.name,
      price: PRODUCT.price,
      qty: qty,
      image: PRODUCT.images[0]
    });
  }
  saveCart(cart);
  updateCartBadge();
  showCartToast();
}

function removeFromCart() {
  saveCart([]);
  updateCartBadge();
}

function updateQty(delta) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.id === PRODUCT.id);
  if (idx > -1) {
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
    saveCart(cart);
    updateCartBadge();
  }
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count > 0 ? '(' + count + ')' : '(0)';
  });
}

function clearCart() {
  localStorage.removeItem('ppCart');
  updateCartBadge();
}

function showCartToast() {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    toast.textContent = '✓ Added to cart!';
    document.body.appendChild(toast);
  }
  toast.classList.add('show');
  clearTimeout(showCartToast._t);
  showCartToast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}
