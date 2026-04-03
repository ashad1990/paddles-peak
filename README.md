# Paddles Peak 🏔️

Premium pickleball e-commerce website — dark teal brand aesthetic, USAPA approved gear.

## Product Lineup

| Product | Price | Details |
|---------|-------|---------|
| **The Summit Paddle** | $89.99 | Raw Carbon Fiber face, Polymer Honeycomb core, 7.8 oz, USAPA Approved |
| **The Base Camp Bundle** | $59.99 | The Summit Paddle + Paddles Peak Carry Case — bundled together |

> The carry case is **only sold as part of the bundle** — not as a standalone product.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Homepage — hero, product collection, bundle highlight, testimonials |
| `shop.html` | Shop — clean 2-product grid with sort dropdown |
| `product.html` | Product detail — gallery switcher (bundle shows both images), specs, reviews |
| `cart.html` | Shopping cart with quantity controls and order summary |
| `checkout.html` | Multi-step checkout (Contact → Payment → Confirmation) |
| `admin.html` | Password-protected inventory & orders dashboard (password: `admin123`) |

## Images

Place real product photos in the `images/` folder:
- `images/paddle-main.jpg` — the teal mountain paddle
- `images/paddle-case.jpg` — the black Paddles Peak carry case

## Design

- **Dark teal** color palette (`#0a0f14` background, `#2dd4bf` teal)
- Teal radial glow behind product images for professional polish
- Bundle card shows both images (paddle + case) in a layered CSS composition
- "Best Value" green badge on the bundle card
- Fully responsive, mobile-first layout