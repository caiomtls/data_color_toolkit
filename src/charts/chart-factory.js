/**
 * Chart Factory — Creates Chart.js instances for all 14 chart types
 *
 * Sources for taxonomy:
 * - FT Visual Vocabulary (ft.com)
 * - From Data to Viz (data-to-viz.com)
 */

import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  ArcElement,
  DoughnutController,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  BubbleController,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Tooltip,
  PieController,
} from 'chart.js';

import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

import ChartjsPluginStacked100 from 'chartjs-plugin-stacked100';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';

// Register all Chart.js components
Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  ArcElement,
  DoughnutController,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  BubbleController,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Tooltip,
  ChartjsPluginStacked100,
  BoxPlotController,
  BoxAndWiskers,
  PieController,
  MatrixController,
  MatrixElement
);

// ─── Chart Type Definitions ─────────────────────────────────────────
// 17 types organized in 7 categories based on FT Visual Vocabulary
// Charts that support H/V orientation toggle
export const ORIENTATION_SUPPORTED = new Set([
  'grouped-bar',
  'stacked-bar',
  'stacked-bar-100',
  'mixed',
  'waterfall',
]);

export const CHART_TYPES = [
  // ── Comparação ──
  {
    id: 'grouped-bar',
    titleKey: 'chart.groupedBar.title',
    descKey: 'chart.groupedBar.desc',
    category: 'comparison',
    icon: 'bar_chart',
  },
  {
    id: 'radar',
    titleKey: 'chart.radar.title',
    descKey: 'chart.radar.desc',
    category: 'comparison',
    icon: 'radar',
  },
  {
    id: 'waterfall',
    titleKey: 'chart.waterfall.title',
    descKey: 'chart.waterfall.desc',
    category: 'comparison',
    icon: 'waterfall_chart',
  },

  // ── Evolução Temporal ──
  {
    id: 'multi-line',
    titleKey: 'chart.multiLine.title',
    descKey: 'chart.multiLine.desc',
    category: 'trend',
    icon: 'show_chart',
  },
  {
    id: 'slope',
    titleKey: 'chart.slope.title',
    descKey: 'chart.slope.desc',
    category: 'trend',
    icon: 'trending_up',
  },
  {
    id: 'mixed',
    titleKey: 'chart.mixed.title',
    descKey: 'chart.mixed.desc',
    category: 'trend',
    icon: 'stacked_line_chart',
  },
  {
    id: 'step-line',
    titleKey: 'chart.stepLine.title',
    descKey: 'chart.stepLine.desc',
    category: 'trend',
    icon: 'staircase',
  },

  // ── Composição ──
  {
    id: 'stacked-area',
    titleKey: 'chart.stackedArea.title',
    descKey: 'chart.stackedArea.desc',
    category: 'composition',
    icon: 'area_chart',
  },
  {
    id: 'stacked-bar',
    titleKey: 'chart.stackedBar.title',
    descKey: 'chart.stackedBar.desc',
    category: 'composition',
    icon: 'stacked_bar_chart',
  },
  {
    id: 'stacked-bar-100',
    titleKey: 'chart.stackedBar100.title',
    descKey: 'chart.stackedBar100.desc',
    category: 'composition',
    icon: 'percent',
  },

  // ── Parte do Todo ──
  {
    id: 'donut',
    titleKey: 'chart.donut.title',
    descKey: 'chart.donut.desc',
    category: 'part-to-whole',
    icon: 'donut_large',
  },
  {
    id: 'pie',
    titleKey: 'chart.pie.title',
    descKey: 'chart.pie.desc',
    category: 'part-to-whole',
    icon: 'pie_chart',
  },

  // ── Distribuição ──
  {
    id: 'box',
    titleKey: 'chart.box.title',
    descKey: 'chart.box.desc',
    category: 'distribution',
    icon: 'candlestick_chart',
  },
  {
    id: 'heatmap',
    titleKey: 'chart.heatmap.title',
    descKey: 'chart.heatmap.desc',
    category: 'distribution',
    icon: 'grid_on',
  },

  // ── Correlação ──
  {
    id: 'scatter',
    titleKey: 'chart.scatter.title',
    descKey: 'chart.scatter.desc',
    category: 'correlation',
    icon: 'scatter_plot',
  },
  {
    id: 'bubble',
    titleKey: 'chart.bubble.title',
    descKey: 'chart.bubble.desc',
    category: 'correlation',
    icon: 'bubble_chart',
  },

  // ── Magnitude ──
  {
    id: 'polar',
    titleKey: 'chart.polar.title',
    descKey: 'chart.polar.desc',
    category: 'magnitude',
    icon: 'donut_small',
  },
];

