// Cart stored in localStorage as JSON array: [{id, qty}]

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("pp_cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("pp_cart", JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.id === productId);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  updateCartBadge();
  showCartToast();
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.id === productId);
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
  localStorage.removeItem("pp_cart");
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll(".cart-badge").forEach((el) => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function showCartToast() {
  let toast = document.getElementById("cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.className = "cart-toast";
    toast.textContent = "Added to cart!";
    document.body.appendChild(toast);
  }
  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove("show"), 2500);
}
