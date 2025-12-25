import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersService } from '../services/OrdersService';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CreditCard, 
  Wallet, 
  Package, 
  ShieldCheck,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  CheckCircle
} from 'lucide-react';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Home', address: '123 Main St, City, State 123456', phone: '9876543210', isDefault: true },
    { id: 2, name: 'Office', address: '456 Work Ave, City, State 654321', phone: '9876543211', isDefault: false }
  ]);

  const [selectedAddress, setSelectedAddress] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const deliveryCharge = totalPrice > 500 ? 0 : 40;
  const discount = Math.floor(totalPrice * 0.1);
  const finalTotal = totalPrice + deliveryCharge - discount;

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.address && newAddress.phone) {
      setAddresses([...addresses, { ...newAddress, id: Date.now(), isDefault: false }]);
      setNewAddress({ name: '', address: '', phone: '' });
      setShowAddAddress(false);
    }
  };

  const handleDeleteAddress = (id) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter(a => a.id !== id));
      if (selectedAddress === id) {
        setSelectedAddress(addresses.find(a => a.id !== id).id);
      }
    }
  };

  const handlePlaceOrder = () => {
    if (!user) {
      alert('Please login to place order');
      return;
    }

    const order = {
      id: Date.now(),
      items: cart,
      total: finalTotal,
      address: addresses.find(a => a.id === selectedAddress),
      paymentMethod,
      status: 'Confirmed',
      date: new Date().toISOString()
    };

    const userId = user.id || localStorage.getItem('luxe-user-id');
    ordersService.addOrder(userId, order);
    clearCart();
    navigate('/orders');
  };

  if (!user) {
    return (
      <div className="page checkout-page">
        <div className="container">
          <div className="auth-required">
            <ShieldCheck size={64} />
            <h2>Please Login</h2>
            <p>You need to login to checkout</p>
            <button className="btn primary" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page checkout-page">
        <div className="container">
          <div className="empty-cart">
            <Package size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some products to checkout</p>
            <button className="btn primary" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container">
        <motion.div 
          className="checkout-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Left Section */}
          <div className="checkout-main">
            {/* Header */}
            <div className="checkout-header">
              <h1>Checkout</h1>
              <div className="checkout-steps">
                <div className="step active">
                  <CheckCircle size={20} />
                  <span>Cart</span>
                </div>
                <ChevronRight size={16} />
                <div className="step active">
                  <CheckCircle size={20} />
                  <span>Address</span>
                </div>
                <ChevronRight size={16} />
                <div className="step">
                  <div className="step-number">3</div>
                  <span>Payment</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="checkout-section">
              <div className="section-header">
                <div className="section-title">
                  <MapPin size={24} />
                  <h2>Delivery Address</h2>
                </div>
                <button className="btn-add" onClick={() => setShowAddAddress(true)}>
                  <Plus size={18} />
                  Add New Address
                </button>
              </div>

              <div className="address-list">
                {addresses.map((addr) => (
                  <motion.div
                    key={addr.id}
                    className={`address-card ${selectedAddress === addr.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(addr.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="address-radio">
                      {selectedAddress === addr.id && <div className="radio-checked"></div>}
                    </div>
                    <div className="address-info">
                      <div className="address-name">
                        {addr.name}
                        {addr.isDefault && <span className="badge">Default</span>}
                      </div>
                      <p className="address-text">{addr.address}</p>
                      <p className="address-phone">Phone: {addr.phone}</p>
                    </div>
                    <div className="address-actions">
                      <button className="btn-icon" onClick={(e) => { e.stopPropagation(); }}>
                        <Edit2 size={16} />
                      </button>
                      {!addr.isDefault && (
                        <button 
                          className="btn-icon danger" 
                          onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {showAddAddress && (
                <motion.div 
                  className="add-address-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <h3>Add New Address</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Address Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Home, Office"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Complete Address</label>
                      <textarea
                        placeholder="House No., Building Name, Road Name, Area, City, State, PIN Code"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn secondary" onClick={() => setShowAddAddress(false)}>
                      Cancel
                    </button>
                    <button className="btn primary" onClick={handleAddAddress}>
                      Add Address
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <div className="section-title">
                <CreditCard size={24} />
                <h2>Payment Method</h2>
              </div>

              <div className="payment-options">
                <div 
                  className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="payment-radio">
                    {paymentMethod === 'cod' && <div className="radio-checked"></div>}
                  </div>
                  <Wallet size={24} />
                  <div className="payment-info">
                    <h3>Cash on Delivery</h3>
                    <p>Pay when you receive the order</p>
                  </div>
                </div>

                <div 
                  className={`payment-card ${paymentMethod === 'online' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('online')}
                >
                  <div className="payment-radio">
                    {paymentMethod === 'online' && <div className="radio-checked"></div>}
                  </div>
                  <CreditCard size={24} />
                  <div className="payment-info">
                    <h3>Online Payment</h3>
                    <p>UPI, Cards, Net Banking, Wallets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="price-details">
                <div className="price-row">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? 'free' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="price-row discount">
                  <span>Discount (10%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="total-row">
                <span>Total Amount</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>

              <button className="btn primary btn-place-order" onClick={handlePlaceOrder}>
                <ShieldCheck size={20} />
                Place Order
              </button>

              <div className="secure-info">
                <ShieldCheck size={16} />
                <span>Safe and Secure Payments</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
