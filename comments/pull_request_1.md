## Updated Requirements from Owner

Please update the website with the following changes:

### Product Lineup — SIMPLIFIED (only 2 products)
1. **The Summit Paddle** — sold separately, price to be confirmed (leave as $89.99 for now unless updated)
2. **The Base Camp Bundle** (paddle + carrying case together) — **$59.99**

❌ Remove the standalone "Carry Case" as a separate product — it is NOT sold separately.

### Product Data Update (`js/products.js`)
```js
const PRODUCTS = [
  {
    id: 1,
    name: "The Summit Paddle",
    price: 89.99,
    category: "paddles",
    image: "images/paddle-main.jpg",
    description: "The signature Paddles Peak paddle featuring a stunning mountain graphic and premium carbon fiber face. Engineered for spin, control, and power.",
    specs: {
      face: "Raw Carbon Fiber",
      core: "Polymer Honeycomb",
      weight: "7.8 oz",
      gripSize: "4.25 inches",
      dimensions: "15.5\" x 8\"
      certified: "USAPA Approved"
    },
    stock: 47,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "The Base Camp Bundle",
    price: 59.99,
    category: "bundles",
    image: "images/paddle-main.jpg",
    secondaryImage: "images/paddle-case.jpg",
    description: "Everything you need to hit the court. The Summit Paddle + the premium Paddles Peak branded carry case — bundled together at an unbeatable price.",
    specs: {
      includes: "The Summit Paddle + Paddles Peak Carry Case",
      face: "Raw Carbon Fiber",
      core: "Polymer Honeycomb",
      weight: "7.8 oz",
      caseStyle: "Padded zip-close with mesh pocket",
      certified: "USAPA Approved"
    },
    stock: 23,
    rating: 4.9,
    reviews: 89
  }
];
```

### Image Presentation
- Both product images provided by the owner are real photos:
  - `images/paddle-main.jpg` = the teal mountain paddle
  - `images/paddle-case.jpg` = the black Paddles Peak carry case
- For the **Bundle product card and detail page**: display BOTH images side by side or as a layered composition using CSS (paddle overlapping the case slightly), so customers can see what's included
- Use CSS to give the product images a dark background with a teal radial glow effect, making them look professional on the dark-themed site
- On the product detail page for the bundle, show both images in the image gallery switcher (image 1 = paddle, image 2 = case)

### Marketing Copy Updates
- Hero tagline: "Reach New Heights in Every Rally"
- Bundle callout: "🎒 Paddle + Case. One price. Zero compromise." — **$59.99**
- Emphasize the value: premium carry case included with bundle
- Feature section should highlight the carry case as a bonus/value-add for the bundle

### Navigation & Shop
- Shop page should still show both products (paddle + bundle)
- No filtering needed by category since there are only 2 products — simplify the shop page to just a clean 2-product grid

### Admin Panel
- Only 2 products in inventory table
- Everything else remains the same