# Paddles Peak 🏔️

A premium pickleball paddle e-commerce website — dark, sporty, and mountain-inspired.

## Brand

**Paddles Peak** sells performance pickleball paddles with a teal/mountain/aurora borealis aesthetic. The brand palette is dark navy + teal, inspired by the paddle graphic.

## How to Run Locally

Just open `index.html` in any modern browser — no build tools or dependencies needed.

```bash
# Option 1: Open directly
open index.html

# Option 2: Local server (avoids some browser path restrictions)
npx serve .
# or
python3 -m http.server 8080
```

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/index.html` | Hero, product grid, features, testimonials |
| Shop | `/shop.html` | Filterable product listing with sort |
| Product | `/product.html?id=1` | Product detail, gallery, specs, reviews |
| Cart | `/cart.html` | Cart table, order summary |
| Checkout | `/checkout.html` | 3-step form, order placement |
| Admin | `/admin.html` | Password-protected inventory & order dashboard |

## Admin Panel

- URL: `/admin.html`
- Password: `admin123`
- Features: inventory management (inline stock editing), order tracking, dashboard stats

## Product Images

Add real product photos to the `/images/` folder:

| File | Description |
|------|-------------|
| `paddle-main.jpg` | The Paddles Peak pickleball paddle — teal mountain/aurora borealis graphic |
| `paddle-case.jpg` | The Paddles Peak branded black carrying case with mesh pocket |

The site includes CSS fallback art when images are not present.

## File Structure

```
paddles-peak/
├── index.html          # Homepage
├── shop.html           # Product listing
├── product.html        # Product detail
├── cart.html           # Shopping cart
├── checkout.html       # Checkout (3-step)
├── admin.html          # Admin dashboard
├── css/
│   └── styles.css      # Full design system
├── js/
│   ├── products.js     # PRODUCTS array
│   ├── cart.js         # Cart localStorage logic
│   ├── orders.js       # Order localStorage logic
│   └── main.js         # All page logic
├── images/
│   └── .gitkeep        # Add paddle-main.jpg + paddle-case.jpg here
└── README.md
```

## Features

- 🏔️ Premium dark/teal mountain brand aesthetic
- 🛒 Full shopping cart with localStorage persistence
- 📦 Multi-step checkout with order confirmation
- 🔐 Admin dashboard (password: `admin123`) with:
  - Inventory management (inline stock editing, low-stock alerts)
  - Order management with status updates
  - Revenue & stats dashboard
- 📱 Fully responsive — mobile hamburger menu
- ⚡ Zero dependencies — pure HTML5, CSS3, Vanilla JS
- ✓ USAPA approved product lineup

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, grid, flexbox, animations
- **Vanilla JavaScript** — no frameworks
- **Google Fonts** — Montserrat + Inter
- **localStorage** — cart & order persistence
