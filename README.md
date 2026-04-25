# GitHub Chart API

<img src="https://github-chart-api.vercel.app/api/chart?user=iamnotluka&color=24292f&shape=rounded&density=7&radius=2" alt="iamnotluka GitHub contributions" />

A customizable GitHub contribution chart as an embeddable SVG.

**→ https://github-chart-api.vercel.app/**

Open the configurator, type a username, tweak the look, click **Copy embed**, paste it anywhere HTML is rendered (including GitHub READMEs).

## Customize via query params

| Param     | Type                              | Default    | Description                                               |
| --------- | --------------------------------- | ---------- | --------------------------------------------------------- |
| `user`    | string (required)                 | —          | GitHub username                                           |
| `color`   | hex (no `#`, 6 chars)             | `24292f`   | Base color — a 5-shade palette is generated from this     |
| `shape`   | `square` \| `circle` \| `rounded` | `rounded`  | Cell shape                                                |
| `density` | int 1–10                          | `7`        | How tightly cells pack (10 = touching, 1 = airy)          |
| `radius`  | int 0–10                          | `2`        | Corner radius — only applies when `shape=rounded`         |

### Examples

GitHub-green circles, packed tight:

<img src="https://github-chart-api.vercel.app/api/chart?user=iamnotluka&color=39d353&shape=circle&density=10&radius=2" alt="contributions" />

```html
<img src="https://github-chart-api.vercel.app/api/chart?user=iamnotluka&color=39d353&shape=circle&density=10&radius=2" alt="contributions" />
```

Pure black-and-white squares, airy spacing:

<img src="https://github-chart-api.vercel.app/api/chart?user=iamnotluka&color=24292f&shape=square&density=4&radius=2" alt="contributions" />

```html
<img src="https://github-chart-api.vercel.app/api/chart?user=iamnotluka&color=24292f&shape=square&density=4&radius=2" alt="contributions" />
```

Indigo rounded, default density:

<img src="https://github-chart-api.vercel.app/api/chart?user=iamnotluka&color=4f46e5&shape=rounded&density=7&radius=4" alt="contributions" />

```html
<img src="https://github-chart-api.vercel.app/api/chart?user=iamnotluka&color=4f46e5&shape=rounded&density=7&radius=4" alt="contributions" />
```

## See it live

Embedded on my personal site: **[www.zoricl.io](https://www.zoricl.io)**

## License

MIT — see [LICENSE](./LICENSE).
