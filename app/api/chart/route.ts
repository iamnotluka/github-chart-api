import { parseOptions } from '@/lib/options';
import { fetchContributions } from '@/lib/contributions';
import { renderSvg } from '@/lib/svg';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const opts = parseOptions(url.searchParams);

  if (!opts.user) {
    return new Response('user query parameter is required', { status: 400 });
  }

  try {
    const days = await fetchContributions(opts.user);
    const svg = renderSvg(days, opts);
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    return new Response(`error: ${msg}`, { status: 502 });
  }
}
