/**
 * Color Testing Page — Core Tool
 */

import { t } from '../i18n.js';
import { renderFooter } from '../components/footer.js';
import { getState, setState, addColor, removeColor, updateColor, updateColorName, reorderColors, setColors } from '../store.js';
import { CHART_TYPES, ORIENTATION_SUPPORTED, CHART_CONTROLS, getSampleData, renderChart } from '../charts/chart-factory.js';
import { hexToRgb, hexToHsl, formatRgb, formatHsl, getContrastRatio, getWcagGrade, getTextColor, analyzeHarmony, autoAdjustColors } from '../utils/color.js';
import { toPythonDict, toPythonList, toJson, toJsonArray, toCssVariables, toHexList } from '../utils/export.js';
import { copyToClipboard } from '../utils/export.js';

import { showToast } from '../components/toast.js';
import { subscribe } from '../store.js';

let currentChart = null;
let unsubscribe = null;

// ─── Global Tooltip Singleton ─────────────────────────────────────────────────
// Uses event delegation so it works for any [data-tooltip] element,
// regardless of how many times the toolbar re-renders. Never duplicates.
(function initGlobalTooltip() {
  let tip = null;
  let hideTimer = null;

  function getTip() {
    if (!tip) {
      tip = document.createElement('div');
      tip.style.cssText = [
        'position:fixed', 'z-index:9999',
        'background:#1a1a2e', 'color:#f0f0f0',
        'border-radius:6px', 'padding:5px 10px',
        'font-size:11px', 'font-weight:500', 'white-space:nowrap',
        'pointer-events:none', 'letter-spacing:0.01em',
        'box-shadow:0 4px 14px rgba(0,0,0,0.25)',
        'opacity:0', 'transition:opacity 0.15s ease',
        'display:none',
      ].join(';');
      document.body.appendChild(tip);
    }
    return tip;
  }

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-tooltip]');
    if (!el) return;
    clearTimeout(hideTimer);
    const t = getTip();
    t.textContent = el.dataset.tooltip;
    t.style.display = 'block';
    t.style.opacity = '0';
    const rect = el.getBoundingClientRect();
    const w = t.offsetWidth;
    const left = Math.max(8, Math.min(window.innerWidth - w - 8, rect.left + rect.width / 2 - w / 2));
    t.style.left = `${left}px`;
    t.style.top = `${rect.bottom + 7}px`;
    requestAnimationFrame(() => { t.style.opacity = '1'; });
  });

  document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('[data-tooltip]');
    if (!el) return;
    hideTimer = setTimeout(() => {
      if (tip) { tip.style.opacity = '0'; setTimeout(() => { if (tip) tip.style.display = 'none'; }, 150); }
    }, 80);
  });
})();


