const PRODUCTS = [
  {
    id: 'summit-paddle',
    name: 'The Summit Paddle',
    price: 89.99,
    images: ['images/paddle-front.png', 'images/paddle-angle.png', 'images/paddle-hand.png'],
    primaryImage: 'images/paddle-front.png',
    description: 'The signature Paddles Peak pickleball paddle. Engineered for spin, control, and explosive power with a raw carbon fiber face and polymer honeycomb core. Court-ready from day one.',
    shortDesc: 'Raw carbon fiber face. Championship-level performance.',
    specs: {
      'Face Material': 'Raw Carbon Fiber (T700)',
      'Core': 'Polymer Honeycomb',
      'Weight': '7.8 oz',
      'Grip Size': '4.25 inches',
      'Grip Length': '5.25 inches',
      'Paddle Length': '15.5 inches',
      'Paddle Width': '8 inches',
      'Edge Guard': 'Protective Edge Guard',
      'Certification': 'USAPA Approved'
    },
    stock: 47,
    rating: 4.8,
    reviewCount: 124,
    badge: null
  },
  {
    id: 'base-camp-bundle',
    name: 'The Base Camp Bundle',
    price: 59.99,
    images: ['images/bundle-shot.png', 'images/paddle-front.png', 'images/case-render.png'],
    primaryImage: 'images/bundle-shot.png',
    description: 'Everything you need to dominate the court. The Summit Paddle + the premium Paddles Peak branded carry case — bundled together at an unbeatable price. Protect your investment on and off the court.',
    shortDesc: 'Paddle + Premium Carry Case. Complete kit, one price.',
    specs: {
      'Includes': 'The Summit Paddle + Paddles Peak Carry Case',
      'Face Material': 'Raw Carbon Fiber (T700)',
      'Core': 'Polymer Honeycomb',
      'Weight': '7.8 oz',
      'Case Style': 'Padded zip-close with front mesh pocket',
      'Case Strap': 'Top carry handle',
      'Certification': 'USAPA Approved'
    },
    stock: 23,
    rating: 4.9,
    reviewCount: 89,
    badge: 'Best Value'
  }
];
