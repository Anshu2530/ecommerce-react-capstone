import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, addToCart, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const handleIncrement = (item) => {
    addToCart(item);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      // Decrease quantity by removing one
      const updatedCart = cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      // Update via context (you might need to add a method for this)
      removeFromCart(item.id);
      if (item.quantity > 1) {
        for (let i = 0; i < item.quantity - 1; i++) {
          addToCart(item);
        }
      }
    }
  };

  return (
    <div className="page cart-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cart-header"
        >
          <h2>Shopping Cart</h2>
          <p>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div 
            className="empty-cart"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ShoppingBag size={64} />
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
            <button className="btn primary" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-price">₹{item.price}</p>
                  </div>

                  <div className="item-quantity">
                    <motion.button
                      className="qty-btn"
                      onClick={() => handleDecrement(item)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </motion.button>
                    <span className="qty-display">{item.quantity}</span>
                    <motion.button
                      className="qty-btn"
                      onClick={() => handleIncrement(item)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>

                  <div className="item-total">
                    <p className="total-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <motion.button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    whileHover={{ scale: 1.1, color: "#ef4444" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="cart-summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-delivery">FREE</span>
              </div>
              
              <div className="summary-row discount">
                <span>Discount (33%)</span>
                <span>-₹{(totalPrice * 0.33).toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{(totalPrice * 0.67).toFixed(2)}</span>
              </div>

              <motion.button
                className="btn primary checkout-btn"
                onClick={() => navigate('/checkout')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Proceed to Checkout
              </motion.button>

              <button 
                className="btn continue-shopping"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
