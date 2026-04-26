/**
 * Export Utilities — Generate exportable code formats
 */

import { hexToRgb, hexToHsl } from './color.js';

export function toPythonDict(colors) {
  const entries = colors.map((c, i) => `    "color_${i + 1}": "${c}"`);
  return `colors = {\n${entries.join(',\n')}\n}`;
}

export function toPythonList(colors) {
  return `colors = [${colors.map((c) => `"${c}"`).join(', ')}]`;
}

export function toJson(colors) {
  const obj = {};
  colors.forEach((c, i) => {
    obj[`color_${i + 1}`] = c;
  });
  return JSON.stringify(obj, null, 2);
}

export function toJsonArray(colors) {
  return JSON.stringify(colors, null, 2);
}

export function toCssVariables(colors) {
  const vars = colors.map((c, i) => `  --chart-color-${i + 1}: ${c};`);
  return `:root {\n${vars.join('\n')}\n}`;
}

export function toHexList(colors) {
  return colors.join('\n');
}

export function toRgbList(colors) {
  return colors
    .map((c) => {
      const { r, g, b } = hexToRgb(c);
      return `rgb(${r}, ${g}, ${b})`;
    })
    .join('\n');
}

export function toHslList(colors) {
  return colors
    .map((c) => {
      const { h, s, l } = hexToHsl(c);
      return `hsl(${h}, ${s}%, ${l}%)`;
    })
    .join('\n');
}

export function toScssVariables(colors) {
  const vars = colors.map((c, i) => `$chart-color-${i + 1}: ${c};`);
  return vars.join('\n');
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}
