import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('luxe-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser = {
      id: 1,
      email,
      name: email.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=4ecdc4&color=fff`
    };
    
    setUser(mockUser);
    localStorage.setItem('luxe-user', JSON.stringify(mockUser));
    // persist a simple user id for remote cart sync
    try { localStorage.setItem('luxe-user-id', String(mockUser.id)); } catch (e) {}
    toast.success(`Welcome back, ${mockUser.name}!`);
    
    return mockUser;
  };

  const register = async (name, email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser = {
      id: Date.now(),
      email,
      name,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=ff6b6b&color=fff`
    };
    
    setUser(newUser);
    localStorage.setItem('luxe-user', JSON.stringify(newUser));
    try { localStorage.setItem('luxe-user-id', String(newUser.id)); } catch (e) {}
    toast.success(`Welcome to LuxeCart, ${name}!`);
    
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxe-user');
    try { localStorage.removeItem('luxe-user-id'); } catch (e) {}
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