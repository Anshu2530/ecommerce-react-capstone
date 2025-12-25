import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import './auth.css';

const AuthModal = ({ isOpen, initialMode = 'login', onClose }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!isOpen) return;
    // remember focus
    previouslyFocused.current = document.activeElement;
    // lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // focus first input after open
    const timer = setTimeout(() => {
      const el = dialogRef.current && dialogRef.current.querySelector('input, button, [tabindex]');
      if (el && typeof el.focus === 'function') el.focus();
    }, 50);

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
      if (e.key === 'Tab') {
        // focus trap
        const focusable = dialogRef.current.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused.current && previouslyFocused.current.focus) previouslyFocused.current.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        try { localStorage.setItem('luxe-user-id', String(user.id)); } catch (err) {}
        onClose && onClose();
      } else {
        const user = await register(form.name || form.email.split('@')[0], form.email, form.password);
        try { localStorage.setItem('luxe-user-id', String(user.id)); } catch (err) {}
        onClose && onClose();
      }
    } catch (err) {
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose && onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onBackdropClick}>
      <div className="modal auth-modal" role="dialog" aria-modal="true">
        <div className="modal-inner" ref={dialogRef}>
          {mode === 'login' ? (
            <>
              <h2>Welcome to Luxe Cart</h2>
              <p className="modal-subtitle">Sign in to access your cart, orders, and personalized shopping experience.</p>
              <form onSubmit={submit} className="auth-form">
                <label htmlFor="auth-email">Email</label>
                <input id="auth-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />

                <label htmlFor="auth-password">Password</label>
                <input id="auth-password" name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />

                <div className="auth-actions">
                  <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                </div>
              </form>
              <div className="auth-secondary">
                <span>Don't have an account? </span>
                <button className="link" onClick={() => setMode('register')}>Create one</button>
              </div>
            </>
          ) : (
            <>
              <h2>Create your account</h2>
              <p className="modal-subtitle">Create an account to save your cart and get personalized recommendations.</p>
              <form onSubmit={submit} className="auth-form">
                <label htmlFor="auth-name">Full name</label>
                <input id="auth-name" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />

                <label htmlFor="auth-email-2">Email</label>
                <input id="auth-email-2" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />

                <label htmlFor="auth-password-2">Password</label>
                <input id="auth-password-2" name="password" type="password" placeholder="Choose a password" value={form.password} onChange={handleChange} required />

                <div className="auth-actions">
                  <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
                </div>
              </form>
              <div className="auth-secondary">
                <span>Already have an account? </span>
                <button className="link" onClick={() => setMode('login')}>Sign in</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
