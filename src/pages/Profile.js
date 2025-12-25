import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ordersService } from '../services/OrdersService';
import { wishlistService } from '../services/WishlistService';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Package, Heart, ShoppingBag, LogOut, ChevronRight, CheckCircle, XCircle, Clock, ShoppingCart } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    total: 0, 
    delivered: 0, 
    processing: 0,
    cancelled: 0, 
    pending: 0,
    wishlist: 0 
  });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!user) return;
    
    // Load user details
    const savedProfile = JSON.parse(localStorage.getItem(`profile_${user.email}`)) || {};
    setFormData({
      name: user.name || '',
      phone: savedProfile.phone || '',
      address: savedProfile.address || ''
    });

    // Load stats
    const uId = user.id || localStorage.getItem('luxe-user-id');
    const orders = ordersService.getOrders(uId) || [];
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const processing = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length;
    const wishlist = wishlistService.getWishlist(uId).length;
    setStats({ total, delivered, processing, cancelled, pending, wishlist });
  }, [user]);

  const handleSave = () => {
    localStorage.setItem(`profile_${user.email}`, JSON.stringify(formData));
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="page profile-page">
        <div className="container">
          <div className="auth-required">
            <User size={64} />
            <h2>Please Login</h2>
            <p>You need to login to view your profile</p>
            <button className="btn primary" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page profile-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-container"
        >
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-header">
              <div className="profile-avatar-large">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="avatar-fallback-large">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h2>{formData.name || user.name}</h2>
              <p className="user-email">{user.email}</p>
            </div>

            <nav className="profile-nav">
              <Link to="/profile" className="nav-item active">
                <User size={20} />
                <span>My Profile</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/orders" className="nav-item">
                <Package size={20} />
                <span>My Orders</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/wishlist" className="nav-item">
                <Heart size={20} />
                <span>Wishlist</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/cart" className="nav-item">
                <ShoppingBag size={20} />
                <span>Shopping Cart</span>
                <ChevronRight size={16} />
              </Link>
            </nav>

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            {/* Stats Cards */}
            <div className="stats-grid">
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon orders">
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon delivered">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.delivered}</div>
                  <div className="stat-label">Delivered</div>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon processing">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.processing}</div>
                  <div className="stat-label">Processing</div>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon pending">
                  <ShoppingCart size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.pending}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon cancelled">
                  <XCircle size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.cancelled}</div>
                  <div className="stat-label">Cancelled</div>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon wishlist">
                  <Heart size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.wishlist}</div>
                  <div className="stat-label">Wishlist Items</div>
                </div>
              </motion.div>
            </div>

            {/* Personal Information */}
            <div className="info-card">
              <div className="card-header">
                <h3>Personal Information</h3>
                {!editing ? (
                  <button className="btn-edit" onClick={() => setEditing(true)}>
                    <Edit2 size={18} />
                    Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleSave}>Save</button>
                    <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
                  </div>
                )}
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>
                    <User size={18} />
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input"
                    />
                  ) : (
                    <p>{formData.name || user.name}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>
                    <Mail size={18} />
                    Email Address
                  </label>
                  <p>{user.email}</p>
                </div>

                <div className="info-item">
                  <label>
                    <Phone size={18} />
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="input"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p>{formData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="info-item full-width">
                  <label>
                    <MapPin size={18} />
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="input"
                      placeholder="Enter your address"
                      rows={3}
                    />
                  ) : (
                    <p>{formData.address || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
