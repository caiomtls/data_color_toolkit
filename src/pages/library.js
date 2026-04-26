/**
 * Library Page
 */

import { t } from '../i18n.js';
import { renderFooter } from '../components/footer.js';
import { CHART_TYPES, CATEGORIES, getSampleData, renderChart } from '../charts/chart-factory.js';
import { getState } from '../store.js';
import { navigate } from '../router.js';

let currentFilter = 'all';
let currentView = 'grid';
let searchQuery = '';

export function renderLibrary(container) {
  const state = getState();

  container.innerHTML = `
    <div class="library">
      <div class="library-header">
        <h1>${t('library.title')}</h1>
        <p>${t('library.subtitle')}</p>
      </div>

      <div class="library-toolbar">
        <div class="library-search">
          <span class="material-icons-outlined">search</span>
          <input type="text" class="input" id="library-search" placeholder="${t('library.search')}" value="${searchQuery}" />
        </div>
        <select class="select library-filter" id="library-filter">
          ${CATEGORIES.map(
            (c) => `<option value="${c.id}" ${c.id === currentFilter ? 'selected' : ''}>${t(c.labelKey)}</option>`
          ).join('')}
        </select>
        <div class="library-view-toggle">
          <button class="library-view-btn ${currentView === 'grid' ? 'active' : ''}" data-view="grid" id="view-grid">
            <span class="material-icons-outlined">grid_view</span>
          </button>
          <button class="library-view-btn ${currentView === 'list' ? 'active' : ''}" data-view="list" id="view-list">
            <span class="material-icons-outlined">view_list</span>
          </button>
        </div>
      </div>

      <div class="library-grid ${currentView === 'list' ? 'list-view' : ''}" id="library-grid">
        ${renderCards(state.colors)}
      </div>
    </div>
  `;

  renderFooter();

  // Render mini charts
  requestAnimationFrame(() => {
    renderMiniCharts(state.colors);
  });

  // Search
  document.getElementById('library-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    updateGrid(state.colors);
  });

  // Filter
  document.getElementById('library-filter').addEventListener('change', (e) => {
    currentFilter = e.target.value;
    updateGrid(state.colors);
  });

  // View toggle
  document.querySelectorAll('.library-view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view;
      document.querySelectorAll('.library-view-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('library-grid');
      grid.classList.toggle('list-view', currentView === 'list');
    });
  });

  // Use Template buttons
  document.querySelectorAll('.use-template-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const chartId = btn.dataset.chart;
      navigate(`/color-testing?chart=${chartId}`);
    });
  });

  // Card clicks
  document.querySelectorAll('.chart-card').forEach((card) => {
    card.addEventListener('click', () => {
      const chartId = card.dataset.chart;
      navigate(`/color-testing?chart=${chartId}`);
    });
  });
}

function renderCards(colors) {
  const filtered = CHART_TYPES.filter((ct) => {
    const matchCategory = currentFilter === 'all' || ct.category === currentFilter;
    const matchSearch = !searchQuery || t(ct.titleKey).toLowerCase().includes(searchQuery);
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    return `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="material-icons-outlined">search_off</span>
        <p>No charts match your criteria.</p>
      </div>
    `;
  }

  return filtered
    .map(
      (ct) => `
      <div class="chart-card card-interactive" data-chart="${ct.id}" id="chart-card-${ct.id}">
        <div class="chart-card-preview">
          <canvas id="mini-chart-${ct.id}"></canvas>
        </div>
        <div class="chart-card-body">
          <div class="chart-card-title">${t(ct.titleKey)}</div>
          <span class="tag">${t(CATEGORIES.find((c) => c.id === ct.category)?.labelKey || '')}</span>
          <p class="chart-card-desc">${t(ct.descKey)}</p>
        </div>
        <div class="chart-card-footer">
          <button class="btn btn-primary btn-sm use-template-btn" data-chart="${ct.id}">
            ${t('library.useTemplate')}
          </button>
        </div>
      </div>
    `
    )
    .join('');
}

function renderMiniCharts(colors) {
  CHART_TYPES.forEach((ct) => {
    const canvas = document.getElementById(`mini-chart-${ct.id}`);
    if (!canvas) return;
    const data = getSampleData(ct.id, 5, 3);
    renderChart(canvas, ct.id, data, colors, { animate: false });
  });
}

function updateGrid(colors) {
  const grid = document.getElementById('library-grid');
  if (!grid) return;
  grid.innerHTML = renderCards(colors);
  requestAnimationFrame(() => renderMiniCharts(colors));

  // Re-bind events
  document.querySelectorAll('.use-template-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(`/color-testing?chart=${btn.dataset.chart}`);
    });
  });
  document.querySelectorAll('.chart-card').forEach((card) => {
    card.addEventListener('click', () => {
      navigate(`/color-testing?chart=${card.dataset.chart}`);
    });
  });
}