// ─── Category Definitions ───────────────────────────────────────────
export const CATEGORIES = [
  { id: 'all', labelKey: 'library.filterAll' },
  { id: 'comparison', labelKey: 'library.comparison' },
  { id: 'trend', labelKey: 'library.trend' },
  { id: 'composition', labelKey: 'library.composition' },
  { id: 'part-to-whole', labelKey: 'library.partToWhole' },
  { id: 'distribution', labelKey: 'library.distribution' },
  { id: 'correlation', labelKey: 'library.correlation' },
  { id: 'magnitude', labelKey: 'library.magnitude' },
];

/**
 * CHART_CONTROLS — defines which data controls are shown per chart type.
 * null  → no controls (data is fully generated internally)
 * cols  → [min, max, default]
 * series→ [min, max, default]
 */
export const CHART_CONTROLS = {
  'grouped-bar':    { cols: [1, 30, 5],  series: [1, 8, 3] },
  'radar':          { cols: [3, 10, 6],  series: [1, 5, 3],  colsLabel: 'testing.axes', seriesLabel: 'testing.profiles' },
  'waterfall':      { cols: [3, 12, 6],  colsLabel: 'testing.steps' },
  'multi-line':     { cols: [2, 30, 8],  series: [1, 8, 4] },
  'slope':          { cols: [2, 10, 5],  colsLabel: 'testing.dataPoints' },
  'mixed':          { cols: [2, 15, 7] },
  'step-line':      { cols: [2, 20, 8],  series: [1, 6, 3] },
  'stacked-area':   { cols: [2, 30, 7],  series: [1, 8, 4] },
  'stacked-bar':    { cols: [1, 30, 5],  series: [1, 8, 3] },
  'stacked-bar-100':{ cols: [1, 30, 5],  series: [2, 8, 3] },
  'donut':          { cols: [2, 12, 5],  colsLabel: 'testing.segments' },
  'pie':            { cols: [2, 12, 5],  colsLabel: 'testing.segments' },
  'box':            { cols: [1, 10, 4],  colsLabel: 'testing.groups' },
  'heatmap':        { cols: [3, 12, 6],  series: [2, 8, 4],  colsLabel: 'testing.columns', seriesLabel: 'testing.rows' },
  'scatter':        { cols: [10, 100, 30], series: [1, 5, 3], colsLabel: 'testing.dataPoints' },
  'bubble':         { cols: [5, 50, 15],  series: [1, 5, 3], colsLabel: 'testing.dataPoints' },
  'polar':          { cols: [3, 10, 5],  colsLabel: 'testing.segments' },
};

// ─── Sample Data Generators ─────────────────────────────────────────
// Helper to generate N sequential month-like labels for any count
function makeTimeLabels(n) {
  const base = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  if (n <= 12) return base.slice(0, n);
  return Array.from({ length: n }, (_, i) => `T${i + 1}`);
}

function makeCategoryLabels(n) {
  const base = ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa'];
  if (n <= base.length) return base.slice(0, n);
  return Array.from({ length: n }, (_, i) => `Cat ${i + 1}`);
}

