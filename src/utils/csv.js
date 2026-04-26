/**
 * CSV Import Utility
 */

export function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return null;

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const datasets = [];
  const labels = [];

  // First column = labels, rest = series
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 2) continue;
    labels.push(cols[0]);
  }

  for (let s = 1; s < headers.length; s++) {
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      data.push(parseFloat(cols[s]) || 0);
    }
    datasets.push({
      label: headers[s],
      data,
    });
  }

  return { labels, datasets };
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
