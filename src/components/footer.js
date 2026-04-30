/**
 * Footer Component
 */

import { t } from '../i18n.js';

export function renderFooter() {
  const footer = document.getElementById('app-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer" style="position: relative;">
      <div class="footer-left">
        ${t('footer.text')}
      </div>
      <div class="footer-center" style="position: absolute; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-tertiary); text-align: center;">
        <a href="https://github.com/caiomtls" target="_blank" rel="noopener" class="footer-link">Criado por Caio Matheus Leite Silva</a>
      </div>
      <div class="footer-links">
        <a href="https://github.com/caiomtls/data_color_toolkit#readme" target="_blank" rel="noopener" class="footer-link">${t('footer.docs')}</a>
        <a href="https://github.com/caiomtls/data_color_toolkit/blob/main/CHANGELOG.md" target="_blank" rel="noopener" class="footer-link">${t('footer.changelog')}</a>
        <a href="https://github.com/caiomtls/data_color_toolkit/blob/main/LICENSE" target="_blank" rel="noopener" class="footer-link">${t('footer.license')}</a>
      </div>
    </div>
  `;
}
