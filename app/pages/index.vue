<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { Channel } from '#shared/types'

useSeoMeta({
  title: 'Worldwide TV',
  description: 'TV channel logos and TV guides, under one channel ID.'
})

const q = ref('')
const query = refDebounced(q, 300)
const { data, status } = await useFetch<{ count: number, channels: Channel[] }>('/api/channels', {
  query: { q: query, limit: 24 },
  default: () => ({ count: 0, channels: [] })
})
</script>

<template>
  <UContainer class="py-12 space-y-8">
    <div class="space-y-2">
      <h1 class="text-4xl font-bold">
        Worldwide TV
      </h1>
      <p class="text-lg text-muted">
        TV channel logos and TV guides, under one channel ID.
      </p>
    </div>

    <UInput
      id="search"
      v-model="q"
      icon="i-lucide-search"
      size="xl"
      placeholder="Search a channel"
      class="w-full max-w-xl"
      :loading="status === 'pending'"
    />

    <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
      <UCard v-for="c in data.channels" :key="c.id">
        <div class="aspect-video rounded-md bg-tile-dark grid place-items-center p-4">
          <img v-if="c.logo_white || c.logo" :src="(c.logo_white || c.logo)!" :alt="c.name" class="max-h-full max-w-full" loading="lazy">
          <span v-else class="text-muted">No logo yet</span>
        </div>
        <p class="mt-3 font-semibold">
          {{ c.name }}
        </p>
        <p class="text-sm text-muted">
          {{ c.country.toUpperCase() }} · <code>{{ c.id }}</code>
        </p>
      </UCard>
    </div>
  </UContainer>
</template>
