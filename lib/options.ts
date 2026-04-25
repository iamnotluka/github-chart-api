export type Shape = 'square' | 'circle' | 'rounded';

export interface ChartOptions {
  user: string;
  color: string;
  shape: Shape;
  density: number;
  radius: number;
}

const DEFAULTS: Omit<ChartOptions, 'user'> = {
  color: '24292f',
  shape: 'rounded',
  density: 7,
  radius: 2,
};

export function parseOptions(sp: URLSearchParams): ChartOptions {
  const user = (sp.get('user') ?? '').trim();
  const shape = oneOf<Shape>(sp.get('shape'), ['square', 'circle', 'rounded'], DEFAULTS.shape);
  return {
    user,
    color: cleanHex(sp.get('color')) ?? DEFAULTS.color,
    shape,
    density: clampInt(sp.get('density'), 1, 10, DEFAULTS.density),
    radius: clampInt(sp.get('radius'), 0, 10, DEFAULTS.radius),
  };
}

function cleanHex(v: string | null): string | null {
  if (!v) return null;
  const hex = v.replace(/^#/, '').toLowerCase();
  return /^[0-9a-f]{6}$/.test(hex) ? hex : null;
}

function clampInt(v: string | null, min: number, max: number, def: number): number {
  if (!v) return def;
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

function oneOf<T extends string>(v: string | null, allowed: readonly T[], def: T): T {
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : def;
}
