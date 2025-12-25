import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Truck, Clock, X, Mail } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import { useProducts } from '../hooks/useProducts';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import './Home.css';

const Home = () => {
  const { products, loading, error } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts(products.slice(0, 4));
      setTrendingProducts(products.slice(4, 8));
    }
  }, [products]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing! We'll send updates to ${email}`);
      setEmail('');
      setShowNewsletterModal(false);
    }
  };

  console.log('Home render - loading:', loading, 'products:', products.length, 'error:', error);

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="error-state" style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Error loading products</h2>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
                <div className="hero-copy">
                  <h1 className="hero-title">
                    Discover Your <span className="gradient-text">Perfect Style</span>
                  </h1>
                  <p className="hero-subtitle">
                    Explore our curated collection of premium products with 
                    exclusive deals and fast delivery.
                  </p>
                  <div className="hero-buttons">
                    <Link to="/products" className="btn-primary">
                      Shop Now <ArrowRight size={20} />
                    </Link>
                    <Link to="/products?category=electronics" className="btn-outline">
                      View Electronics
                    </Link>
                  </div>
                </div>

                <div className="hero-media" aria-hidden>
                  <div className="hero-card">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
                      alt="Hero product showcase"
                    />
                  </div>
                </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">
                <Truck size={32} />
              </div>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h3>24/7 Support</h3>
              <p>Always here to help</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Secure Payment</h3>
              <p>100% secure & encrypted</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>30-Day Returns</h3>
              <p>Hassle-free returns</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <h2>Trending Now</h2>
            <Link to="/products" className="view-all">
              See More <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="products-grid">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <motion.div 
            className="banner-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Join Our Community</h2>
            <p>Get exclusive deals and early access to new arrivals</p>
            <button 
              className="btn-secondary" 
              onClick={() => setShowNewsletterModal(true)}
            >
              Sign Up Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Modal */}
      {showNewsletterModal && (
        <div className="modal-overlay" onClick={() => setShowNewsletterModal(false)}>
          <motion.div 
            className="newsletter-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <button 
              className="modal-close" 
              onClick={() => setShowNewsletterModal(false)}
            >
              <X size={24} />
            </button>
            
            <div className="modal-icon">
              <Mail size={48} />
            </div>
            
            <h2>Join Our Newsletter</h2>
            <p>Get exclusive deals and early access to new arrivals</p>
            
            <form onSubmit={handleNewsletterSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                />
              </div>
              <button type="submit" className="btn primary btn-full">
                Subscribe Now
              </button>
            </form>
            
            <p className="modal-note">
              By subscribing, you agree to receive marketing emails from LuxeCart.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;