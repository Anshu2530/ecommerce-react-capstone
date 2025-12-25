// Simple orders service using localStorage to store mock orders.
const ORDERS_KEY = 'luxe-orders';

function _read() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function _write(list) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  } catch (e) {}
}

export const ordersService = {
  getOrders(userId) {
    const all = _read();
    if (!userId) return all;
    return all.filter(o => String(o.userId) === String(userId));
  },

  getOrderById(id) {
    const all = _read();
    return all.find(o => String(o.id) === String(id)) || null;
  },

  addOrder(userId, orderData) {
    const all = _read();
    const order = {
      ...orderData,
      userId,
      id: orderData.id || Date.now(),
      date: orderData.date || new Date().toISOString()
    };
    all.unshift(order);
    _write(all);
    return order;
  },

  createMockOrder(userId, items = [], opts = {}) {
    const all = _read();
    const id = Date.now();
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
    // status can be 'Delivered', 'Cancelled', 'Processing'
    const statuses = ['Delivered', 'Cancelled', 'Processing'];
    const status = opts.status || statuses[Math.floor(Math.random() * statuses.length)];
    const reason = status === 'Cancelled' ? (opts.reason || 'Customer requested cancellation') : '';
    const order = {
      id,
      userId,
      date: new Date().toISOString(),
      items,
      total,
      status,
      reason
    };
    all.unshift(order);
    _write(all);
    return order;
  },

  clearOrders() {
    _write([]);
  }
};

export default ordersService;
