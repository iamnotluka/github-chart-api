'use client';

import { useEffect, useMemo, useState } from 'react';

type Shape = 'square' | 'circle' | 'rounded';

interface Opts {
  user: string;
  color: string;
  shape: Shape;
  density: number;
  radius: number;
}

const DEFAULTS: Opts = {
  user: 'iamnotluka',
  color: '24292f',
  shape: 'rounded',
  density: 7,
  radius: 2,
};

const REPO_OWNER = 'iamnotluka';
const REPO_NAME = 'github-chart-api';
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

export default function Home() {
  const [opts, setOpts] = useState<Opts>(DEFAULTS);
  const [debouncedUser, setDebouncedUser] = useState(opts.user);
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);
  const [colorText, setColorText] = useState(DEFAULTS.color);
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && typeof d.stargazers_count === 'number') {
          setStars(d.stargazers_count);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedUser(opts.user.trim()), 500);
    return () => clearTimeout(t);
  }, [opts.user]);

  useEffect(() => {
    setColorText(opts.color);
  }, [opts.color]);

  const query = useMemo(() => {
    const sp = new URLSearchParams({
      user: debouncedUser,
      color: opts.color,
      shape: opts.shape,
      density: String(opts.density),
      radius: String(opts.radius),
    });
    return sp.toString();
  }, [debouncedUser, opts.color, opts.shape, opts.density, opts.radius]);

  const previewUrl = `/api/chart?${query}`;
  const embedUrl = origin ? `${origin}/api/chart?${query}` : '';
  const embedSnippet = embedUrl
    ? `<img src="${embedUrl}" alt="${debouncedUser} GitHub contributions" />`
    : '';

  function set<K extends keyof Opts>(key: K, value: Opts[K]) {
    setOpts((o) => ({ ...o, [key]: value }));
  }

  function handleColorText(v: string) {
    setColorText(v);
    const c = v.replace(/^#/, '').toLowerCase();
    if (/^[0-9a-f]{6}$/.test(c)) set('color', c);
  }

  async function copy() {
    if (!embedSnippet) return;
    await navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
              </svg>
            </div>
            <span className="brand-name">GitHub Chart API</span>
          </div>
          <div className="topbar-spacer" />
          <a className="star-btn" href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="Star on GitHub">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            <span>Star</span>
            {stars !== null && <span className="star-count">{formatStars(stars)}</span>}
          </a>
        </div>
      </header>

      <main className="container">
        <section className="hero-section animate-fade-up delay-1">
          <div className="username-row">
              <span className="at" aria-hidden="true">@</span>
              <input
                className="username-input"
                value={opts.user}
                onChange={(e) => set('user', e.target.value)}
                placeholder="username"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>

            <div className="chart-stage">
              {debouncedUser ? (
                <img
                  key={query}
                  src={previewUrl}
                  alt={`${debouncedUser} contributions`}
                  className="chart-img"
                />
              ) : (
                <span className="empty">enter a github username</span>
              )}
            </div>
        </section>

        <section className="card soft animate-fade-up delay-2">
          <div className="card-body">
            <div className="grid">
              <Field label="Palette" value={`#${opts.color}`}>
                <div className="color-row">
                  <div className="color-swatch-wrap" style={{ background: `#${opts.color}` }}>
                    <input
                      type="color"
                      value={`#${opts.color}`}
                      onChange={(e) => set('color', e.target.value.slice(1))}
                      aria-label="color picker"
                    />
                  </div>
                  <input
                    className="input mono"
                    value={colorText}
                    onChange={(e) => handleColorText(e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </Field>

              <Field label="Shape" value={cap(opts.shape)}>
                <select
                  className="input"
                  value={opts.shape}
                  onChange={(e) => set('shape', e.target.value as Shape)}
                >
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                  <option value="circle">Circle</option>
                </select>
              </Field>

              <Field label="Density" value={String(opts.density)}>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={opts.density}
                  onChange={(e) => set('density', Number(e.target.value))}
                />
              </Field>

              {opts.shape === 'rounded' && (
                <Field label="Radius" value={String(opts.radius)}>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={opts.radius}
                    onChange={(e) => set('radius', Number(e.target.value))}
                  />
                </Field>
              )}
            </div>
          </div>
        </section>

        <div className="embed-row animate-fade-up">
          <code className="snippet">{embedSnippet || ' '}</code>
          <button className="btn btn-primary" onClick={copy} disabled={!embedSnippet}>
            {copied ? (
              <>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
                  <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
                </svg>
                Copy embed
              </>
            )}
          </button>
        </div>

        <p className="footer">
          built by <a href="https://github.com/iamnotluka" target="_blank" rel="noopener noreferrer">@iamnotluka</a>
        </p>
      </main>
    </>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">
        <span>{label}</span>
        {value !== undefined && <span className="value">{value}</span>}
      </span>
      {children}
    </label>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatStars(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k >= 10 ? Math.round(k) : k.toFixed(1)}k`;
}
