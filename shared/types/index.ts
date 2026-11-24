// Records published by the data repositories (database: channels.json, guides.json; epg: <id>/<day>.json).

export interface Channel {
  id: string
  slug: string
  name: string
  country: string
  status: 'active' | 'closed' | 'merged'
  parent: string | null
  website: string | null
  iptv: string | null
  wikidata: string | null
  logo: string | null
  logo_white: string | null
  logo_from: string | null
  aliases?: string[]
}

export interface GuideCandidate {
  channel: string
  score: number
  how: string
}

export interface Programme {
  start: string
  stop?: string
  title: string
  subtitle?: string
  desc?: string
  categories?: string[]
  episode?: string
  icon?: string
}

export interface ChannelDay {
  channel: string
  date: string
  programmes: Programme[]
}
