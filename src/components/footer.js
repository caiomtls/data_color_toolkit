/**
 * Footer Component
 */

import { t } from '../i18n.js';

export function renderFooter() {
  const footer = document.getElementById('app-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer">
      <div class="footer-left">
        ${t('footer.text')}
      </div>
      <div class="footer-links">
        <a href="https://github.com" target="_blank" rel="noopener" class="footer-link">${t('footer.github')}</a>
        <a href="#" class="footer-link">${t('footer.docs')}</a>
        <a href="#" class="footer-link">${t('footer.changelog')}</a>
        <a href="#" class="footer-link">${t('footer.license')}</a>
      </div>
    </div>
  `;
}