const sampleGenerators = {
  'grouped-bar': (cols, series) => {
    const labels = makeCategoryLabels(cols);
    const datasets = [];
    for (let s = 0; s < series; s++) {
      datasets.push({
        label: `Series ${s + 1}`,
        data: Array.from({ length: cols }, () => Math.floor(Math.random() * 80) + 20),
      });
    }
    return { labels, datasets };
  },

  radar: (cols, series) => {
    const axisNames = ['Speed','Power','Range','Defense','Agility','Stamina','Accuracy','Precision','Endurance','Luck'];
    const labels = cols <= axisNames.length ? axisNames.slice(0, cols) : Array.from({ length: cols }, (_, i) => `Axis ${i + 1}`);
    const datasets = [];
    for (let s = 0; s < series; s++) {
      datasets.push({
        label: `Profile ${s + 1}`,
        data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 80) + 20),
      });
    }
    return { labels, datasets };
  },

  'multi-line': (cols, series) => {
    const labels = makeTimeLabels(cols);
    const datasets = [];
    for (let s = 0; s < series; s++) {
      let prev = Math.floor(Math.random() * 50) + 30;
      datasets.push({
        label: `Series ${s + 1}`,
        data: Array.from({ length: cols }, () => {
          prev = Math.max(5, prev + Math.floor(Math.random() * 30) - 15);
          return prev;
        }),
      });
    }
    return { labels, datasets };
  },

  slope: (cols) => {
    const datasets = [];
    for (let s = 0; s < cols; s++) {
      const start = Math.floor(Math.random() * 80) + 20;
      const end = Math.floor(Math.random() * 80) + 20;
      datasets.push({
        label: `Item ${s + 1}`,
        data: [start, end],
      });
    }
    return { labels: ['2023', '2024'], datasets };
  },

  mixed: (cols) => {
    const labels = makeTimeLabels(cols);
    let prev1 = 40;
    let prev2 = 60;
    const datasets = [
      {
        label: 'Revenue',
        type: 'bar',
        data: Array.from({ length: cols }, () => {
          prev1 = Math.max(20, prev1 + Math.floor(Math.random() * 20) - 8);
          return prev1;
        }),
      },
      {
        label: 'Trend',
        type: 'line',
        data: Array.from({ length: cols }, () => {
          prev2 = Math.max(20, prev2 + Math.floor(Math.random() * 16) - 6);
          return prev2;
        }),
      },
    ];
    return { labels, datasets };
  },

  'stacked-area': (cols, series) => {
    const labels = makeTimeLabels(cols);
    const datasets = [];
    for (let s = 0; s < series; s++) {
      let prev = Math.floor(Math.random() * 30) + 10;
      datasets.push({
        label: `Layer ${s + 1}`,
        data: Array.from({ length: cols }, () => {
          prev = Math.max(5, prev + Math.floor(Math.random() * 20) - 10);
          return prev;
        }),
      });
    }
    return { labels, datasets };
  },

  'stacked-bar': (cols, series) => {
    const labels = makeCategoryLabels(cols);
    const datasets = [];
    for (let s = 0; s < series; s++) {
      datasets.push({
        label: `Segment ${s + 1}`,
        data: Array.from({ length: cols }, () => Math.floor(Math.random() * 40) + 10),
      });
    }
    return { labels, datasets };
  },

  'stacked-bar-100': (cols, series) => {
    const labels = makeCategoryLabels(cols);
    const datasets = [];
    for (let s = 0; s < series; s++) {
      datasets.push({
        label: `Category ${s + 1}`,
        data: Array.from({ length: cols }, () => Math.floor(Math.random() * 60) + 10),
      });
    }
    return { labels, datasets };
  },

  donut: (cols) => {
    const segNames = ['Segment A','Segment B','Segment C','Segment D','Segment E','Segment F',
                      'Segment G','Segment H','Segment I','Segment J','Segment K','Segment L'];
    const labels = cols <= segNames.length ? segNames.slice(0, cols) : Array.from({ length: cols }, (_, i) => `Seg ${i + 1}`);
    return {
      labels,
      datasets: [{
        data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 40) + 10),
      }],
    };
  },

  box: (cols) => {
    const groupNames = ['Group A','Group B','Group C','Group D','Group E','Group F','Group G','Group H','Group I','Group J'];
    const labels = cols <= groupNames.length ? groupNames.slice(0, cols) : Array.from({ length: cols }, (_, i) => `Group ${i + 1}`);
    return {
      labels,
      datasets: [{
        label: 'Distribution',
        data: labels.map(() => {
          const n = 30;
          const mean = Math.random() * 60 + 20;
          const spread = Math.random() * 20 + 5;
          return Array.from({ length: n }, () =>
            Math.max(0, mean + (Math.random() - 0.5) * spread * 2)
          );
        }),
      }],
    };
  },

  scatter: (cols, series) => {
    const datasets = [];
    for (let s = 0; s < series; s++) {
      datasets.push({
        label: `Group ${s + 1}`,
        data: Array.from({ length: cols }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
        })),
      });
    }
    return { labels: [], datasets };
  },

  bubble: (cols, series) => {
    const datasets = [];
    for (let s = 0; s < series; s++) {
      datasets.push({
        label: `Cluster ${s + 1}`,
        data: Array.from({ length: cols }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          r: Math.random() * 12 + 3,
        })),
      });
    }
    return { labels: [], datasets };
  },



  polar: (cols) => {
    const labels = makeCategoryLabels(cols);
    return {
      labels,
      datasets: [{
        data: Array.from({ length: cols }, () => Math.floor(Math.random() * 60) + 15),
      }],
    };
  },

  pie: (cols) => {
    const segNames = ['Segment A','Segment B','Segment C','Segment D','Segment E','Segment F',
                      'Segment G','Segment H','Segment I','Segment J','Segment K','Segment L'];
    const labels = cols <= segNames.length ? segNames.slice(0, cols) : Array.from({ length: cols }, (_, i) => `Seg ${i + 1}`);
    return {
      labels,
      datasets: [{
        data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 40) + 10),
      }],
    };
  },

  waterfall: (cols) => {
    const stepNames = ['Start','Q1','Q2','Q3','Q4','Adj','Tax','Ops','Net','End','Other','Total'];
    const labels = cols <= stepNames.length ? stepNames.slice(0, cols) : Array.from({ length: cols }, (_, i) => `Step ${i + 1}`);
    // Build cumulative floating bars [base, top]
    let running = 0;
    const floatingData = labels.map((_, i) => {
      const isLast = i === labels.length - 1;
      if (isLast) return [0, running]; // total bar from 0
      const delta = Math.floor(Math.random() * 40) - 10;
      const base = running;
      running += delta;
      return [base, running];
    });
    const isPositive = floatingData.map(([b, t]) => t >= b);
    return { labels, datasets: [{ label: 'Value', data: floatingData, isPositive }] };
  },

  'step-line': (cols, series) => {
    const labels = makeTimeLabels(cols);
    const datasets = [];
    for (let s = 0; s < series; s++) {
      let prev = Math.floor(Math.random() * 60) + 20;
      datasets.push({
        label: `Series ${s + 1}`,
        data: Array.from({ length: cols }, () => {
          if (Math.random() < 0.4) prev = Math.max(5, prev + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 25) + 5));
          return prev;
        }),
      });
    }
    return { labels, datasets };
  },

  heatmap: (cols, series) => {
    const colLabels = Array.from({ length: cols }, (_, i) => `Col ${i + 1}`);
    const rowLabels = Array.from({ length: series }, (_, i) => `Row ${i + 1}`);
    const data = [];
    rowLabels.forEach((row, r) => {
      colLabels.forEach((col, c) => {
        data.push({ x: col, y: row, v: Math.floor(Math.random() * 100) });
      });
    });
    return { labels: colLabels, rowLabels, datasets: [{ label: 'Value', data }] };
  },
};

