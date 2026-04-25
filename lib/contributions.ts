export type Level = 0 | 1 | 2 | 3 | 4;

export interface Day {
  date: string;
  level: Level;
}

export async function fetchContributions(username: string): Promise<Day[]> {
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    throw new Error('invalid username');
  }
  const res = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; github-chart-api-prototype; +https://github.com)',
      Accept: 'text/html',
    },
  });
  if (!res.ok) {
    throw new Error(`github responded ${res.status}`);
  }
  const html = await res.text();
  const days = parseContributions(html);
  if (days.length === 0) {
    throw new Error('could not parse contributions — markup may have changed');
  }
  return days;
}

export function parseContributions(html: string): Day[] {
  const byDate = new Map<string, Day>();

  const reA =
    /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*\bdata-level="([0-4])"/g;
  for (let m: RegExpExecArray | null; (m = reA.exec(html)); ) {
    byDate.set(m[1], { date: m[1], level: Number(m[2]) as Level });
  }

  if (byDate.size === 0) {
    const reB =
      /<td\b[^>]*\bdata-level="([0-4])"[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"/g;
    for (let m: RegExpExecArray | null; (m = reB.exec(html)); ) {
      byDate.set(m[2], { date: m[2], level: Number(m[1]) as Level });
    }
  }

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}
