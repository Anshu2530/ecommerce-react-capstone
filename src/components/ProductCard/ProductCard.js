import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Eye, Heart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { wishlistService } from "../../services/WishlistService";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleWishlist = () => {
    const uId = user?.id || localStorage.getItem("luxe-user-id") || "guest";
    if (!isWishlisted) {
      wishlistService.addItem(uId, product);
      setIsWishlisted(true);
    } else {
      wishlistService.removeItem(uId, product.id);
      setIsWishlisted(false);
    }
  };

  // Init wishlist state
  useEffect(() => {
    const uId = user?.id || localStorage.getItem("luxe-user-id") || "guest";
    const list = wishlistService.getWishlist(uId);
    setIsWishlisted(list.some((i) => String(i.id) === String(product.id)));
  }, [user, product.id]);

  return (
    <motion.div
      className="product-card hover-lift"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            loading="lazy"
          />
        </Link>

        {/* Quick Actions */}
        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
        >
          <button className="quick-action-btn" onClick={handleWishlist}>
            <Heart size={18} className={isWishlisted ? "filled" : ""} />
          </button>

          <Link to={`/product/${product.id}`} className="quick-action-btn">
            <Eye size={18} />
          </Link>
        </motion.div>

        {/* Category */}
        <span className="category-badge">
          {product.mainCategory || product.category}
        </span>
      </div>

      {/* Info */}
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-title">
          <h3>{product.title}</h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(product.rating.rate) ? "filled" : ""}
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="rating-count">
              ({product.rating.count})
            </span>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="product-description">
            {product.description.length > 80
              ? product.description.slice(0, 80) + "..."
              : product.description}
          </p>
        )}

        {/* Footer */}
        <div className="product-footer">
          <div className="price-container">
            <span className="product-price">
              ₹{product.price}
            </span>
          </div>

          <motion.button
            className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
            onClick={handleAddToCart}
            disabled={isAdding}
            whileTap={{ scale: 0.95 }}
          >
            {isAdding ? "Adding..." : (
              <>
                <ShoppingBag size={16} />
                Add to Cart
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
