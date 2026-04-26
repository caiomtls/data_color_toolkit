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
} from 'chart.js';

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
  BoxAndWiskers
);

// ─── Chart Type Definitions ─────────────────────────────────────────
// 14 types organized in 7 categories based on FT Visual Vocabulary
// Charts that support H/V orientation toggle
export const ORIENTATION_SUPPORTED = new Set([
  'grouped-bar',
  'stacked-bar',
  'stacked-bar-100',
  'mixed',
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

  // ── Distribuição ──
  {
    id: 'box',
    titleKey: 'chart.box.title',
    descKey: 'chart.box.desc',
    category: 'distribution',
    icon: 'candlestick_chart',
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
  'multi-line':     { cols: [2, 30, 8],  series: [1, 8, 4] },
  'slope':          { cols: [2, 10, 5],  colsLabel: 'testing.dataPoints' },
  'mixed':          { cols: [2, 15, 7] },
  'stacked-area':   { cols: [2, 30, 7],  series: [1, 8, 4] },
  'stacked-bar':    { cols: [1, 30, 5],  series: [1, 8, 3] },
  'stacked-bar-100':{ cols: [1, 30, 5],  series: [2, 8, 3] },
  'donut':          { cols: [2, 12, 5],  colsLabel: 'testing.segments' },
  'box':            { cols: [1, 10, 4],  colsLabel: 'testing.groups' },
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
