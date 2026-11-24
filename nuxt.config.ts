// Website and API of worldwide-tv (Vercel). The data comes from the other repositories of the organisation:
// - database: channel registry and logos (channels.json, guides.json, logos/<id>.png), on GitHub Pages;
// - epg: TV guides (<country>.xml.gz, <channel id>/<day>.json, index.json), on GitHub Pages.
// Heavy files are never served by Vercel: /logos/** and /epg/** redirect to GitHub Pages.
const registryUrl = process.env.NUXT_REGISTRY_URL || 'https://worldwide-tv-logos.github.io/database'
const epgUrl = process.env.NUXT_EPG_URL || 'https://worldwide-tv-logos.github.io/epg'

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  colorMode: { preference: 'dark' },

  runtimeConfig: {
    registryUrl,
    epgUrl
  },

  routeRules: {
    '/logos/**': { redirect: { to: `${registryUrl}/logos/**`, statusCode: 302 } },
    '/epg/**': { redirect: { to: `${epgUrl}/**`, statusCode: 302 } },
    // the registry changes a few times a day, the guides every 6 hours
    '/api/channels/**': { cache: { maxAge: 600, swr: true } },
    '/api/lookup': { cache: { maxAge: 600, swr: true } },
    '/api/epg/**': { cache: { maxAge: 1800, swr: true } }
  },

  compatibilityDate: '2026-06-30'
})
