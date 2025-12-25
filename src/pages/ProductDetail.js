import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { Heart, ShoppingCart, Star, ArrowLeft, Truck, Shield, RefreshCw } from "lucide-react";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);
  const [showReturnInfo, setShowReturnInfo] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await api.fetchProductById(id);
        setProduct(data);
        
        // Check if in wishlist
        if (user) {
          const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.email}`)) || [];
          setIsInWishlist(wishlist.some(item => item.id === data.id));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, user]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} item(s) added to cart!`);
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.email}`)) || [];
    
    if (isInWishlist) {
      const updated = wishlist.filter(item => item.id !== product.id);
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(updated));
      setIsInWishlist(false);
      toast.success("Removed from wishlist");
    } else {
      wishlist.push(product);
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlist));
      setIsInWishlist(true);
      toast.success("Added to wishlist");
    }
  };

  if (loading) {
    return (
      <div className="page product-detail">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page product-detail">
        <div className="error-state">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="page product-detail">
      <div className="container">
        <motion.button 
          className="back-btn" 
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>

        <div className="product-detail-grid">
          {/* Left: Image */}
          <motion.div 
            className="product-image-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img 
              src={product.image} 
              alt={product.title} 
              className="product-main-image"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Right: Details */}
          <motion.div 
            className="product-info-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="product-category"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product.category}
            </motion.div>
            
            <motion.h1 
              className="product-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {product.title}
            </motion.h1>
            
            {/* Rating */}
            <motion.div 
              className="product-rating"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <Star
                      size={18}
                      fill={i < Math.floor(product.rating.rate) ? "#fbbf24" : "none"}
                      stroke={i < Math.floor(product.rating.rate) ? "#fbbf24" : "#d1d5db"}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="rating-text">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </motion.div>

            {/* Price */}
            <motion.div 
              className="product-price"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="current-price">₹{product.price}</span>
              <span className="original-price">₹{(product.price * 1.5).toFixed(2)}</span>
              <motion.span 
                className="discount"
                whileHover={{ scale: 1.1 }}
              >
                33% OFF
              </motion.span>
            </motion.div>

            {/* Description */}
            <motion.div 
              className="product-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div 
              className="quantity-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label>Quantity:</label>
              <div className="quantity-controls">
                <motion.button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  -
                </motion.button>
                <motion.span 
                  className="qty-value"
                  key={quantity}
                  initial={{ scale: 1.5, color: "#4f46e5" }}
                  animate={{ scale: 1, color: "#000" }}
                  transition={{ duration: 0.2 }}
                >
                  {quantity}
                </motion.span>
                <motion.button 
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="product-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.button 
                className="btn primary add-to-cart-btn" 
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </motion.button>
              <motion.button 
                className={`btn wishlist-btn ${isInWishlist ? 'active' : ''}`}
                onClick={handleWishlist}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={isInWishlist ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div 
              className="product-features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <motion.div 
                className="feature-item" 
                onClick={() => setShowDeliveryInfo(true)}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Truck size={24} />
                <div>
                  <strong>Free Delivery</strong>
                  <p>On orders above ₹500</p>
                </div>
                <span className="info-icon">ℹ️</span>
              </motion.div>
              <motion.div 
                className="feature-item" 
                onClick={() => setShowReturnInfo(true)}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw size={24} />
                <div>
                  <strong>Easy Returns</strong>
                  <p>7 days return policy</p>
                </div>
                <span className="info-icon">ℹ️</span>
              </motion.div>
              <motion.div 
                className="feature-item" 
                onClick={() => setShowPaymentInfo(true)}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield size={24} />
                <div>
                  <strong>Secure Payment</strong>
                  <p>100% safe transactions</p>
                </div>
                <span className="info-icon">ℹ️</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Delivery Info Modal */}
        <AnimatePresence>
          {showDeliveryInfo && (
            <motion.div 
              className="info-modal-overlay" 
              onClick={() => setShowDeliveryInfo(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="info-modal" 
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <button className="modal-close" onClick={() => setShowDeliveryInfo(false)}>×</button>
                <motion.div 
                  className="modal-header"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Truck size={32} />
                  <h2>Free Delivery</h2>
                </motion.div>
                <motion.div 
                  className="modal-content"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3>Delivery Information</h3>
                  <ul>
                    <li>✓ Free delivery on all orders above ₹500</li>
                    <li>✓ Standard delivery: 3-5 business days</li>
                    <li>✓ Express delivery available at checkout (₹99)</li>
                    <li>✓ Track your order in real-time</li>
                    <li>✓ Contactless delivery available</li>
                  </ul>
                  <h3>Delivery Charges</h3>
                  <ul>
                    <li>Orders below ₹500: ₹50 delivery charge</li>
                    <li>Orders above ₹500: FREE delivery</li>
                    <li>Express delivery (1-2 days): ₹99</li>
                  </ul>
                  <h3>Coverage Areas</h3>
                  <p>We deliver to all major cities and towns across India. Remote areas may take 1-2 extra days.</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Return Info Modal */}
        <AnimatePresence>
          {showReturnInfo && (
            <motion.div 
              className="info-modal-overlay" 
              onClick={() => setShowReturnInfo(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="info-modal" 
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <button className="modal-close" onClick={() => setShowReturnInfo(false)}>×</button>
                <motion.div 
                  className="modal-header"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <RefreshCw size={32} />
                  <h2>Easy Returns & Exchange</h2>
                </motion.div>
                <motion.div 
                  className="modal-content"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3>Return Policy</h3>
                  <ul>
                    <li>✓ 7 days easy return and exchange policy</li>
                    <li>✓ Products must be in original condition with tags</li>
                    <li>✓ Free return pickup from your doorstep</li>
                    <li>✓ Refund processed within 5-7 business days</li>
                    <li>✓ Exchange available for size/color variations</li>
                  </ul>
                  <h3>How to Return</h3>
                  <ol>
                    <li>Go to "My Orders" section</li>
                    <li>Select the item you want to return</li>
                    <li>Choose reason for return</li>
                    <li>Schedule free pickup</li>
                    <li>Get refund once item is received</li>
                  </ol>
                  <h3>Non-Returnable Items</h3>
                  <ul>
                    <li>Jewelry and precious stones</li>
                    <li>Innerwear and swimwear</li>
                    <li>Items marked as "Non-Returnable"</li>
                  </ul>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Info Modal */}
        <AnimatePresence>
          {showPaymentInfo && (
            <motion.div 
              className="info-modal-overlay" 
              onClick={() => setShowPaymentInfo(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="info-modal" 
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <button className="modal-close" onClick={() => setShowPaymentInfo(false)}>×</button>
                <motion.div 
                  className="modal-header"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Shield size={32} />
                  <h2>Secure Payment</h2>
                </motion.div>
                <motion.div 
                  className="modal-content"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3>Payment Security</h3>
                  <ul>
                    <li>✓ 100% secure and encrypted transactions</li>
                    <li>✓ PCI DSS compliant payment gateway</li>
                    <li>✓ Your card details are never stored</li>
                    <li>✓ SSL certified checkout process</li>
                    <li>✓ Two-factor authentication for added security</li>
                  </ul>
                  <h3>Payment Methods Accepted</h3>
                  <ul>
                    <li>💳 Credit Cards (Visa, Mastercard, American Express)</li>
                    <li>💳 Debit Cards (All major banks)</li>
                    <li>🏦 Net Banking (50+ banks supported)</li>
                    <li>📱 UPI (Google Pay, PhonePe, Paytm)</li>
                    <li>💰 Wallets (Paytm, Mobikwik, Freecharge)</li>
                    <li>💵 Cash on Delivery (Available for select areas)</li>
                  </ul>
                  <h3>Buyer Protection</h3>
                  <p>All purchases are protected under our Buyer Protection policy. If you don't receive your order or if it's significantly different from the description, you are eligible for a full refund.</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductDetail;
