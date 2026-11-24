import { z } from 'zod'

const query = z.object({
  q: z.string().trim().max(100).optional(),
  country: z.string().regex(/^[a-z]{2}$/).optional(),
  status: z.enum(['active', 'closed', 'merged']).default('active'),
  limit: z.coerce.number().int().min(1).max(200).default(50)
})

// Channels of the registry, by name (or alias) and country: exact names first, then names starting with the
// query, then names containing it.
export default defineEventHandler(async (event) => {
  const { q, country, status, limit } = await getValidatedQuery(event, query.parse)
  const { channels } = await getRegistry()
  const key = q ? searchKey(q) : ''
  const found = []
  for (const c of channels.values()) {
    if (c.status !== status || (country && c.country !== country)) continue
    let rank = 0
    if (key) {
      const keys = [c.name, ...(c.aliases ?? [])].map(searchKey)
      rank = keys.includes(key) ? 0 : keys.some(k => k.startsWith(key)) ? 1 : keys.some(k => k.includes(key)) ? 2 : -1
      if (rank < 0) continue
    }
    found.push({ rank, channel: c })
  }
  found.sort((a, b) => a.rank - b.rank || a.channel.name.localeCompare(b.channel.name))
  const list = found.slice(0, limit).map(f => f.channel)
  return { count: list.length, total: found.length, channels: list }
})
