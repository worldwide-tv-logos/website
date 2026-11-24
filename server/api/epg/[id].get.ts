import { z } from 'zod'
import type { ChannelDay } from '#shared/types'

const query = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
})

// Programmes of one channel for one UTC day (today by default), read from the epg repository.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^ch_[0-9a-z]{10}$/.test(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid channel ID' })
  const { date = new Date().toISOString().slice(0, 10) } = await getValidatedQuery(event, query.parse)
  const { epgUrl } = useRuntimeConfig()
  try {
    return await $fetch<ChannelDay>(`${epgUrl}/${id}/${date}.json`)
  } catch {
    throw createError({ statusCode: 404, statusMessage: `No guide for ${id} on ${date}` })
  }
})
