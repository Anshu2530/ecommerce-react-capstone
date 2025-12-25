import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { cart, isOpen, toggleCart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMockPayment = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Please provide name and email to proceed');
      return;
    }

    setProcessing(true);
    toast.loading('Processing payment...', { id: 'proc' });

    // Simulate network/payment delay
    setTimeout(() => {
      toast.dismiss('proc');
      toast.success('Payment successful — Order placed!');
      clearCart();
      setProcessing(false);
      setShowCheckoutForm(false);
      toggleCart();
      navigate('/checkout');
    }, 1400);
  };

  return (
    <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button onClick={toggleCart} aria-label="Close cart">✕</button>
      </div>

      <div className="cart-body">
        {cart.length === 0 ? (
          <div className="empty-cart">Your cart is empty</div>
        ) : (
          <ul className="cart-items">
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-thumb" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-meta">
                    <span className="cart-price">${(item.price * item.quantity).toFixed(2)}</span>
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>

        {cart.length > 0 && (
          <>
            {!showCheckoutForm ? (
              <div className="cart-actions">
                <button className="btn primary" onClick={() => setShowCheckoutForm(true)}>Checkout (Mock)</button>
                <button className="btn" onClick={clearCart}>Clear Cart</button>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={handleMockPayment}>
                <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
                <input name="email" placeholder="Email address" value={form.email} onChange={handleChange} />
                <div className="checkout-actions">
                  <button type="submit" className="btn primary" disabled={processing}>Pay (Mock)</button>
                  <button type="button" className="btn" onClick={() => setShowCheckoutForm(false)}>Cancel</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default CartSidebar;
