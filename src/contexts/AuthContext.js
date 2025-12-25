import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔥 PRODUCTION-SAFE AUTH INIT
    try {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('luxe-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.error('Auth init error:', error);
      setUser(null);
    } finally {
      setIsLoading(false); // 🚨 THIS FIXES BLANK SCREEN
    }
  }, []);

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const name = email.split('@')[0];
    const mockUser = {
      id: 1,
      email,
      name,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=4ecdc4&color=fff`
    };

    setUser(mockUser);
    localStorage.setItem('luxe-user', JSON.stringify(mockUser));
    localStorage.setItem('luxe-user-id', String(mockUser.id));

    toast.success(`Welcome back, ${mockUser.name}!`);
    return mockUser;
  };

  const register = async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newUser = {
      id: Date.now(),
      email,
      name,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=ff6b6b&color=fff`
    };

    setUser(newUser);
    localStorage.setItem('luxe-user', JSON.stringify(newUser));
    localStorage.setItem('luxe-user-id', String(newUser.id));

    toast.success(`Welcome to LuxeCart, ${name}!`);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxe-user');
    localStorage.removeItem('luxe-user-id');
    toast('See you next time! 👋');
  };

  const updateProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('luxe-user', JSON.stringify(updated));
      return updated;
    });
    toast.success('Profile updated!');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