const PALETTES = {
  categorical: [
    { id: 'default', name: 'Default', colors: ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'] },
    { id: 'tailwind', name: 'Tailwind', colors: ['#64748b', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'] },
    { id: 'material', name: 'Material Design', colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D00', '#46BFBD', '#9C27B0', '#00BCD4'] },
    { id: 'tableau10', name: 'Tableau 10', colors: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'] },
    { id: 'd3cat10', name: 'D3 Category 10', colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'] },
    { id: 'pastel', name: 'Pastel', colors: ['#a8dadc', '#f4a261', '#e9c46a', '#2a9d8f', '#e76f51', '#457b9d', '#f1faee', '#b7b7a4'] },
    { id: 'bold', name: 'Bold', colors: ['#e63946', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#ff5722', '#607d8b'] },
    { id: 'accessible', name: 'Accessible (Wong)', colors: ['#000000', '#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7'] }
  ],
  sequential: [
    { id: 'viridis', name: 'Viridis', colors: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'] },
    { id: 'plasma', name: 'Plasma', colors: ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdcf20', '#f0f921'] },
    { id: 'magma', name: 'Magma', colors: ['#000004', '#180f3d', '#440f76', '#721f81', '#9f2f7f', '#cd4071', '#f1605d', '#fd9668', '#feca8d', '#fcfdbf'] },
    { id: 'inferno', name: 'Inferno', colors: ['#000004', '#1b0c41', '#4a0c4e', '#781c6d', '#a52c60', '#cf4446', '#ed6925', '#fb9b06', '#f7d13d', '#fcffa4'] },
    { id: 'blues', name: 'Blues', colors: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'] },
    { id: 'greens', name: 'Greens', colors: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'] },
    { id: 'purples', name: 'Purples', colors: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8'] },
    { id: 'oranges', name: 'Oranges', colors: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412'] },
    { id: 'reds', name: 'Reds', colors: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239'] }
  ],
  diverging: [
    { id: 'blue-red', name: 'Blue → Red', colors: ['#1e40af', '#3b82f6', '#93c5fd', '#f1f5f9', '#fca5a5', '#ef4444', '#b91c1c'] },
    { id: 'green-purple', name: 'Green → Purple', colors: ['#166534', '#22c55e', '#86efac', '#f1f5f9', '#d8b4fe', '#a855f7', '#6b21a8'] },
    { id: 'rdbu', name: 'RdBu (ColorBrewer)', colors: ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'] },
    { id: 'piyg', name: 'PiYG (ColorBrewer)', colors: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'] },
    { id: 'spectral', name: 'Spectral', colors: ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'] }
  ]
};

export function renderTesting(container, params = {}) {
  // Cleanup previous subscription
  if (unsubscribe) unsubscribe();

  const state = getState();

  // Apply params
  if (params.chart) {
    setState({ selectedChart: params.chart });
  }
  if (params.tool) {
    setState({ activeTool: params.tool });
  }

  const updatedState = getState();

  container.innerHTML = `
    <div class="testing">
      ${renderSidebar(updatedState)}
      ${renderMainContent(updatedState)}
    </div>
  `;

  // Render footer
  renderFooter();

  // Initialize
  requestAnimationFrame(() => {
    renderPreview(updatedState);
    bindSidebarEvents();
    bindToolbarEvents();
  });

  // Subscribe to state changes
  unsubscribe = subscribe((newState) => {
    // Update color list
    updateColorList(newState);
    // Re-render preview
    renderPreview(newState);
    // Keep toolbar title in sync with selected chart
    const titleEl = document.querySelector('.testing-toolbar-left h3');
    if (titleEl) {
      titleEl.textContent = t(CHART_TYPES.find((c) => c.id === newState.selectedChart)?.titleKey || 'chart.groupedBar.title');
    }
    // Update tool panel if active
    const activeTool = newState.activeTool;
    if (activeTool !== 'preview') {
      updateToolPanel(newState);
    }
  });
}

function renderSidebar(state) {
  return `
    <aside class="testing-sidebar" id="testing-sidebar">
      <!-- Graph Selection -->
      <div class="sidebar-section">
        <div class="sidebar-section-title">
          <span class="material-icons-outlined">bar_chart</span>
          ${t('testing.graphSelection')}
        </div>
        <div class="graph-select-row">
          <select class="select" id="chart-type-select">
            ${CHART_TYPES.map(
              (ct) => `<option value="${ct.id}" ${ct.id === state.selectedChart ? 'selected' : ''}>${t(ct.titleKey)}</option>`
            ).join('')}
          </select>
        </div>
        <div class="graph-select-row">
          ${ORIENTATION_SUPPORTED.has(state.selectedChart) ? `
          <div class="orientation-toggle" id="orientation-toggle">
            <button class="orientation-btn ${state.orientation === 'vertical' ? 'active' : ''}" data-orient="vertical" data-tooltip="Vertical">
              <span class="material-icons-outlined">align_vertical_bottom</span>
            </button>
            <button class="orientation-btn ${state.orientation === 'horizontal' ? 'active' : ''}" data-orient="horizontal" data-tooltip="Horizontal">
              <span class="material-icons-outlined">align_horizontal_left</span>
            </button>
          </div>` : ''}
        </div>
      </div>

      <hr class="divider" />

      <!-- Graph Data -->
      <div class="sidebar-section">
        <div class="sidebar-section-title">
          <span class="material-icons-outlined">table_chart</span>
          ${t('testing.graphData')}
        </div>
        <div id="data-controls-container">
          ${renderDataControls(state.selectedChart, state)}
        </div>
      </div>

      <hr class="divider" />

      <!-- Color Sequence -->
      <div class="sidebar-section">
        <div class="sidebar-section-title">
          <span class="material-icons-outlined">palette</span>
          ${t('testing.colorSequence')}
        </div>
        <div style="margin-bottom:8px;">
          <button id="auto-adjust-btn" class="btn btn-secondary" style="width:100%;justify-content:center;gap:6px;font-size:12px;padding:7px 12px;">
            <span class="material-icons-outlined" style="font-size:15px;">auto_fix_high</span>
            ${t('autoAdjust.button')}
          </button>
        </div>
        <div style="margin-bottom: 12px; display: flex; gap: 8px;">
          <select id="palette-select" class="input" style="flex: 1; font-size: 12px; padding: 4px 8px;">
            <option value="" disabled selected>${t('palette.selectPlaceholder')}</option>
            <optgroup label="Categorical">
              ${PALETTES.categorical.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </optgroup>
            <optgroup label="Sequential">
              ${PALETTES.sequential.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </optgroup>
            <optgroup label="Diverging">
              ${PALETTES.diverging.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </optgroup>
          </select>
          <button id="apply-palette-btn" class="btn btn-outline" style="padding: 4px 12px; font-size: 12px;">${t('palette.apply')}</button>
        </div>
        <div class="color-list" id="color-list">
          ${renderColorItems(state)}
        </div>
        <button class="color-add-btn" id="add-color-btn">
          <span class="material-icons-outlined" style="font-size:16px">add</span>
          ${t('testing.addColor')}
        </button>
      </div>

      <hr class="divider" />

      <!-- Tools Navigation -->
      <div class="sidebar-section">
        <div class="sidebar-section-title">
          <span class="material-icons-outlined">build</span>
          ${t('testing.tools')}
        </div>
        <div class="tools-nav" id="tools-nav">
          <button class="tools-nav-item ${state.activeTool === 'preview' ? 'active' : ''}" data-tool="preview">
            <span class="material-icons-outlined">visibility</span>
            Preview
          </button>
          <button class="tools-nav-item ${state.activeTool === 'overview' ? 'active' : ''}" data-tool="overview">
            <span class="material-icons-outlined">grid_view</span>
            ${t('testing.overview')}
          </button>
          <button class="tools-nav-item ${state.activeTool === 'matrix' ? 'active' : ''}" data-tool="matrix">
            <span class="material-icons-outlined">apps</span>
            ${t('testing.swatchMatrix')}
          </button>
          <button class="tools-nav-item ${state.activeTool === 'contrast' ? 'active' : ''}" data-tool="contrast">
            <span class="material-icons-outlined">contrast</span>
            ${t('testing.contrastChecker')}
          </button>
          <button class="tools-nav-item ${state.activeTool === 'export' ? 'active' : ''}" data-tool="export">
            <span class="material-icons-outlined">ios_share</span>
            ${t('testing.exportData')}
          </button>
        </div>
      </div>
    </aside>
  `;
}

function renderDataControls(chartType, state) {
  const controls = CHART_CONTROLS[chartType];
  if (!controls) {
    return `<div style="font-size:12px;color:var(--text-secondary);padding:8px 0;">
      ${t('testing.dataGeneratedInternally') || 'Data is generated internally.'}
    </div>`;
  }
  let html = '';
  if (controls.cols) {
    const [min, max] = controls.cols;
    const val = Math.min(max, Math.max(min, state.columns));
    const label = controls.colsLabel ? t(controls.colsLabel) : t('testing.columns');
    html += `
      <div class="data-control-row">
        <span class="label" style="width:60px;">${label}</span>
        <input type="range" class="range" id="columns-range" min="${min}" max="${max}" value="${val}" />
        <input type="number" class="input" id="columns-input" min="${min}" max="${max}" value="${val}" style="width:50px;" />
      </div>
    `;
  }
  if (controls.series) {
    const [min, max] = controls.series;
    const val = Math.min(max, Math.max(min, state.series));
    const label = controls.seriesLabel ? t(controls.seriesLabel) : t('testing.series');
    html += `
      <div class="data-control-row">
        <span class="label" style="width:60px;">${label}</span>
        <input type="range" class="range" id="series-range" min="${min}" max="${max}" value="${val}" />
        <input type="number" class="input" id="series-input" min="${min}" max="${max}" value="${val}" style="width:50px;" />
      </div>
    `;
  }
  return html;
}

function renderColorItems(state) {
  const names = state.colorNames || state.colors.map((_, i) => `Series ${i + 1}`);

  // Two colors are "too similar" for data-vis only when BOTH:
  //   • their hue angle distance is < 20° (same color family), AND
  //   • their lightness is within 12% (can't be told apart by brightness either).
  // WCAG contrast ratio is intentionally NOT used here — it measures text-on-bg
  // readability, not perceptual distinctiveness between two palette swatches.
  function hueDist(a, b) {
    const d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  }

  const lowSimilarIndices = new Set();
  state.colors.forEach((c1, i) => {
    state.colors.forEach((c2, j) => {
      if (i >= j) return;
      const h1 = hexToHsl(c1), h2 = hexToHsl(c2);
      const tooClose = hueDist(h1.h, h2.h) < 20 && Math.abs(h1.l - h2.l) < 12;
      if (tooClose) {
        lowSimilarIndices.add(i);
        lowSimilarIndices.add(j);
      }
    });
  });

  return state.colors
    .map(
      (color, i) => `
      <div class="color-item" draggable="true" data-index="${i}" id="color-item-${i}">
        <span class="color-item-drag">
          <span class="material-icons-outlined">drag_indicator</span>
        </span>
        <div class="color-item-swatch" style="background:${color};">
          <input type="color" value="${color}" data-index="${i}" class="color-picker" />
        </div>
        <input type="text" class="color-name-input input" data-index="${i}" value="${escapeAttr(names[i])}" style="flex:1; margin:0 8px; font-size:12px; padding:4px 6px; height:auto; min-width:0;" />
        <span class="color-item-hex" style="font-size:11px; width:45px; text-align:right;">${color.toUpperCase()}</span>
        ${lowSimilarIndices.has(i) ? `<span class="material-icons-outlined" style="font-size:14px;color:var(--warning);" title="${t('testing.lowContrastWarning')}">warning</span>` : ''}
        <button class="color-item-remove" data-index="${i}">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>
    `
    )
    .join('');
}


function renderMainContent(state) {
  const activeTool = state.activeTool;

  if (activeTool === 'preview') {
    return `
      <div class="testing-main">
        <div class="testing-toolbar">
          <div class="testing-toolbar-left">
            <h3 style="font-size:14px;">${t(CHART_TYPES.find((c) => c.id === state.selectedChart)?.titleKey || 'chart.groupedBar.title')}</h3>
          </div>
          <div class="testing-toolbar-right">
            <!-- Colorblind simulator -->
            <div class="colorblind-group">
              <span class="colorblind-label">${t('testing.visionLabel')}</span>
              <div class="colorblind-toggle" id="colorblind-toggle">
                <button class="colorblind-btn active" data-filter="none" data-tooltip="${t('testing.cbNormal')}">
                  <span class="material-icons-outlined">visibility</span>
                </button>
                <button class="colorblind-btn" data-filter="protanopia" data-tooltip="${t('testing.cbProtanopia')}">
                  <span class="cb-label">P</span>
                </button>
                <button class="colorblind-btn" data-filter="deuteranopia" data-tooltip="${t('testing.cbDeuteranopia')}">
                  <span class="cb-label">D</span>
                </button>
                <button class="colorblind-btn" data-filter="tritanopia" data-tooltip="${t('testing.cbTritanopia')}">
                  <span class="cb-label">T</span>
                </button>
                <button class="colorblind-btn" data-filter="achromatopsia" data-tooltip="${t('testing.cbAchromatopsia')}">
                  <span class="material-icons-outlined" style="font-size:14px;">gradient</span>
                </button>
              </div>
            </div>
            <button class="btn btn-ghost btn-icon" id="fullscreen-btn" data-tooltip="${t('testing.fullscreen')}">
              <span class="material-icons-outlined">fullscreen</span>
            </button>
          </div>
        </div>
        <div class="testing-preview" id="testing-preview">
          ${renderSinglePreview()}
        </div>
      </div>
    `;
  }

  return `
    <div class="testing-main">
      <div class="testing-toolbar">
        <div class="testing-toolbar-left">
          <h3 style="font-size:14px;">${getToolTitle(activeTool)}</h3>
        </div>
      </div>
      <div class="tool-panel" id="tool-panel">
        ${renderToolContent(activeTool, state)}
      </div>
    </div>
  `;
}

function renderSinglePreview() {
  return `
    <div class="preview-container" id="preview-container">
      <canvas id="main-chart"></canvas>
    </div>
  `;
}


function getToolTitle(tool) {
  const titles = {
    overview: t('testing.overview'),
    matrix: t('testing.swatchMatrix'),
    contrast: t('testing.contrastChecker'),
    export: t('testing.exportData'),
  };
  return titles[tool] || 'Tool';
}

function renderToolContent(tool, state) {
  switch (tool) {
    case 'overview':
      return renderOverview(state.colors);
    case 'matrix':
      return renderSwatchMatrix(state.colors);
    case 'contrast':
      return renderContrastChecker(state.colors);
    case 'export':
      return renderExport(state.colors);
    default:
      return '';
  }
}

// === Overview Panel ===
function renderOverview(colors) {
  const harmony = analyzeHarmony(colors);
  return `
    <div style="max-width:900px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <span class="tag tag-accent">Harmony: ${harmony}</span>
        <span class="tag">${colors.length} colors</span>
      </div>
      <div class="overview-grid">
        ${colors
          .map(
            (color) => `
          <div class="overview-swatch">
            <div class="overview-swatch-color" style="background:${color};"></div>
            <div class="overview-swatch-info">
              <div class="overview-swatch-hex">${color.toUpperCase()}</div>
              <div class="overview-swatch-rgb">${formatRgb(color)}</div>
              <div class="overview-swatch-hsl">${formatHsl(color)}</div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

// === Swatch Matrix Panel ===
function renderSwatchMatrix(colors) {
  return `
    <div class="matrix-container">
      <table class="matrix-table">
        <thead>
          <tr>
            <th></th>
            ${colors
              .map(
                (c) => `<th><span class="matrix-header-swatch" style="background:${c};"></span></th>`
              )
              .join('')}
          </tr>
        </thead>
        <tbody>
          ${colors
            .map(
              (c1, i) => `
            <tr>
              <th><span class="matrix-header-swatch" style="background:${c1};"></span></th>
              ${colors
                .map((c2, j) => {
                  if (i === j) return `<td style="background:${c1};"></td>`;
                  const ratio = getContrastRatio(c1, c2);
                  const grade = getWcagGrade(ratio);
                  const pass = grade.normalAA;
                  return `
                    <td class="matrix-cell ${pass ? 'matrix-pass' : 'matrix-fail'}">
                      <span class="ratio">${ratio.toFixed(1)}</span>
                      <span class="grade">${pass ? 'AA ✓' : '✗'}</span>
                    </td>
                  `;
                })
                .join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

// === Contrast Checker Panel ===
function renderContrastChecker(colors) {
  const pairs = [];
  // Generate all unique pairs
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      pairs.push([colors[i], colors[j]]);
    }
  }

  // Show max 6 pairs
  const displayPairs = pairs.slice(0, 6);

  return `
    <div class="contrast-checker">
      ${displayPairs
        .map(
          ([c1, c2]) => {
            const ratio = getContrastRatio(c1, c2);
            const grade = getWcagGrade(ratio);
            const textOnC1 = getTextColor(c1);
            const textOnC2 = getTextColor(c2);
            return `
          <div class="contrast-pair">
            <div class="contrast-preview">
              <div class="contrast-demo" style="background:${c1};color:${c2};">
                <div class="contrast-demo-text">${t('contrast.sampleText')}</div>
                <div class="contrast-demo-small">${t('contrast.smallText')}</div>
              </div>
              <div class="contrast-demo" style="background:${c2};color:${c1};">
                <div class="contrast-demo-text">${t('contrast.sampleText')}</div>
                <div class="contrast-demo-small">${t('contrast.smallText')}</div>
              </div>
            </div>
            <div class="contrast-scores">
              <div class="contrast-score">
                <div class="contrast-score-value">${ratio.toFixed(2)}</div>
                <div class="contrast-score-label">${t('contrast.ratio')}</div>
              </div>
              <div class="contrast-score">
                <div class="contrast-score-value ${grade.normalAA ? 'contrast-score-pass' : 'contrast-score-fail'}">
                  ${grade.normalAA ? t('contrast.pass') : t('contrast.fail')}
                </div>
                <div class="contrast-score-label">${t('contrast.normalAA')}</div>
              </div>
              <div class="contrast-score">
                <div class="contrast-score-value ${grade.normalAAA ? 'contrast-score-pass' : 'contrast-score-fail'}">
                  ${grade.normalAAA ? t('contrast.pass') : t('contrast.fail')}
                </div>
                <div class="contrast-score-label">${t('contrast.normalAAA')}</div>
              </div>
              <div class="contrast-score">
                <div class="contrast-score-value ${grade.largeAA ? 'contrast-score-pass' : 'contrast-score-fail'}">
                  ${grade.largeAA ? t('contrast.pass') : t('contrast.fail')}
                </div>
                <div class="contrast-score-label">${t('contrast.largeAA')}</div>
              </div>
            </div>
          </div>
        `;
          }
        )
        .join('')}
    </div>
  `;
}

// === Export Panel ===
function renderExport(colors) {
  const formats = [
    { id: 'python', title: t('export.python'), icon: 'code', content: toPythonDict(colors) },
    { id: 'json', title: t('export.json'), icon: 'data_object', content: toJson(colors) },
    { id: 'css', title: t('export.css'), icon: 'css', content: toCssVariables(colors) },
    { id: 'hex', title: t('export.hex'), icon: 'tag', content: toHexList(colors) },
  ];

  return `
    <div class="export-panel">
      <!-- Quick actions -->
      <div style="display:flex;gap:8px;margin-bottom:16px;">

        <button class="btn btn-secondary" id="copy-css-vars-btn" style="flex:1;gap:6px;justify-content:center;">
          <span class="material-icons-outlined" style="font-size:16px;">content_copy</span>
          ${t('export.copyCssVars')}
        </button>
        <button class="btn btn-secondary" id="copy-js-arr-btn" style="flex:1;gap:6px;justify-content:center;">
          <span class="material-icons-outlined" style="font-size:16px;">javascript</span>
          ${t('export.copyJsArray')}
        </button>
      </div>
      ${formats
        .map(
          (f) => `
        <div class="export-format">
          <div class="export-format-header">
            <span class="export-format-title">
              <span class="material-icons-outlined">${f.icon}</span>
              ${f.title}
            </span>
            <button class="btn btn-secondary btn-sm copy-btn" data-format="${f.id}">
              <span class="material-icons-outlined" style="font-size:14px;">content_copy</span>
              ${t('export.copy')}
            </button>
          </div>
          <pre class="export-code" id="export-${f.id}">${escapeHtml(f.content)}</pre>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Escape a value for use inside an HTML attribute (double-quoted)
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// === Preview Rendering ===
function renderPreview(state) {
  if (state.activeTool !== 'preview') return;
  const canvas = document.getElementById('main-chart');
  if (!canvas) return;
  const data = state.data || getSampleData(state.selectedChart, state.columns, state.series);

  // Apply custom color names
  if (state.colorNames) {
    if (['donut', 'polar'].includes(state.selectedChart)) {
      data.labels = data.labels.map((l, i) => state.colorNames[i] || l);
    } else {
      data.datasets.forEach((ds, i) => {
        ds.label = state.colorNames[i] || ds.label;
      });
    }
  }

  currentChart = renderChart(canvas, state.selectedChart, data, state.colors, {
    orientation: state.orientation,
  });
}

// === Update functions ===
function updateColorList(state) {
  const list = document.getElementById('color-list');
  if (!list) return;
  list.innerHTML = renderColorItems(state);
  bindColorEvents();
}

function updateToolPanel(state) {
  const panel = document.getElementById('tool-panel');
  if (!panel) return;
  panel.innerHTML = renderToolContent(state.activeTool, state);
  bindExportEvents(state);
}

// === Event Bindings ===
function bindSidebarEvents() {
  const state = getState();

  // Chart type select — also refresh orientation row since toggle is conditional
  document.getElementById('chart-type-select')?.addEventListener('change', (e) => {
    const newChart = e.target.value;
    const controls = CHART_CONTROLS[newChart];
    
    // Clamp cols/series if the new chart has controls
    let newCols = state.columns;
    let newSeries = state.series;
    if (controls) {
      if (controls.cols) newCols = Math.min(controls.cols[1], Math.max(controls.cols[0], newCols));
      if (controls.series) newSeries = Math.min(controls.series[1], Math.max(controls.series[0], newSeries));
    }
    
    setState({ selectedChart: newChart, data: null, orientation: 'vertical', columns: newCols, series: newSeries });

    // Sync colors to the new chart's active dimension
    syncColorsToCount(newCols, newSeries);
    
    // Refresh just the orientation row so H/V toggle appears/disappears
    const orientRow = document.querySelector('.graph-select-row:last-of-type');
    if (orientRow) {
      const newState = getState();
      orientRow.innerHTML = ORIENTATION_SUPPORTED.has(newState.selectedChart) ? `
          <div class="orientation-toggle" id="orientation-toggle">
            <button class="orientation-btn active" data-orient="vertical" data-tooltip="Vertical">
              <span class="material-icons-outlined">align_vertical_bottom</span>
            </button>
            <button class="orientation-btn" data-orient="horizontal" data-tooltip="Horizontal">
              <span class="material-icons-outlined">align_horizontal_left</span>
            </button>
          </div>` : '';
      bindOrientationEvents();
    }

    // Refresh Data Controls section
    const dataContainer = document.getElementById('data-controls-container');
    if (dataContainer) {
      dataContainer.innerHTML = renderDataControls(newChart, getState());
      bindDataControlEvents();
    }
  });

  // Orientation (initial bind)
  bindOrientationEvents();

  // Data Controls (initial bind)
  bindDataControlEvents();

  // Add color button (always present)
  document.getElementById('add-color-btn')?.addEventListener('click', () => {
    addColor();
  });

  // Apply Palette (always present)
  document.getElementById('apply-palette-btn')?.addEventListener('click', () => {
    const val = document.getElementById('palette-select')?.value;
    if (!val) {
      showToast(t('palette.noSelection'), 'error');
      return;
    }
    let selectedPalette = null;
    for (const group of Object.values(PALETTES)) {
      const p = group.find(x => x.id === val);
      if (p) { selectedPalette = p; break; }
    }
    if (selectedPalette) {
      const currentState = getState();
      const currentCount = currentState.colors.length;
      const newColors = Array.from({ length: currentCount }, (_, i) => selectedPalette.colors[i % selectedPalette.colors.length]);
      setColors(newColors, currentState.colorNames);
      document.getElementById('palette-select').value = '';
      showToast(t('palette.applied'), 'success');
    }
  });

  // Tools navigation (always present)
  document.querySelectorAll('.tools-nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tool = btn.dataset.tool;
      setState({ activeTool: tool });
      document.querySelectorAll('.tools-nav-item').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const main = document.querySelector('.testing-main');
      if (main) {
        const updatedState = getState();
        const parent = main.parentElement;
        if (parent) {
          const tmp = document.createElement('div');
          tmp.innerHTML = renderMainContent(updatedState);
          parent.replaceChild(tmp.firstElementChild, main);
        }
        requestAnimationFrame(() => {
          renderPreview(updatedState);
          bindToolbarEvents();
          if (tool === 'export') bindExportEvents(updatedState);
        });
      }
    });
  });

  // Color events (always present)
  bindColorEvents();

  // Auto-adjust button
  document.getElementById('auto-adjust-btn')?.addEventListener('click', () => {
    const { colors } = getState();
    const { adjusted, report } = autoAdjustColors(colors);
    showAutoAdjustModal(colors, adjusted, report);
  });


}

function bindDataControlEvents() {
  const state = getState();
  const controls = CHART_CONTROLS[state.selectedChart];
  if (!controls) return;

  // Columns
  if (controls.cols) {
    const colRange = document.getElementById('columns-range');
    const colInput = document.getElementById('columns-input');
    const [min, max] = controls.cols;
    
    colRange?.addEventListener('input', (e) => {
      colInput.value = e.target.value;
      const newCols = parseInt(e.target.value);
      setState({ columns: newCols, data: null });
      syncColorsToCount(newCols, null);
    });
    colInput?.addEventListener('change', (e) => {
      const val = Math.min(max, Math.max(min, parseInt(e.target.value) || min));
      colRange.value = val;
      e.target.value = val;
      setState({ columns: val, data: null });
      syncColorsToCount(val, null);
    });
  }

  // Series
  if (controls.series) {
    const serRange = document.getElementById('series-range');
    const serInput = document.getElementById('series-input');
    const [min, max] = controls.series;
    
    serRange?.addEventListener('input', (e) => {
      serInput.value = e.target.value;
      const newSeries = parseInt(e.target.value);
      setState({ series: newSeries, data: null });
      syncColorsToCount(null, newSeries);
    });
    serInput?.addEventListener('change', (e) => {
      const val = Math.min(max, Math.max(min, parseInt(e.target.value) || min));
      serRange.value = val;
      e.target.value = val;
      setState({ series: val, data: null });
      syncColorsToCount(null, val);
    });
  }

}

/**
 * Sync the color list length to the number of series/columns.
 * - chartType determines whether colors map to "series" or "columns" (e.g. pie/donut/polar)
 * - Pass null for cols or series to use the value already in state.
 */
function syncColorsToCount(newCols, newSeries) {
  const state = getState();
  const chartType = state.selectedChart;
  const controls = CHART_CONTROLS[chartType];

  // Charts where colors map to the column/segment dimension (no series control)
  const usesColumns = !controls?.series;
  const targetCount = usesColumns
    ? (newCols ?? state.columns)
    : (newSeries ?? state.series);

  const currentColors = state.colors;
  const currentNames  = state.colorNames || currentColors.map((_, i) => `Series ${i + 1}`);
  const diff = targetCount - currentColors.length;

  if (diff === 0) return;

  if (diff > 0) {
    // Add colors — generate hues evenly spaced from the last existing color
    const newColors = [...currentColors];
    const newNames  = [...currentNames];
    for (let i = 0; i < diff; i++) {
      const idx = currentColors.length + i;
      // Space the new hue 360/targetCount degrees away from the previous
      const prevHex  = newColors[newColors.length - 1];
      const prevH    = hexToHsl(prevHex).h;
      const step     = Math.round(360 / targetCount);
      const newH     = (prevH + step) % 360;
      const newColor = hslToHexLocal(newH, 62, 56);
      newColors.push(newColor);
      newNames.push(`Series ${idx + 1}`);
    }
    setColors(newColors, newNames);
  } else {
    // Remove trailing colors
    const newColors = currentColors.slice(0, targetCount);
    const newNames  = currentNames.slice(0, targetCount);
    setColors(newColors, newNames);
  }
}

// Minimal HSL→Hex helper (avoids importing from color.js to prevent circular issues)
function hslToHexLocal(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function bindOrientationEvents() {
  document.querySelectorAll('[data-orient]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-orient]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setState({ orientation: btn.dataset.orient });
    });
  });
}

function bindColorEvents() {
  // Color pickers - update visually on input, save state on change
  document.querySelectorAll('.color-picker').forEach((picker) => {
    picker.addEventListener('input', (e) => {
      const parentSwatch = e.target.closest('.color-item-swatch');
      if (parentSwatch) parentSwatch.style.background = e.target.value;
      const hexSpan = e.target.closest('.color-item').querySelector('.color-item-hex');
      if (hexSpan) hexSpan.textContent = e.target.value.toUpperCase();
    });
    picker.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      updateColor(idx, e.target.value);
    });
  });

  // Name inputs - save on blur to avoid losing focus during typing
  document.querySelectorAll('.color-name-input').forEach((input) => {
    input.addEventListener('blur', (e) => {
      const idx = parseInt(e.target.dataset.index);
      updateColorName(idx, e.target.value);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.target.blur();
    });
  });

  // Remove buttons
  document.querySelectorAll('.color-item-remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index);
      removeColor(idx);
    });
  });

  // Drag and drop
  const items = document.querySelectorAll('.color-item');
  let dragIndex = null;

  items.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      dragIndex = parseInt(item.dataset.index);
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      document.querySelectorAll('.color-item').forEach((i) => i.classList.remove('drag-over'));
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      item.classList.add('drag-over');
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const toIndex = parseInt(item.dataset.index);
      if (dragIndex !== null && dragIndex !== toIndex) {
        reorderColors(dragIndex, toIndex);
      }
      dragIndex = null;
    });
  });
}

function bindToolbarEvents() {
  // Fullscreen
  document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
    const container = document.getElementById('preview-container');
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen?.();
    }
  });

  // Colorblind simulator
  document.querySelectorAll('.colorblind-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.colorblind-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyColorblindFilter(btn.dataset.filter);
    });
  });
}


