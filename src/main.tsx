import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import { Buffer } from 'buffer';

// Polyfill Buffer for the browser environment
if (!window.Buffer) {
  window.Buffer = Buffer;
}