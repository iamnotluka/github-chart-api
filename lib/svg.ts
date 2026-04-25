import type { ChartOptions } from './options';
import type { Day, Level } from './contributions';
import { generatePalette } from './palette';

const CELL_SIZE = 11;

export function renderSvg(days: Day[], opts: ChartOptions): string {
  if (days.length === 0) return emptySvg();

  const palette = generatePalette(`#${opts.color}`);

  const firstDate = parseISO(days[0].date);
  const lastDate = parseISO(days[days.length - 1].date);

  // Anchor to the Sunday on or before first date so columns align cleanly.
  const anchor = new Date(firstDate);
  anchor.setUTCDate(anchor.getUTCDate() - anchor.getUTCDay());

  const totalDays =
    Math.floor((lastDate.getTime() - anchor.getTime()) / 86_400_000) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  const dayMap = new Map(days.map((d) => [d.date, d]));

  const gap = 10 - opts.density;
  const stride = CELL_SIZE + gap;
  const width = totalWeeks * stride - gap;
  const height = 7 * stride - gap;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
  );

  for (let w = 0; w < totalWeeks; w++) {
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(anchor);
      cellDate.setUTCDate(anchor.getUTCDate() + w * 7 + d);
      if (cellDate < firstDate || cellDate > lastDate) continue;
      const iso = cellDate.toISOString().slice(0, 10);
      const level: Level = (dayMap.get(iso)?.level ?? 0) as Level;
      const fill = palette[level];
      const x = w * stride;
      const y = d * stride;
      parts.push(cellShape(x, y, CELL_SIZE, fill, opts.shape, opts.radius));
    }
  }

  parts.push('</svg>');
  return parts.join('');
}

function cellShape(
  x: number,
  y: number,
  size: number,
  fill: string,
  shape: ChartOptions['shape'],
  radius: number,
): string {
  if (shape === 'circle') {
    const r = size / 2;
    return `<circle cx="${x + r}" cy="${y + r}" r="${r}" fill="${fill}"/>`;
  }
  const rx = shape === 'rounded' ? radius : 0;
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="${fill}"/>`;
}

function parseISO(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function emptySvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40"><rect width="160" height="40" fill="#ebedf0"/></svg>`;
}
