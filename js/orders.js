// Orders stored in localStorage as JSON array

function generateOrderId() {
  return "PP-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("pp_orders") || "[]");
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem("pp_orders", JSON.stringify(orders));
}

function placeOrder(orderData) {
  const orders = getOrders();
  const order = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    status: "Pending",
    ...orderData,
  };
  orders.unshift(order);
  saveOrders(orders);
  clearCart();
  return order;
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx > -1) {
    orders[idx].status = status;
    saveOrders(orders);
  }
}

function getTotalRevenue() {
  return getOrders().reduce((sum, o) => sum + (o.total || 0), 0);
}
