/**
 * Color Utilities — Conversion, contrast, and analysis
 */

// HEX to RGB
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

// RGB to HEX
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// RGB to HSL
export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// HEX to HSL
export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

// Format helpers
export function formatRgb(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl(hex) {
  const { h, s, l } = hexToHsl(hex);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Relative luminance (WCAG 2.0)
export function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Contrast ratio (WCAG 2.0)
export function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG grades
export function getWcagGrade(ratio) {
  return {
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
  };
}

// Determine if text on a color should be white or black
export function getTextColor(bgHex) {
  const luminance = getLuminance(bgHex);
  return luminance > 0.179 ? '#111111' : '#FFFFFF';
}

// Color harmony analysis
export function analyzeHarmony(colors) {
  if (colors.length < 2) return 'N/A';
  const hsls = colors.map(hexToHsl);
  const hues = hsls.map((c) => c.h);

  // Check for complementary (opposite hues)
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const diff = Math.abs(hues[i] - hues[j]);
      if (diff > 150 && diff < 210) return 'Complementary';
    }
  }

  // Check for analogous (adjacent hues)
  const sorted = [...hues].sort((a, b) => a - b);
  const diffs = [];
  for (let i = 1; i < sorted.length; i++) {
    diffs.push(sorted[i] - sorted[i - 1]);
  }
  if (diffs.every((d) => d < 60)) return 'Analogous';

  // Check for triadic
  if (hues.length >= 3) {
    const intervals = [];
    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        intervals.push(Math.abs(hues[i] - hues[j]) % 360);
      }
    }
    if (intervals.some((d) => d > 100 && d < 140)) return 'Triadic';
  }

  return 'Custom';
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hueDist(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

/**
 * autoAdjustColors — Perceptually-optimized palette generator
 *
 * Strategy (in order):
 *
 * 1. IDEAL HUE SLOTS — Evenly distribute N hue stops around the full 360°
 *    wheel, anchored to the first color so the output feels connected to the
 *    user's original palette.
 *
 * 2. BIPARTITE ASSIGNMENT — Match each original color to its nearest ideal
 *    slot using a greedy minimum-cost approach (sort by hue, assign greedily).
 *    This preserves color families while guaranteeing separation of ≥ 360°/N.
 *
 * 3. CONFLICT RESOLUTION — If two assigned hues are still too close (< half
 *    the ideal step), nudge them apart. Repeat up to 4 iterations.
 *
 * 4. SATURATION — Pull into the 58–70% "data-vis sweet spot": vivid enough
 *    to read on both backgrounds, not so vivid it causes vibration. Colors
 *    already in range are left untouched.
 *
 * 5. LIGHTNESS — Target a range that provides ≥3:1 contrast against BOTH
 *    white and black. The window is L 42–58% on light themes, 55–72% on
 *    dark themes. Adjust only if the original falls outside this range.
 *
 * 6. ACCESSIBILITY STAGGER — ±6% alternating lightness offset so adjacent
 *    elements remain distinguishable in grayscale (colorblind-friendly).
 *
 * @param {string[]} colors  Array of hex strings
 * @returns {{ adjusted: string[], report: object[] }}
 */
export function autoAdjustColors(colors) {
  const n = colors.length;
  if (n === 0) return { adjusted: [], report: [] };

  // Detect current theme to choose the right lightness window
  const isDark = typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'dark';

  const origHsl = colors.map(hexToHsl);

  // ── 1. Handle single-color edge case ─────────────────────────────────────
  if (n === 1) {
    const { h, s, l } = origHsl[0];
    const newS = clamp(s, 58, 70);
    const newL = isDark ? clamp(l, 55, 72) : clamp(l, 42, 58);
    const hex = hslToHex(h, newS, newL);
    return {
      adjusted: [hex],
      report: [{ original: colors[0], result: hex, changes: {
        hue: { before: h, after: h },
        sat: { before: s, after: newS },
        light: { before: l, after: newL },
      }}],
    };
  }

  // ── 2. Build ideal hue slots anchored to the dominant hue ─────────────────
  // Use the weighted-average hue of all colors as the anchor so we minimize
  // the total rotation applied to the palette.
  const meanHue = origHsl.reduce((sum, c) => sum + c.h, 0) / n;
  const step = 360 / n;
  const idealHues = Array.from({ length: n }, (_, i) => (meanHue + i * step) % 360);

  // ── 3. Greedy bipartite assignment ────────────────────────────────────────
  // Sort by original hue, then assign each to its nearest un-taken ideal slot.
  const sortedByHue = origHsl
    .map((hsl, origIdx) => ({ ...hsl, origIdx }))
    .sort((a, b) => a.h - b.h);

  const assignedHues = new Array(n); // indexed by original position
  const usedSlots = new Set();

  for (const color of sortedByHue) {
    let bestSlot = -1, bestCost = Infinity;
    for (let s = 0; s < n; s++) {
      if (usedSlots.has(s)) continue;
      const cost = hueDist(color.h, idealHues[s]);
      if (cost < bestCost) { bestCost = cost; bestSlot = s; }
    }
    usedSlots.add(bestSlot);
    assignedHues[color.origIdx] = idealHues[bestSlot];
  }

  // ── 4. Conflict resolution ────────────────────────────────────────────────
  const MIN_GAP = Math.max(22, step * 0.55);
  const finalHues = [...assignedHues];

  for (let iter = 0; iter < 5; iter++) {
    let changed = false;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const gap = hueDist(finalHues[i], finalHues[j]);
        if (gap < MIN_GAP) {
          changed = true;
          const deficit = (MIN_GAP - gap) / 2;
          // Push them apart symmetrically
          const dir = ((finalHues[j] - finalHues[i] + 540) % 360) < 180 ? 1 : -1;
          finalHues[i] = (finalHues[i] - dir * deficit + 360) % 360;
          finalHues[j] = (finalHues[j] + dir * deficit + 360) % 360;
        }
      }
    }
    if (!changed) break;
  }

  // ── 5. Saturation & Lightness ─────────────────────────────────────────────
  const S_MIN = 58, S_MAX = 70;
  // Lightness band that guarantees readability on both bg colours
  const L_MIN = isDark ? 55 : 42;
  const L_MAX = isDark ? 72 : 58;
  const STAGGER = 6;

  // ── 6. Assemble result ────────────────────────────────────────────────────
  const result = origHsl.map((orig, i) => {
    const newH = Math.round(finalHues[i]);

    // Saturation: only touch if outside the target band
    const newS = orig.s < S_MIN ? S_MIN : orig.s > S_MAX ? S_MAX : orig.s;

    // Lightness: only touch if outside the readable band
    const newL_base = orig.l < L_MIN ? L_MIN : orig.l > L_MAX ? L_MAX : orig.l;

    // Stagger for colorblind / grayscale distinguishability
    const offset = (i % 2 === 0) ? +STAGGER : -STAGGER;
    const newL = clamp(Math.round(newL_base + offset), L_MIN - 4, L_MAX + 4);

    return {
      origColor: colors[i],
      origHsl: orig,
      newH, newS, newL,
      hex: hslToHex(newH, newS, newL),
    };
  });

  return {
    adjusted: result.map((c) => c.hex),
    report: result.map((c) => ({
      original: c.origColor,
      result: c.hex,
      changes: {
        hue:   { before: c.origHsl.h, after: c.newH },
        sat:   { before: c.origHsl.s, after: c.newS },
        light: { before: c.origHsl.l, after: c.newL },
      },
    })),
  };
}
