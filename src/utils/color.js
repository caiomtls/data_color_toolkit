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

// ─── HSL → HEX helper ────────────────────────────────────────────────────────
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

// ─── Hue angular distance ─────────────────────────────────────────────────────
function hueDist(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * autoAdjustColors — applies data-vis best practices to a set of colors
 *
 * Rules applied:
 *  1. Hue redistribution — evenly space hues across the wheel (±45° per color
 *     slot) while anchoring each color within ±45° of its original hue family.
 *  2. Saturation normalization — pull saturation into the 55–75 % sweet spot
 *     (vivid but not garish).
 *  3. Lightness normalization — pull lightness into 42–62 % (readable on both
 *     white and dark backgrounds).
 *  4. Lightness alternation — give even-indexed colors slightly higher lightness
 *     (+8 %) and odd-indexed slightly lower (−8 %) so adjacent bars/slices
 *     are distinguishable even without color.
 *
 * @param {string[]} colors  Array of hex strings
 * @returns {{ adjusted: string[], report: object[] }}
 */
export function autoAdjustColors(colors) {
  const n = colors.length;
  if (n === 0) return { adjusted: [], report: [] };

  // --- Step 0: parse originals ---
  const origHsl = colors.map(hexToHsl);

  // --- Step 1: redistribute hues ---
  // Sort colors by their original hue to assign slots in order
  const indexed = origHsl.map((hsl, i) => ({ ...hsl, origIdx: i }));
  indexed.sort((a, b) => a.h - b.h);

  const idealStep = 360 / n;
  // Anchor the first color's slot to its own hue so we don't drift wildly
  const baseHue = indexed[0].h;

  const redistributed = indexed.map((c, slot) => {
    const idealHue = (baseHue + slot * idealStep) % 360;
    // Blend 60 % toward ideal, 40 % keep original — preserves color family
    const blended = (idealHue * 0.6 + c.h * 0.4) % 360;
    return { ...c, newH: Math.round(blended) };
  });

  // Restore original order
  redistributed.sort((a, b) => a.origIdx - b.origIdx);

  // --- Step 2 & 3: normalise S and L ---
  const S_MIN = 55, S_MAX = 75;
  const L_MIN = 42, L_MAX = 62;

  const normalised = redistributed.map((c) => {
    const newS = Math.min(S_MAX, Math.max(S_MIN, c.s));
    const newL = Math.min(L_MAX, Math.max(L_MIN, c.l));
    return { ...c, newS, newL };
  });

  // --- Step 4: lightness alternation (±8 %) ---
  const ALTERNATION = 8;
  const adjusted = normalised.map((c, i) => {
    const offset = (i % 2 === 0) ? +ALTERNATION : -ALTERNATION;
    const finalL = Math.min(70, Math.max(35, c.newL + offset));
    return {
      origIdx: c.origIdx,
      origColor: colors[c.origIdx],
      origHsl: { h: c.h, s: c.s, l: c.l },
      newH: c.newH,
      newS: c.newS,
      newL: finalL,
      hex: hslToHex(c.newH, c.newS, finalL),
    };
  });

  // Sort back by original index (already is, but be safe)
  adjusted.sort((a, b) => a.origIdx - b.origIdx);

  return {
    adjusted: adjusted.map((c) => c.hex),
    report: adjusted.map((c) => ({
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
