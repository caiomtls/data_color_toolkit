/**
 * Store — Application state management
 * Uses localStorage for persistence
 */

const STORAGE_KEY = 'dct-state';

const DEFAULT_COLORS = [
  '#4F46E5', // Indigo
  '#0EA5E9', // Sky
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];

const DEFAULT_STATE = {
  colors: [...DEFAULT_COLORS],
  colorNames: DEFAULT_COLORS.map((_, i) => `Series ${i + 1}`),
  selectedChart: 'grouped-bar',
  columns: 5,
  series: 3,
  orientation: 'vertical',
  compareMultiple: false,
  activeTool: 'preview',
  viewMode: 'grid',
  data: null,
};

let state = loadState();
let listeners = [];

// Keys excluded from persistence (transient / large)
const OMIT_FROM_STORAGE = new Set(['data']);

// Validate that a value is a real 6-digit hex colour
function isHex(v) {
  return typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate colours — if the array is corrupt, fall back to defaults
      if (Array.isArray(parsed.colors) && parsed.colors.every(isHex)) {
        // Sanitise colorNames: must be an array of strings, same length as colors
        if (!Array.isArray(parsed.colorNames) || parsed.colorNames.length !== parsed.colors.length) {
          parsed.colorNames = parsed.colors.map((_, i) => `Series ${i + 1}`);
        } else {
          parsed.colorNames = parsed.colorNames.map((n) => String(n).slice(0, 80));
        }
        return { ...DEFAULT_STATE, ...parsed, data: null };
      }
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
  return { ...DEFAULT_STATE };
}

// Debounced write — avoids a localStorage.setItem on every drag event
let _saveTimer = null;
function saveState() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    try {
      const toSave = Object.fromEntries(
        Object.entries(state).filter(([k]) => !OMIT_FROM_STORAGE.has(k))
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, 16);
}

export function getState() {
  return { ...state };
}

export function setState(updates) {
  state = { ...state, ...updates };
  saveState();
  notify();
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify() {
  listeners.forEach((l) => l(state));
}

// Color management
export function addColor(hex) {
  state.colors = [...state.colors, hex || getRandomColor()];
  state.colorNames = [...(state.colorNames || state.colors.map((_, i) => `Series ${i + 1}`).slice(0, -1)), `Series ${state.colors.length}`];
  saveState();
  notify();
}

export function removeColor(index) {
  if (state.colors.length <= 1) return;
  state.colors = state.colors.filter((_, i) => i !== index);
  if (state.colorNames) {
    state.colorNames = state.colorNames.filter((_, i) => i !== index);
  }
  saveState();
  notify();
}

export function updateColor(index, hex) {
  state.colors = state.colors.map((c, i) => (i === index ? hex : c));
  saveState();
  notify();
}

export function updateColorName(index, name) {
  if (!state.colorNames) {
    state.colorNames = state.colors.map((_, i) => `Series ${i + 1}`);
  }
  state.colorNames = state.colorNames.map((n, i) => (i === index ? name : n));
  saveState();
  notify();
}

export function reorderColors(fromIndex, toIndex) {
  const arr = [...state.colors];
  const [moved] = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, moved);
  state.colors = arr;
  
  if (state.colorNames) {
    const namesArr = [...state.colorNames];
    const [movedName] = namesArr.splice(fromIndex, 1);
    namesArr.splice(toIndex, 0, movedName);
    state.colorNames = namesArr;
  }
  
  saveState();
  notify();
}

export function setColors(colors, colorNames) {
  state.colors = colors;
  state.colorNames = colorNames || colors.map((_, i) => `Series ${i + 1}`);
  saveState();
  notify();
}

export function resetColors() {
  state.colors = [...DEFAULT_COLORS];
  state.colorNames = DEFAULT_COLORS.map((_, i) => `Series ${i + 1}`);
  saveState();
  notify();
}

function getRandomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30);
  const l = 45 + Math.floor(Math.random() * 20);
  return hslToHex(h, s, l);
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate sample data
export function generateData(columns, series) {
  const labels = [];
  const datasets = [];
  const labelNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];

  for (let i = 0; i < columns; i++) {
    labels.push(labelNames[i] || `Col ${i + 1}`);
  }

  for (let s = 0; s < series; s++) {
    const data = [];
    for (let c = 0; c < columns; c++) {
      data.push(Math.floor(Math.random() * 80) + 20);
    }
    datasets.push({
      label: `Series ${s + 1}`,
      data,
    });
  }

  return { labels, datasets };
}
