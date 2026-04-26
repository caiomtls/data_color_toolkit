/**
 * Data Color Toolkit — Main Entry Point
 */

// Styles
import './styles/index.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/library.css';
import './styles/testing.css';

// Core modules
import { registerRoutes, startRouter } from './router.js';
import { renderHeader, initTheme } from './components/header.js';
import { renderHome } from './pages/home.js';
import { renderLibrary } from './pages/library.js';
import { renderTesting } from './pages/testing.js';

// Initialize theme
initTheme();

// Register routes
registerRoutes({
  '/': (container) => {
    renderHeader();
    renderHome(container);
  },
  '/library': (container) => {
    renderHeader();
    renderLibrary(container);
  },
  '/color-testing': (container, params) => {
    renderHeader();
    renderTesting(container, params);
  },
  '*': (container) => {
    renderHeader();
    container.innerHTML = `
      <div class="home" style="text-align:center;padding:120px 24px;">
        <h1>404</h1>
        <p style="margin-top:8px;">Page not found.</p>
        <a href="#/" class="btn btn-primary" style="margin-top:24px;">Go Home</a>
      </div>
    `;
  },
});

// Render header and start router
renderHeader();
startRouter();
