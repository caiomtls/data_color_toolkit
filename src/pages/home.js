/**
 * Home Page
 */

import { t } from '../i18n.js';
import { renderFooter } from '../components/footer.js';

export function renderHome(container) {
  container.innerHTML = `
    <div class="home">
      <div class="home-hero">
        <h1>${t('home.title')} <span class="accent">${t('home.titleAccent')}</span></h1>
        <p>${t('home.subtitle')}</p>
      </div>

      <div class="home-cards">
        <a href="#/library" class="home-card" id="card-library">
          <div class="home-card-icon">
            <span class="material-icons-outlined">view_quilt</span>
          </div>
          <h3>${t('home.library')}</h3>
          <p>${t('home.libraryDesc')}</p>
          <div class="home-card-action">
            ${t('home.libraryAction')}
            <span class="material-icons-outlined">arrow_forward</span>
          </div>
        </a>

        <a href="#/color-testing" class="home-card" id="card-testing">
          <div class="home-card-icon">
            <span class="material-icons-outlined">science</span>
          </div>
          <h3>${t('home.colorTesting')}</h3>
          <p>${t('home.colorTestingDesc')}</p>
          <div class="home-card-action">
            ${t('home.colorTestingAction')}
            <span class="material-icons-outlined">arrow_forward</span>
          </div>
        </a>

        <a href="#/color-testing?tool=export" class="home-card" id="card-export">
          <div class="home-card-icon">
            <span class="material-icons-outlined">code</span>
          </div>
          <h3>${t('home.export')}</h3>
          <p>${t('home.exportDesc')}</p>
          <div class="home-card-action">
            ${t('home.exportAction')}
            <span class="material-icons-outlined">arrow_forward</span>
          </div>
        </a>
      </div>
    </div>
  `;

  renderFooter();
}
