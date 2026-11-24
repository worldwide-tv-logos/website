import { z } from 'zod'

const query = z.object({
  guide: z.string().trim().min(1).max(200),
  source: z.string().trim().max(100).optional()
})

// The channels a TV guide ID belongs to (guides.json of the registry), best score first.
export default defineEventHandler(async (event) => {
  const { guide, source } = await getValidatedQuery(event, query.parse)
  const { channels, guides } = await getRegistry()
  const matches = []
  for (const [src, ids] of Object.entries(guides)) {
    if (source && src !== source) continue
    for (const candidate of ids[guide] ?? []) {
      const channel = channels.get(candidate.channel)
      if (channel) matches.push({ source: src, score: candidate.score, how: candidate.how, channel })
    }
  }
  matches.sort((a, b) => b.score - a.score)
  return { guide, matches }
})
