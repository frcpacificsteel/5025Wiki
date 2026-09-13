<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const visible = ref(true)
let timer: number | undefined

onMounted(() => {
  const finish = () => {
    const delay = 1750 + Math.random() * 830
    timer = window.setTimeout(() => { visible.value = false }, delay)
  }

  if (document.readyState === 'complete') finish()
  else window.addEventListener('load', finish, { once: true })
})

onBeforeUnmount(() => window.clearTimeout(timer))
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
