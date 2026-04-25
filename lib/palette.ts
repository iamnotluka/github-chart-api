export type Palette = readonly [string, string, string, string, string];

export function generatePalette(baseHex: string): Palette {
  const base = normalizeHex(baseHex);
  return [
    '#ebedf0',
    lighten(base, 0.3),
    lighten(base, 0.15),
    base,
    darken(base, 0.7),
  ] as const;
}

function normalizeHex(hex: string): string {
  return hex.startsWith('#') ? hex : `#${hex}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + 255 * amount, g + 255 * amount, b + 255 * amount);
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * amount, g * amount, b * amount);
}
