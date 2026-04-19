// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StatsProvider } from './context/StatsContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <StatsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StatsProvider>
    </AuthProvider>
  </StrictMode>
);