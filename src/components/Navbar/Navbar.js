import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Package,
  Heart,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import AuthModal from "../Auth/AuthModal";
import "./navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const navigate = useNavigate();

  const menuItemRefs = useRef([]);
  const mobileItemRefs = useRef([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  // ESC close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setShowAuthModal(false);
        setShowDropdown(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container navbar-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">LuxeCart</span>
          </Link>

          {/* Desktop Links (SIMPLE ROUTES MERGED) */}
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products?category=women's%20clothing" className="nav-link">Women</Link>
            <Link to="/products?category=men's%20clothing" className="nav-link">Men</Link>
            <Link to="/products?category=electronics" className="nav-link">Electronics</Link>
            <Link to="/products?category=jewelery" className="nav-link">Jewellery</Link>
            <Link to="/cart" className="nav-link">Cart</Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>

          {/* Actions */}
          <div className="nav-actions">
            {/* Cart */}
            <button className="cart-btn" onClick={toggleCart}>
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button
                  className="user-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="user-avatar">
                    <User size={20} />
                  </div>
                  <ChevronDown size={16} className="dropdown-arrow" />
                </button>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="dropdown-user-info">
                        <div className="dropdown-user-name">Hello</div>
                        <div className="dropdown-user-email">{user.email}</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <User size={18} />
                      <span>My Profile</span>
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <Package size={18} />
                      <span>My Orders</span>
                    </Link>
                    <Link to="/wishlist" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <Heart size={18} />
                      <span>Wishlist</span>
                    </Link>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="auth-btn"
                onClick={() => {
                  setAuthInitialMode("login");
                  setShowAuthModal(true);
                }}
              >
                <User size={22} /> Login
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/category/Women" onClick={() => setIsMenuOpen(false)}>Women</Link>
            <Link to="/category/Men" onClick={() => setIsMenuOpen(false)}>Men</Link>
            <Link to="/category/Electronics" onClick={() => setIsMenuOpen(false)}>Electronics</Link>
            <Link to="/category/Jewellery" onClick={() => setIsMenuOpen(false)}>Jewellery</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link>
          </div>
        )}
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authInitialMode}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Navbar;
