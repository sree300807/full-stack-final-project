import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import { FinanceProvider } from './context/FinanceContext';
import './styles/globals.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <FinanceProvider>
          <App />
        </FinanceProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
