// Simple wishlist service backed by localStorage
const WISHLIST_KEY = 'luxe-wishlist';

function _read() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function _write(data) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(data));
  } catch (e) {}
}

export const wishlistService = {
  getWishlist(userId) {
    const all = _read();
    return all[userId] || [];
  },

  saveWishlist(userId, items) {
    const all = _read();
    all[userId] = items || [];
    _write(all);
  },

  addItem(userId, item) {
    const current = this.getWishlist(userId);
    const exists = current.find(i => String(i.id) === String(item.id));
    if (!exists) {
      current.unshift(item);
      this.saveWishlist(userId, current);
    }
    return current;
  },

  removeItem(userId, itemId) {
    let current = this.getWishlist(userId);
    current = current.filter(i => String(i.id) !== String(itemId));
    this.saveWishlist(userId, current);
    return current;
  },

  clear(userId) {
    this.saveWishlist(userId, []);
  }
};

export default wishlistService;
