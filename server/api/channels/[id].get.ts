// One channel of the registry, with its editions.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const { channels } = await getRegistry()
  const channel = channels.get(id)
  if (!channel) throw createError({ statusCode: 404, statusMessage: `No channel ${id}` })
  const editions = [...channels.values()].filter(c => c.parent === id && c.status === 'active')
  return { channel, editions }
})
