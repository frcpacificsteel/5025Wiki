<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const visible = ref(false)
let frame = 0

function update() {
  frame = 0
  visible.value = window.scrollY > Math.max(640, window.innerHeight * 0.75)
}

function onScroll() {
  if (!frame) frame = window.requestAnimationFrame(update)
}

function backToTop() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (frame) window.cancelAnimationFrame(frame)
})
</script>

<template>
  <Transition name="back-to-top">
    <button v-if="visible" class="back-to-top" type="button" aria-label="Back to top" @click="backToTop">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 14 6-6 6 6" />
      </svg>
    </button>
  </Transition>
</template>
