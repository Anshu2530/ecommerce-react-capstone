import React, { useEffect, useMemo, useState } from 'react';
import { ordersService } from '../services/ordersService';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Orders.css';

const TABS = ['All', 'Delivered', 'Cancelled', 'Processing'];

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = () => {
    const uId = user?.id || localStorage.getItem('luxe-user-id');
    const data = ordersService.getOrders(uId);
    console.log('Loaded orders:', data);
    setOrders(data || []);
  };

  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    const processing = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed' || o.status === 'Shipped').length;
    return { total, delivered, cancelled, processing };
  }, [orders]);

  const filtered = useMemo(() => {
    if (filter === 'All') return orders;
    if (filter === 'Processing') {
      return orders.filter(o => ['Processing', 'Confirmed', 'Shipped'].includes(o.status));
    }
    return orders.filter(o => o.status === filter);
  }, [orders, filter]);

  const createDemoOrder = () => {
    const uId = user?.id || localStorage.getItem('luxe-user-id') || 'guest';
    const items = [
      { title: 'Demo T-shirt', quantity: 1, price: 29.99, image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg' },
      { title: 'Canvas Tote', quantity: 1, price: 19.99, image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg' }
    ];
    ordersService.createMockOrder(uId, items);
    loadOrders();
  };

  if (!user) {
    return (
      <div className="container">
        <div className="page orders-page">
          <h2>Orders</h2>
          <p>Please login to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page orders-page">
        <div className="orders-header">
          <h2>My Orders</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="orders-stats">
              <div className="stat"><strong>{stats.total}</strong><div className="muted small">Total</div></div>
              <div className="stat"><strong>{stats.delivered}</strong><div className="muted small">Delivered</div></div>
              <div className="stat"><strong>{stats.cancelled}</strong><div className="muted small">Cancelled</div></div>
            </div>
            <button className="btn" onClick={createDemoOrder}>Create mock order</button>
          </div>
        </div>

        <div className="orders-tabs" role="tablist" aria-label="Order filters">
          {TABS.map(t => (
            <button
              key={t}
              className={`tab-btn ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
              role="tab"
              aria-selected={filter === t}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-orders">You have no orders yet.</div>
        ) : (
          <div className="orders-list">
            <AnimatePresence>
            {filtered.map(order => (
              <motion.div
                key={order.id}
                className={`order-card ${order.status === 'Cancelled' ? 'cancelled' : ''}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                whileHover={{ scale: 1.01 }}
                layout
              >
                <div className="order-row">
                  <div><strong>Order ID:</strong> #{order.id.toString().slice(-8)}</div>
                  <div><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</div>
                  <div className={`order-status ${order.status}`}>{order.status}</div>
                </div>
                <div className="order-items">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="order-item">
                      <div className="item-image">
                        {it.image ? <img src={it.image} alt={it.title} /> : <div className="img-fallback">📦</div>}
                      </div>
                      <div className="item-title">{it.title}</div>
                      <div className="item-qty">x{it.quantity}</div>
                      <div className="item-price">₹{((it.price||0)*it.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div><strong>Total:</strong> ₹{order.total.toFixed(2)}</div>
                  {order.reason && <div className="order-reason">Reason: {order.reason}</div>}
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

export default Orders;
