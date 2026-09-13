<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()

function toggleAppearance() {
  isDark.value = !isDark.value
}
</script>

<template>
  <section class="wiki-mobile-actions" aria-label="Wiki settings and links">
    <button type="button" class="wiki-mobile-actions__appearance" role="switch" :aria-checked="isDark" :aria-label="`Switch to ${isDark ? 'light' : 'dark'} appearance`" @click="toggleAppearance">
      <span>Appearance</span>
      <span class="wiki-mobile-actions__switch" :class="{ 'is-dark': isDark }" aria-hidden="true">
        <span></span>
      </span>
    </button>
    <a href="https://github.com/frcpacificsteel/5025Wiki" target="_blank" rel="noopener">
      <span>GitHub repository</span>
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z" /></svg>
    </a>
  </section>
</template>