const CB_FILTERS = {
  none: '',
  protanopia:    'url(#cb-protanopia)',
  deuteranopia:  'url(#cb-deuteranopia)',
  tritanopia:    'url(#cb-tritanopia)',
  achromatopsia: 'url(#cb-achromatopsia)',
};

function ensureCbSvgFilters() {
  if (document.getElementById('cb-svg-filters')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'cb-svg-filters';
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;');
  svg.innerHTML = `
    <defs>
      <filter id="cb-protanopia">
        <feColorMatrix type="matrix" values="
          0.567 0.433 0     0 0
          0.558 0.442 0     0 0
          0     0.242 0.758 0 0
          0     0     0     1 0" />
      </filter>
      <filter id="cb-deuteranopia">
        <feColorMatrix type="matrix" values="
          0.625 0.375 0     0 0
          0.7   0.3   0     0 0
          0     0.3   0.7   0 0
          0     0     0     1 0" />
      </filter>
      <filter id="cb-tritanopia">
        <feColorMatrix type="matrix" values="
          0.95  0.05  0     0 0
          0     0.433 0.567 0 0
          0     0.475 0.525 0 0
          0     0     0     1 0" />
      </filter>
      <filter id="cb-achromatopsia">
        <feColorMatrix type="matrix" values="
          0.299 0.587 0.114 0 0
          0.299 0.587 0.114 0 0
          0.299 0.587 0.114 0 0
          0     0     0     1 0" />
      </filter>
    </defs>
  `;
  document.body.appendChild(svg);
}

function applyColorblindFilter(filterName) {
  ensureCbSvgFilters();
  const preview = document.getElementById('preview-container');
  if (!preview) return;
  preview.style.filter = CB_FILTERS[filterName] || '';
}

function bindExportEvents(state) {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const format = btn.dataset.format;
      const codeEl = document.getElementById(`export-${format}`);
      if (!codeEl) return;
      try {
        await copyToClipboard(codeEl.textContent);
        showToast(t('export.copied'), 'success');
      } catch (err) {
        showToast('Failed to copy', 'error');
      }
    });
  });


  // Copy CSS vars
  document.getElementById('copy-css-vars-btn')?.addEventListener('click', async () => {
    try {
      await copyToClipboard(toCssVariables(state.colors));
      showToast(t('export.copied'), 'success');
    } catch { showToast('Failed to copy', 'error'); }
  });

  // Copy JS array
  document.getElementById('copy-js-arr-btn')?.addEventListener('click', async () => {
    const arr = `const palette = [${state.colors.map(c => `'${c}'`).join(', ')}];`;
    try {
      await copyToClipboard(arr);
      showToast(t('export.copied'), 'success');
    } catch { showToast('Failed to copy', 'error'); }
  });
}


