import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      try { localStorage.setItem('luxe-user-id', String(user.id)); } catch (e) {}
      onClose && onClose();
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal login-modal" role="dialog" aria-modal="true" aria-label="Login dialog">
      <div className="modal-inner">
        <h2>Welcome to Luxe Cart</h2>
        <p className="modal-subtitle">Sign in to access your cart, orders, and personalized shopping experience.</p>

        <form onSubmit={submit} className="auth-form">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />

          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} required />

          <div className="auth-actions">
            <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          </div>
        </form>

        <div className="auth-secondary">
          <span>Dont have an account? </span>
          <button className="link" onClick={() => { onClose && onClose(); onSwitchToRegister && onSwitchToRegister(); }}>
            Create one
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
