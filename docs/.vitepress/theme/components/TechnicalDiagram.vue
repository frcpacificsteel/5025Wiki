<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  type: 'beginner-loop' | 'scheduler' | 'pose' | 'test-layers'
  label: string
}>()

const sources = {
  'beginner-loop': `flowchart TD
    A[Driver input] --> B[Trigger and command]
    B --> C[Subsystem goal]
    C --> D[Controller output]
    D --> E[Motor and mechanism]
    E --> F[Sensor measurement]
    F --> C
    C --> G[Telemetry]`,
  scheduler: `sequenceDiagram
    participant R as Robot loop
    participant S as Scheduler
    participant T as Triggers
    participant C as Commands
    participant Sub as Subsystems
    R->>S: run()
    S->>T: poll
    T-->>S: schedule requests
    S->>C: initialize / execute / end
    S->>Sub: periodic`,
  pose: `flowchart LR
    W[Wheel positions] --> E[Pose estimator]
    G[Gyro heading] --> E
    V[Vision pose and timestamp] --> Q[Quality checks]
    Q --> E
    E --> P[Estimated Pose2d]`,
  'test-layers': `flowchart TD
    A[Pure unit test] --> B[Subsystem with fake IO]
    B --> C[WPILib simulation]
    C --> D[Robot disabled checks]
    D --> E[Constrained enabled test]
    E --> F[Full-system validation]`
} as const

const connections: Partial<Record<typeof props.type, string[][]>> = {
  'beginner-loop': [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'], ['F', 'C'], ['C', 'G']],
  pose: [['W', 'E'], ['G', 'E'], ['V', 'Q'], ['Q', 'E'], ['E', 'P']],
  'test-layers': [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F']]
}

function wireNodeHover(root: HTMLElement, pairs: string[][]) {
  const nodes = [...root.querySelectorAll<SVGGElement>('.node')]
  const findNode = (key: string) => nodes.find((node) => node.id.includes(`-${key}-`))

  nodes.forEach((node) => {
    const key = pairs.flat().find((candidate) => node.id.includes(`-${candidate}-`))
    if (!key) return

    node.addEventListener('pointerenter', () => {
      root.classList.add('has-node-focus')
      node.classList.add('is-hovered')
      const related = new Set(pairs.filter((pair) => pair.includes(key)).flat())
      related.forEach((candidate) => findNode(candidate)?.classList.add('is-related'))
      root.querySelectorAll<SVGPathElement>('path.flowchart-link').forEach((edge) => {
        if (edge.id.includes(`_${key}_`)) edge.classList.add('is-related-edge')
      })
    })

    node.addEventListener('pointerleave', () => {
      root.classList.remove('has-node-focus')
      nodes.forEach((candidate) => candidate.classList.remove('is-hovered', 'is-related'))
      root.querySelectorAll('path.flowchart-link').forEach((edge) => edge.classList.remove('is-related-edge'))
    })
  })
}

const diagram = ref<HTMLElement | null>(null)
const error = ref(false)
let observer: MutationObserver | undefined
let version = 0

async function render() {
  if (!diagram.value) return
  const current = ++version
  const dark = document.documentElement.classList.contains('dark')
  const { default: mermaid } = await import('mermaid')

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    flowchart: { curve: 'basis', htmlLabels: true, nodeSpacing: 28, rankSpacing: 36, useMaxWidth: true },
    themeVariables: dark
      ? { background: '#111c22', primaryColor: '#152229', primaryTextColor: '#f5f7f8', primaryBorderColor: '#5e7b89', lineColor: '#a6b7c0', fontSize: '15px', fontFamily: 'Encode Sans, system-ui, sans-serif' }
      : { background: '#ffffff', primaryColor: '#ffffff', primaryTextColor: '#17232c', primaryBorderColor: '#91a5af', lineColor: '#506b79', fontSize: '15px', fontFamily: 'Encode Sans, system-ui, sans-serif' }
  })

  try {
    const { svg } = await mermaid.render(`technical-diagram-${props.type}-${current}`, sources[props.type])
    if (current === version && diagram.value) {
      diagram.value.innerHTML = svg
      wireNodeHover(diagram.value, connections[props.type] ?? [])
    }
    error.value = false
  } catch {
    if (current === version) error.value = true
  }
}

onMounted(() => {
  void render()
  observer = new MutationObserver(() => void render())
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  version += 1
})
</script>

<template>
  <figure class="technical-diagram">
    <div ref="diagram" role="img" :aria-label="label"></div>
    <p v-if="error" role="status">The diagram could not be rendered.</p>
  </figure>
</template>
