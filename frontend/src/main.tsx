// Browser entry point that mounts the application.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';

const container = document.getElementById('root');

if (container === null) {
  throw new Error('Root container is missing from index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
