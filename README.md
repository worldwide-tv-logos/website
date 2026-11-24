# worldwide-tv-website

Website and API of the organisation, on Vercel, under a single domain. It holds no data: it reads what the data
repositories publish on GitHub Pages.

| Repository | Publishes |
|---|---|
| [database](https://github.com/worldwide-tv-logos/database) | channel registry and logos: `channels.json`, `guides.json`, `logos/<id>.png` |
| [epg](https://github.com/worldwide-tv-logos/epg) | TV guides: `<country>.xml.gz`, `<channel id>/<YYYY-MM-DD>.json`, `index.json` |

## Routes

| Route | What |
|---|---|
| `/` | website: search a channel, its logo and its guide |
| `/api/channels?q=&country=&limit=` | registry channels by name or alias (exact names first) |
| `/api/channels/<id>` | one channel and its editions |
| `/api/lookup?guide=<guide id>&source=` | the channels a TV guide ID belongs to (best score first) |
| `/api/epg/<id>?date=YYYY-MM-DD` | programmes of a channel for one UTC day (today by default) |
| `/api/health` | `{"ok": true}` |
| `/logos/**` | redirected to the logos of `database` on GitHub Pages |
| `/epg/**` | redirected to the guides of `epg` on GitHub Pages |

Heavy files (logos, guides) are never served by Vercel: they are redirected to GitHub Pages. API answers are
cached (`routeRules` in `nuxt.config.ts`).

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build
```

Settings (environment variables): `NUXT_REGISTRY_URL` (database on GitHub Pages) and `NUXT_EPG_URL` (epg on
GitHub Pages); the defaults point at the current GitHub Pages addresses.

## Deployment

Vercel project linked to this repository (framework preset: Nuxt): every push to `main` is deployed, every pull
request gets a preview.
