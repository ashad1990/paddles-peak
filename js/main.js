// Shared utilities for Paddles Peak

function formatPrice(price) {
  return '$' + price.toFixed(2);
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<span class="star full">★</span>';
  if (half) html += '<span class="star half">★</span>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<span class="star empty">☆</span>';
  return html;
}

function buildProductCardHTML(product) {
  const isBundle = product.category === 'bundles';
  const badgeHTML = isBundle
    ? '<span class="badge-best-value">Best Value</span>'
    : '';
  const bundleCallout = isBundle
    ? '<p class="bundle-callout">🎒 Paddle + Case. One price. Zero compromise.</p>'
    : '';

  const imageHTML = isBundle && product.secondaryImage
    ? `<div class="bundle-image-composition">
        <img src="${product.secondaryImage}" alt="Paddles Peak Carry Case" class="bundle-img-case" loading="lazy">
        <img src="${product.image}" alt="${product.name}" class="bundle-img-paddle" loading="lazy">
       </div>`
    : `<img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy">`;

  return `
    <div class="product-card" data-id="${product.id}">
      <a href="product.html?id=${product.id}" class="product-card-image-link">
        <div class="product-card-image-wrap">
          ${badgeHTML}
          ${imageHTML}
        </div>
      </a>
      <div class="product-card-body">
        <h3 class="product-card-name">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card-rating">
          ${renderStars(product.rating)}
          <span class="review-count">(${product.reviews})</span>
        </div>
        <div class="product-card-price">${formatPrice(product.price)}</div>
        ${bundleCallout}
        <button class="btn btn-primary btn-add-to-cart" onclick="Cart.addItem(${product.id})">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });
});
