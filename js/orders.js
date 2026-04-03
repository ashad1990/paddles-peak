const ORDERS_KEY = 'ppOrders';

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function createOrder(cartItems, customerInfo) {
  const orders = getOrders();
  const subtotal = cartItems.reduce((sum, item) => {
    const product = (typeof PRODUCTS !== 'undefined')
      ? PRODUCTS.find(p => p.id === item.id)
      : null;
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const total = subtotal + shipping;

  const order = {
    id: 'PP-' + Date.now(),
    date: new Date().toISOString(),
    items: cartItems.map(item => {
      const product = (typeof PRODUCTS !== 'undefined')
        ? PRODUCTS.find(p => p.id === item.id)
        : null;
      return {
        id: item.id,
        name: product ? product.name : item.id,
        price: product ? product.price : 0,
        qty: item.qty
      };
    }),
    customer: customerInfo,
    status: 'Pending',
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };

  orders.unshift(order);
  saveOrders(orders);
  return order;
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx > -1) {
    orders[idx].status = status;
    saveOrders(orders);
  }
}