export function getSampleData(chartType, cols = 5, series = 3) {
  const generator = sampleGenerators[chartType] || sampleGenerators['grouped-bar'];
  return generator(cols, series);
}

// ─── Base Options Builder ───────────────────────────────────────────
function getBaseOptions(data, animate = true) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#A0A0A0' : '#666666';

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: animate ? { duration: 600, easing: 'easeOutQuart' } : false,
    plugins: {
      legend: {
        display: data.datasets.length > 1,
        position: 'top',
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 11 },
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 3,
          useBorderRadius: true,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#333' : '#111',
        titleFont: { family: 'Inter', size: 12, weight: '600' },
        bodyFont: { family: 'Inter', size: 11 },
        cornerRadius: 8,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: gridColor, drawBorder: false },
        ticks: { color: textColor, font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: gridColor, drawBorder: false },
        ticks: { color: textColor, font: { family: 'Inter', size: 11 } },
      },
    },
    _gridColor: gridColor,
    _textColor: textColor,
  };
}

// ─── Chart Config Builders ──────────────────────────────────────────
const configBuilders = {
  'grouped-bar': (data, colors, opts, orientation) => ({
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        backgroundColor: colors[i % colors.length] + 'CC',
        borderColor: colors[i % colors.length],
        borderWidth: 1,
        borderRadius: 4,
      })),
    },
    options: {
      ...opts,
      ...(orientation === 'horizontal' ? { indexAxis: 'y' } : {}),
    },
  }),

  radar: (data, colors, opts) => ({
    type: 'radar',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length] + '30',
        borderWidth: 2,
        pointBackgroundColor: colors[i % colors.length],
        pointRadius: 3,
        pointHoverRadius: 5,
      })),
    },
    options: {
      ...opts,
      scales: {
        r: {
          grid: { color: opts._gridColor },
          angleLines: { color: opts._gridColor },
          pointLabels: { color: opts._textColor, font: { family: 'Inter', size: 11 } },
          ticks: { color: opts._textColor, backdropColor: 'transparent', font: { size: 10 } },
        },
      },
    },
  }),

  'multi-line': (data, colors, opts) => ({
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length] + '20',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: colors[i % colors.length],
        tension: 0.3,
        fill: false,
      })),
    },
    options: opts,
  }),

  slope: (data, colors, opts) => ({
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length],
        borderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: colors[i % colors.length],
        tension: 0,
        fill: false,
      })),
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        x: { ...opts.scales.x, offset: true },
      },
    },
  }),

  mixed: (data, colors, opts) => ({
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => {
        if (ds.type === 'line') {
          return {
            ...ds,
            borderColor: colors[i % colors.length],
            backgroundColor: colors[i % colors.length] + '20',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: colors[i % colors.length],
            tension: 0.3,
            fill: false,
            order: 0,
          };
        }
        return {
          ...ds,
          backgroundColor: colors[i % colors.length] + 'CC',
          borderColor: colors[i % colors.length],
          borderWidth: 1,
          borderRadius: 4,
          order: 1,
        };
      }),
    },
    options: opts,
  }),

  'stacked-area': (data, colors, opts) => ({
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        backgroundColor: colors[i % colors.length] + '40',
        borderColor: colors[i % colors.length],
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      })),
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        y: { ...opts.scales.y, stacked: true },
      },
    },
  }),

  'stacked-bar': (data, colors, opts, orientation) => ({
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        backgroundColor: colors[i % colors.length] + 'CC',
        borderColor: colors[i % colors.length],
        borderWidth: 1,
        borderRadius: 2,
      })),
    },
    options: {
      ...opts,
      ...(orientation === 'horizontal' ? { indexAxis: 'y' } : {}),
      scales: {
        ...opts.scales,
        x: { ...opts.scales.x, stacked: true },
        y: { ...opts.scales.y, stacked: true },
      },
    },
  }),

  'stacked-bar-100': (data, colors, opts, orientation) => {
    const isHorizontal = orientation === 'horizontal';
    // Manually normalise: for each column index, compute column sum then % per series
    const colCount = data.labels.length;
    const sums = Array(colCount).fill(0);
    data.datasets.forEach((ds) => ds.data.forEach((v, ci) => { sums[ci] += (v || 0); }));
    const normalised = data.datasets.map((ds) => ({
      ...ds,
      data: ds.data.map((v, ci) => sums[ci] > 0 ? +((v / sums[ci]) * 100).toFixed(2) : 0),
    }));
    return {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: normalised.map((ds, i) => ({
          ...ds,
          backgroundColor: colors[i % colors.length] + 'CC',
          borderColor: colors[i % colors.length],
          borderWidth: 1,
          borderRadius: 2,
        })),
      },
      options: {
        ...opts,
        ...(isHorizontal ? { indexAxis: 'y' } : {}),
        scales: {
          ...opts.scales,
          x: { ...opts.scales.x, stacked: true, ...(isHorizontal ? { max: 100, ticks: { callback: (v) => v + '%' } } : {}) },
          y: { ...opts.scales.y, stacked: true, ...(!isHorizontal ? { max: 100, ticks: { callback: (v) => v + '%' } } : {}) },
        },
        plugins: {
          ...opts.plugins,
          tooltip: {
            ...opts.plugins.tooltip,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed[isHorizontal ? 'x' : 'y'].toFixed(1)}%`,
            },
          },
        },
      },
    };
  },

  donut: (data, colors, opts) => ({
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        ...data.datasets[0],
        backgroundColor: data.labels.map((_, i) => colors[i % colors.length] + 'CC'),
        borderColor: data.labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      ...opts,
      cutout: '55%',
      scales: {},
      plugins: {
        ...opts.plugins,
        legend: { ...opts.plugins.legend, display: true, position: 'right' },
      },
    },
  }),

  box: (data, colors, opts) => ({
    type: 'boxplot',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds) => ({
        ...ds,
        backgroundColor: data.labels.map((_, i) => colors[i % colors.length] + '60'),
        borderColor: data.labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 2,
        outlierBackgroundColor: data.labels.map((_, i) => colors[i % colors.length]),
        outlierRadius: 3,
        medianColor: opts._textColor,
        itemRadius: 0,
      })),
    },
    options: opts,
  }),

  scatter: (data, colors, opts) => ({
    type: 'scatter',
    data: {
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        backgroundColor: colors[i % colors.length] + 'AA',
        borderColor: colors[i % colors.length],
        borderWidth: 1.5,
        pointRadius: 6,
        pointHoverRadius: 8,
      })),
    },
    options: opts,
  }),

  bubble: (data, colors, opts) => ({
    type: 'bubble',
    data: {
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        backgroundColor: colors[i % colors.length] + '80',
        borderColor: colors[i % colors.length],
        borderWidth: 1.5,
        hoverRadius: 2,
      })),
    },
    options: opts,
  }),


  polar: (data, colors, opts) => ({
    type: 'polarArea',
    data: {
      labels: data.labels,
      datasets: [{
        ...data.datasets[0],
        backgroundColor: data.labels.map((_, i) => colors[i % colors.length] + '80'),
        borderColor: data.labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 2,
      }],
    },
    options: {
      ...opts,
      scales: {
        r: {
          grid: { color: opts._gridColor },
          ticks: { color: opts._textColor, backdropColor: 'transparent' },
        },
      },
      plugins: {
        ...opts.plugins,
        legend: { ...opts.plugins.legend, display: true, position: 'right' },
      },
    },
  }),

  pie: (data, colors, opts) => ({
    type: 'pie',
    data: {
      labels: data.labels,
      datasets: [{
        ...data.datasets[0],
        backgroundColor: data.labels.map((_, i) => colors[i % colors.length] + 'CC'),
        borderColor: data.labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 2,
        hoverOffset: 10,
      }],
    },
    options: {
      ...opts,
      scales: {},
      plugins: {
        ...opts.plugins,
        legend: { ...opts.plugins.legend, display: true, position: 'right' },
      },
    },
  }),

  waterfall: (data, colors, opts, orientation) => {
    const isHorizontal = orientation === 'horizontal';
    const posColor = colors[0] + 'CC';
    const negColor = colors[1] ? colors[1] + 'CC' : '#EF444480';
    const totalColor = colors[2] ? colors[2] + 'CC' : colors[0] + '80';
    const lastIdx = data.datasets[0].data.length - 1;
    return {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Value',
          data: data.datasets[0].data,
          backgroundColor: data.datasets[0].data.map(([b, t], i) => {
            if (i === lastIdx) return totalColor;
            return t >= b ? posColor : negColor;
          }),
          borderColor: data.datasets[0].data.map(([b, t], i) => {
            if (i === lastIdx) return colors[2] || colors[0];
            return t >= b ? colors[0] : (colors[1] || '#EF4444');
          }),
          borderWidth: 1.5,
          borderRadius: 3,
        }],
      },
      options: {
        ...opts,
        ...(isHorizontal ? { indexAxis: 'y' } : {}),
        plugins: {
          ...opts.plugins,
          legend: { display: false },
          tooltip: {
            ...opts.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                const [b, t] = ctx.raw;
                const delta = t - b;
                return `${delta >= 0 ? '+' : ''}${delta.toFixed(0)} (${t.toFixed(0)})`;
              },
            },
          },
        },
      },
    };
  },

  'step-line': (data, colors, opts) => ({
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length] + '18',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: colors[i % colors.length],
        stepped: true,
        fill: false,
      })),
    },
    options: opts,
  }),

  heatmap: (data, colors, opts) => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    // Build a two-stop gradient from the first palette color (light→saturated)
    const base = colors[0] || '#4F46E5';
    return {
      type: 'matrix',
      data: {
        datasets: [{
          label: 'Value',
          data: data.datasets[0].data,
          backgroundColor(ctx) {
            const v = ctx.dataset.data[ctx.dataIndex]?.v ?? 0;
            const alpha = (v / 100).toFixed(2);
            return base + Math.round(parseFloat(alpha) * 255).toString(16).padStart(2, '0');
          },
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          borderWidth: 2,
          width: ({ chart }) => (chart.chartArea?.width  || 300) / (new Set(data.datasets[0].data.map(d => d.x)).size)  - 2,
          height: ({ chart }) => (chart.chartArea?.height || 200) / (new Set(data.datasets[0].data.map(d => d.y)).size) - 2,
        }],
      },
      options: {
        ...opts,
        scales: {
          x: {
            type: 'category',
            labels: [...new Set(data.datasets[0].data.map(d => d.x))],
            grid: { display: false },
            ticks: { color: opts._textColor, font: { family: 'Inter', size: 10 } },
          },
          y: {
            type: 'category',
            labels: [...new Set(data.datasets[0].data.map(d => d.y))],
            grid: { display: false },
            ticks: { color: opts._textColor, font: { family: 'Inter', size: 10 } },
          },
        },
        plugins: {
          ...opts.plugins,
          legend: { display: false },
          tooltip: {
            ...opts.plugins.tooltip,
            callbacks: {
              title: (items) => `${items[0]?.raw?.x} / ${items[0]?.raw?.y}`,
              label: (ctx) => `Value: ${ctx.raw.v}`,
            },
          },
        },
      },
    };
  },
};

// ─── Public API ─────────────────────────────────────────────────────
export function createChartConfig(chartType, data, colors, options = {}) {
  const { animate = true, orientation = 'vertical' } = options;
  const baseOptions = getBaseOptions(data, animate);
  const builder = configBuilders[chartType] || configBuilders['grouped-bar'];
  return builder(data, colors, baseOptions, orientation);
}

export function renderChart(canvas, chartType, data, colors, options = {}) {
  const existingChart = Chart.getChart(canvas);
  if (existingChart) existingChart.destroy();

  const config = createChartConfig(chartType, data, colors, options);
  return new Chart(canvas, config);
}
