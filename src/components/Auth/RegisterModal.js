import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  if (!isOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(name, email, password);
      try { localStorage.setItem('luxe-user-id', String(user.id)); } catch (e) {}
      onClose && onClose();
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal register-modal">
      <div className="modal-inner">
        <h3>Create account</h3>
        <form onSubmit={submit} className="auth-form">
          <input placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} required />
          <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
          <div className="auth-actions">
            <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
            <button type="button" className="btn" onClick={() => { onClose && onClose(); onSwitchToLogin && onSwitchToLogin(); }}>Back to login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
