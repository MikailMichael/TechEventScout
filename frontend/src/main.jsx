import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position='top-center' reverseOrder={false} />
    </BrowserRouter>
  </StrictMode>,
);

/*
  toastOptions={{
    success: {
      style: { background: '#22c55e', color: 'white' },
    },
    error: {
      style: { background: '#ef4444', color: 'white' },
    },
  }}
*/