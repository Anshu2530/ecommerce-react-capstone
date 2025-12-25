import React, { useEffect, useState } from 'react';
import { wishlistService } from '../services/WishlistService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Wishlist.css';

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const uId = user?.id || localStorage.getItem('luxe-user-id') || 'guest';
    const data = wishlistService.getWishlist(uId);
    setItems(data || []);
  }, [user]);

  const moveToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    const uId = user?.id || localStorage.getItem('luxe-user-id') || 'guest';
    const updated = wishlistService.removeItem(uId, item.id);
    setItems(updated);
  };

  const remove = (id) => {
    const uId = user?.id || localStorage.getItem('luxe-user-id') || 'guest';
    const updated = wishlistService.removeItem(uId, id);
    setItems(updated);
  };

  if (!user) {
    return (
      <div className="container">
        <div className="page wishlist-page">
          <h2>Wishlist</h2>
          <p>Please login to view your wishlist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page wishlist-page">
        <div className="wishlist-header">
          <h2>Wishlist</h2>
        </div>

        {items.length === 0 ? (
          <div className="empty-wishlist">Your wishlist is empty.</div>
        ) : (
          <div className="wishlist-grid">
            <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.id}
                className="wishlist-card"
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                whileHover={{ scale: 1.02 }}
                layout
              >
                <div className="card-image">
                  {item.image ? <img src={item.image} alt={item.title} /> : <div className="img-fallback">No image</div>}
                </div>
                <div className="card-body">
                  <div className="card-title">{item.title}</div>
                  <div className="card-price">${item.price?.toFixed(2)}</div>
                </div>
                <div className="card-actions">
                  <button className="btn small" onClick={() => moveToCart(item)}>Move to Cart</button>
                  <button className="btn ghost" onClick={() => remove(item.id)} aria-label={`Remove ${item.title} from wishlist`}>Remove</button>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