// ─── Auto-Adjust Modal ────────────────────────────────────────────────────────
function showAutoAdjustModal(original, adjusted, report) {
  // Remove any existing modal
  document.getElementById('auto-adjust-modal')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'auto-adjust-modal';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);
    z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;
    animation:fadeIn .15s ease;
  `;

  const rules = [
    [t('autoAdjust.rule.hue'),   t('autoAdjust.rule.hueDesc')],
    [t('autoAdjust.rule.sat'),   t('autoAdjust.rule.satDesc')],
    [t('autoAdjust.rule.light'), t('autoAdjust.rule.lightDesc')],
    [t('autoAdjust.rule.alt'),   t('autoAdjust.rule.altDesc')],
  ];

  const rowsHtml = report.map((r) => {
    const hueChanged   = r.changes.hue.before   !== r.changes.hue.after;
    const satChanged   = r.changes.sat.before   !== r.changes.sat.after;
    const lightChanged = r.changes.light.before !== r.changes.light.after;
    const chip = (changed, label, before, after) => changed ? `
      <span style="display:inline-flex;align-items:center;gap:3px;
        background:var(--surface-raised,rgba(255,255,255,0.07));
        border:1px solid var(--border,rgba(255,255,255,0.1));
        border-radius:5px;padding:2px 7px;font-size:10px;font-family:monospace;
        color:var(--text-primary,#e2e8f0);">
        <span style="opacity:.5;">${label}</span>
        <span style="opacity:.5;">${before}</span>
        <span style="opacity:.4;">→</span>
        <span style="color:#a78bfa;">${after}</span>
      </span>` : '';
    return `
      <div style="display:flex;align-items:center;gap:10px;padding:7px 0;
        border-bottom:1px solid var(--border,rgba(255,255,255,0.07));">
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;">
          <div style="width:30px;height:30px;border-radius:6px;background:${r.original};
            box-shadow:inset 0 0 0 1px rgba(0,0,0,0.2);"></div>
          <span class="material-icons-outlined" style="font-size:13px;opacity:.4;">arrow_forward</span>
          <div style="width:30px;height:30px;border-radius:6px;background:${r.result};
            box-shadow:inset 0 0 0 1px rgba(0,0,0,0.2);"></div>
        </div>
        <div style="flex:1;display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
          ${chip(hueChanged,   'H', r.changes.hue.before+'°',   r.changes.hue.after+'°')}
          ${chip(satChanged,   'S', r.changes.sat.before+'%',   r.changes.sat.after+'%')}
          ${chip(lightChanged, 'L', r.changes.light.before+'%', r.changes.light.after+'%')}
          ${!hueChanged && !satChanged && !lightChanged
            ? `<span style="font-size:10px;opacity:.4;">${t('autoAdjust.noChange')}</span>`
            : ''}
        </div>
      </div>`;
  }).join('');

  const colorStrip = (colors) => colors.map(c =>
    `<div title="${c}" style="flex:1;min-width:18px;height:40px;background:${c};"></div>`
  ).join('');

  overlay.innerHTML = `
    <div style="
      background:var(--surface,#13131f);
      border:1px solid var(--border,rgba(255,255,255,0.1));
      border-radius:16px;
      max-width:500px;width:100%;max-height:88vh;overflow-y:auto;
      box-shadow:0 32px 80px rgba(0,0,0,0.7);
      font-family:var(--font-sans,system-ui,sans-serif);
    ">
      <!-- Header -->
      <div style="padding:18px 20px 14px;border-bottom:1px solid var(--border,rgba(255,255,255,0.08));
        display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:10px;background:rgba(167,139,250,0.15);
            display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span class="material-icons-outlined" style="color:#a78bfa;font-size:18px;">auto_fix_high</span>
          </div>
          <div>
            <div style="font-weight:600;font-size:14px;color:var(--text-primary,#e2e8f0);">
              ${t('autoAdjust.title')}
            </div>
            <div style="font-size:11px;color:var(--text-secondary,#94a3b8);margin-top:1px;">
              ${t('autoAdjust.subtitle')}
            </div>
          </div>
        </div>
        <button id="adj-close-x" style="background:none;border:none;cursor:pointer;
          color:var(--text-secondary,#94a3b8);padding:4px;border-radius:6px;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          transition:color .15s,background .15s;"
          onmouseover="this.style.background='rgba(255,255,255,0.07)'"
          onmouseout="this.style.background='none'">
          <span class="material-icons-outlined" style="font-size:18px;">close</span>
        </button>
      </div>

      <!-- Comparison strip -->
      <div style="padding:16px 20px;border-bottom:1px solid var(--border,rgba(255,255,255,0.08));">
        <div style="font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
          color:var(--text-secondary,#94a3b8);margin-bottom:10px;">
          ${t('autoAdjust.comparison')}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:11px;color:var(--text-secondary,#94a3b8);width:50px;flex-shrink:0;text-align:right;">
              ${t('autoAdjust.before')}
            </span>
            <div style="flex:1;display:flex;border-radius:8px;overflow:hidden;height:40px;
              box-shadow:inset 0 0 0 1px rgba(0,0,0,0.2);">
              ${colorStrip(original)}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:11px;color:var(--text-secondary,#94a3b8);width:50px;flex-shrink:0;text-align:right;">
              ${t('autoAdjust.after')}
            </span>
            <div style="flex:1;display:flex;border-radius:8px;overflow:hidden;height:40px;
              box-shadow:inset 0 0 0 1px rgba(0,0,0,0.2);">
              ${colorStrip(adjusted)}
            </div>
          </div>
        </div>
      </div>

      <!-- Applied rules -->
      <div style="padding:12px 20px;border-bottom:1px solid var(--border,rgba(255,255,255,0.08));">
        <div style="font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
          color:var(--text-secondary,#94a3b8);margin-bottom:8px;">
          ${t('autoAdjust.rulesApplied')}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">
          ${rules.map(([label, tip]) => `
            <span title="${tip}" style="display:inline-flex;align-items:center;gap:4px;
              background:rgba(167,139,250,0.1);color:#c4b5fd;
              border:1px solid rgba(167,139,250,0.22);border-radius:20px;
              padding:3px 10px;font-size:10px;cursor:help;">
              <span class="material-icons-outlined" style="font-size:11px;">check_circle</span>
              ${label}
            </span>`).join('')}
        </div>
      </div>

      <!-- Per-color changes -->
      <div style="padding:12px 20px;">
        <div style="font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
          color:var(--text-secondary,#94a3b8);margin-bottom:4px;">
          ${t('autoAdjust.perColor')}
        </div>
        ${rowsHtml}
      </div>

      <!-- Actions -->
      <div style="padding:14px 20px;display:flex;gap:8px;justify-content:flex-end;
        border-top:1px solid var(--border,rgba(255,255,255,0.08));">
        <button id="adj-cancel-btn" class="btn btn-ghost" style="padding:8px 16px;font-size:13px;">
          ${t('autoAdjust.cancel')}
        </button>
        <button id="adj-apply-btn" class="btn btn-primary" style="padding:8px 18px;font-size:13px;display:flex;align-items:center;gap:6px;">
          <span class="material-icons-outlined" style="font-size:15px;">check</span>
          ${t('autoAdjust.apply')}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.getElementById('adj-close-x').addEventListener('click', () => overlay.remove());
  document.getElementById('adj-cancel-btn').addEventListener('click', () => overlay.remove());
  document.getElementById('adj-apply-btn').addEventListener('click', () => {
    const { colorNames } = getState();
    setColors(adjusted, colorNames);
    overlay.remove();
    showToast(t('autoAdjust.success'), 'success');
  });
}
