import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/Shared/ErrorBoundary';
import reportWebVitals from './ReportWebVitals';

console.log('Index.js loaded - React app starting...');

const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

const root = ReactDOM.createRoot(rootElement);
console.log('React root created');

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('React app rendered');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
