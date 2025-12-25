import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar/Navbar';
import CartSidebar from './components/Cart/CartSidebar';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/Shared/ErrorBoundary';
import './global.css';

console.log('App.js loaded');

function App() {
  console.log('App component rendering...');
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <Navbar />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <CartSidebar />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    borderRadius: '12px',
                    background: 'var(--dark)',
                    color: 'white',
                    fontFamily: 'var(--font-primary)',
                  },
                }}
              />
            </div>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
