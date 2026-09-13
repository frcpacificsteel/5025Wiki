<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const visible = ref(true)
let timer: number | undefined
let revealTimer: number | undefined

onMounted(() => {
  document.documentElement.classList.add('wiki-initial-loading')

  const finish = () => {
    const delay = 1750 + Math.random() * 830
    timer = window.setTimeout(() => {
      visible.value = false
      revealTimer = window.setTimeout(() => {
        const root = document.documentElement
        root.classList.remove('wiki-initial-loading')
        root.classList.add('wiki-initial-reveal')
        window.dispatchEvent(new CustomEvent('wiki-loader-complete'))
        window.setTimeout(() => root.classList.remove('wiki-initial-reveal'), 1200)
      }, 260)
    }, delay)
  }

  if (document.readyState === 'complete') finish()
  else window.addEventListener('load', finish, { once: true })
})

onBeforeUnmount(() => {
  window.clearTimeout(timer)
  window.clearTimeout(revealTimer)
  document.documentElement.classList.remove('wiki-initial-loading', 'wiki-initial-reveal')
})
</script>

<template>
  <Transition name="wiki-loader-fade">
    <div v-if="visible" class="wiki-loader" role="status" aria-live="polite">
      <span class="wiki-loader__mark-shell" aria-hidden="true">
        <img class="wiki-loader__mark" src="/assets/logo-icon.svg" alt="" />
        <span class="wiki-loader__shine"></span>
      </span>
      <span class="sr-only">Loading the Pacific Steel 5025 Wiki</span>
    </div>
  </Transition>
</template>
