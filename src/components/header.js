/**
 * Header Component
 */

import { t, getLang, setLang, getAvailableLanguages } from '../i18n.js';

export function renderHeader() {
  const header = document.getElementById('app-header');
  if (!header) return;

  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const lang = getLang();
  const langs = getAvailableLanguages();

  header.innerHTML = `
    <div class="header">
      <div class="header-left">
        <a href="#/" class="header-logo" id="logo-link">
          <img src="${import.meta.env.BASE_URL}favicon.svg" alt="Data Color Toolkit" />
          Data Color <span>Toolkit</span>
        </a>
        <nav class="nav" id="main-nav">
          <a href="#/" class="nav-link" data-route="/">
            <span class="material-icons-outlined">home</span>
            ${t('nav.home')}
          </a>
          <a href="#/library" class="nav-link" data-route="/library">
            <span class="material-icons-outlined">view_quilt</span>
            ${t('nav.library')}
          </a>
          <a href="#/color-testing" class="nav-link" data-route="/color-testing">
            <span class="material-icons-outlined">science</span>
            ${t('nav.colorTesting')}
          </a>
        </nav>
      </div>
      <div class="header-right">
        <div class="lang-toggle" id="lang-toggle">
          ${langs
            .map(
              (l) =>
                `<button class="lang-btn ${l.code === lang ? 'active' : ''}" data-lang="${l.code}">${l.label}</button>`
            )
            .join('')}
        </div>
        <div class="header-divider"></div>
        <button class="theme-toggle" id="theme-toggle" data-tooltip="${theme === 'light' ? 'Dark Mode' : 'Light Mode'}">
          <span class="material-icons-outlined">${theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
        </button>
        <button class="btn-ghost btn-icon mobile-menu-btn" id="mobile-menu-btn">
          <span class="material-icons-outlined">menu</span>
        </button>
      </div>
    </div>
  `;

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dct-theme', next);
    renderHeader();
  });

  // Language toggle
  document.getElementById('lang-toggle').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;
    setLang(btn.dataset.lang);
    renderHeader();
    // Re-render current page
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  // Mobile menu
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('main-nav')?.classList.toggle('open');
  });

  // Update active state
  const hash = window.location.hash.slice(1) || '/';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const route = link.dataset.route;
    if (route === hash || (route !== '/' && hash.startsWith(route))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize theme from localStorage (default: light)
export function initTheme() {
  const saved = localStorage.getItem('dct-theme');
  document.documentElement.setAttribute('data-theme', saved || 'light');
}
