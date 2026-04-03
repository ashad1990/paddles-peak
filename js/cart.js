// Cart management using localStorage
const Cart = (() => {
  const STORAGE_KEY = 'paddlesPeakCart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function addItem(productId, quantity = 1) {
    const cart = getCart();
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }
    saveCart(cart);
    showAddedToCartFeedback();
  }

  function removeItem(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
  }

  function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      item.quantity = quantity;
      saveCart(cart);
    }
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    updateCartBadge();
  }

  function getTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function getItemCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      const count = getItemCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function showAddedToCartFeedback() {
    const feedback = document.getElementById('cart-feedback');
    if (feedback) {
      feedback.classList.add('show');
      setTimeout(() => feedback.classList.remove('show'), 2000);
    }
  }

  // Initialize badge on load
  document.addEventListener('DOMContentLoaded', updateCartBadge);

  return { getCart, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount, updateCartBadge };
})();
