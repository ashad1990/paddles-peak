# Paddles Peak 🏔️

**Premium pickleball e-commerce website** — clean white design inspired by professional paddle brands like Selkirk and 101 Pickleball.

## Features

- Clean white e-commerce design with dark hero section
- Responsive layout (mobile-first)
- Product cards with teal accent buttons
- Cart with localStorage persistence
- 3-step checkout flow
- Admin dashboard with password gate

## Getting Started

Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server 8080
# Then open http://localhost:8080
```

## Pages

| Page | Description |
|---|---|
| `index.html` | Homepage with hero, products, features, testimonials, bundle CTA |
| `shop.html` | Shop all products with sort |
| `product.html?id=summit-paddle` | Product detail page |
| `product.html?id=base-camp-bundle` | Bundle product detail page |
| `cart.html` | Shopping cart |
| `checkout.html` | 3-step checkout (demo only) |
| `admin.html` | Admin dashboard |

## Products

| Product | ID | Price |
|---|---|---|
| The Summit Paddle | `summit-paddle` | $89.99 |
| The Base Camp Bundle | `base-camp-bundle` | $59.99 |

## Admin

Visit `admin.html` and enter password: **admin123**

The dashboard shows:
- Order stats and revenue
- Inventory management with editable stock levels
- Order history with status controls (Pending → Processing → Shipped → Delivered)

## Tech Stack

- Vanilla HTML, CSS, JavaScript — no frameworks
- Google Fonts (Poppins)
- localStorage for cart and orders
- Placeholder PNG images (swap with real product photos)

## Design System

- **Primary accent**: `#2dd4bf` (teal)
- **Background**: `#ffffff` / `#f8f9fa`
- **Dark sections**: `#0d1b2a`
- **Typography**: Poppins (Google Fonts)
