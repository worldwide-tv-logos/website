import type { Channel, GuideCandidate } from '#shared/types'

export interface Registry {
  channels: Map<string, Channel>
  guides: Record<string, Record<string, GuideCandidate[]>>
}

const MAX_AGE = 10 * 60 * 1000
let cached: { at: number, data: Promise<Registry> } | null = null

async function load(): Promise<Registry> {
  const { registryUrl } = useRuntimeConfig()
  const [channels, guides] = await Promise.all([
    $fetch<{ channels: Channel[] }>(`${registryUrl}/channels.json`),
    $fetch<{ guides: Record<string, Record<string, GuideCandidate[]>> }>(`${registryUrl}/guides.json`)
  ])
  return { channels: new Map(channels.channels.map(c => [c.id, c])), guides: guides.guides }
}

// The registry of worldwide-tv-logos/database, kept in memory for 10 minutes per server instance.
export function getRegistry(): Promise<Registry> {
  if (!cached || Date.now() - cached.at > MAX_AGE) {
    const data = load()
    cached = { at: Date.now(), data }
    data.catch(() => { cached = null })   // a failed download is retried at the next request
  }
  return cached.data
}

export function searchKey(value: string): string {
  return value.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
}
