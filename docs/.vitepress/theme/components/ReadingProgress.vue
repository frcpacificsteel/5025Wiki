<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const progress = ref(0)
const visible = ref(false)
const top = ref(63)
let frame = 0

function updateProgress() {
  frame = 0
  const root = document.documentElement
  const available = root.scrollHeight - window.innerHeight
  const localNav = document.querySelector<HTMLElement>('.VPLocalNav')
  const mainNav = document.querySelector<HTMLElement>('.VPNavBar')
  const localBottom = localNav && getComputedStyle(localNav).display !== 'none'
    ? localNav.getBoundingClientRect().bottom
    : 0
  const mainBottom = mainNav && getComputedStyle(mainNav).display !== 'none'
    ? mainNav.getBoundingClientRect().bottom
    : 0

  progress.value = available > 0 ? Math.min(window.scrollY / available, 1) : 0
  visible.value = progress.value > 0.035 && progress.value < 0.995
  top.value = Math.max(0, (localBottom > 0 ? localBottom : mainBottom) - 1)
}

function queueUpdate() {
  if (!frame) frame = window.requestAnimationFrame(updateProgress)
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', queueUpdate, { passive: true })
  window.addEventListener('resize', queueUpdate, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', queueUpdate)
  window.removeEventListener('resize', queueUpdate)
  if (frame) window.cancelAnimationFrame(frame)
})
</script>

<template>
  <div class="reading-progress" :class="{ 'is-visible': visible }" :style="{ top: `${top}px` }" aria-hidden="true">
    <span :style="{ transform: `scaleX(${progress})` }"></span>
  </div>
</template>
