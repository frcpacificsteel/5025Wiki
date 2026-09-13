<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const diagram = ref<HTMLElement | null>(null)
const error = ref(false)
let observer: MutationObserver | undefined
let compactQuery: MediaQueryList | undefined
let renderVersion = 0

const systems = [
  { name: 'Controls', href: '/systems/controls/' },
  { name: 'Vision', href: '/systems/vision/' },
  { name: 'Autonomous', href: '/systems/autonomous/' },
  { name: 'Drivetrain', href: '/systems/drivetrain/' },
  { name: 'Mechanisms', href: '/systems/mechanisms/' },
  { name: 'Telemetry', href: '/systems/telemetry/' },
  { name: 'Electrical & CAN', href: '/systems/electrical/' }
]

const source = String.raw`flowchart TB
  Controls["Controls"] --> Decision["Autonomous"]
  Vision["Vision"] --> Decision
  Decision --> Drivetrain["Drivetrain"]
  Decision --> Mechanisms["Mechanisms"]
  Drivetrain --> Telemetry["Telemetry"]
  Mechanisms --> Telemetry
  Telemetry -. informs the next decision .-> Decision
  Electrical["Electrical & CAN"] -. power and communication .-> Decision

  class Controls,Vision input
  class Decision logic
  class Drivetrain,Mechanisms output
  class Telemetry evidence
  class Electrical foundation`

const compactSource = String.raw`flowchart TB
  Controls["Controls"] --> Decision["Autonomous"]
  Vision["Vision"] --> Decision
  Decision --> Drivetrain["Drivetrain"]
  Decision --> Mechanisms["Mechanisms"]
  Drivetrain --> Telemetry["Telemetry"]
  Mechanisms --> Telemetry
  Telemetry -.-> Decision
  Electrical["Electrical & CAN"] -.-> Decision

  class Controls,Vision input
  class Decision logic
  class Drivetrain,Mechanisms output
  class Telemetry evidence
  class Electrical foundation`

const connections = [
  ['Controls', 'Decision'], ['Vision', 'Decision'], ['Decision', 'Drivetrain'],
  ['Decision', 'Mechanisms'], ['Drivetrain', 'Telemetry'], ['Mechanisms', 'Telemetry'],
  ['Telemetry', 'Decision'], ['Electrical', 'Decision']
]

function wireNodeHover(root: HTMLElement) {
  const nodes = [...root.querySelectorAll<SVGGElement>('.node')]
  const findNode = (key: string) => nodes.find((node) => node.id.includes(`-${key}-`))

  nodes.forEach((node) => {
    const key = connections.flat().find((candidate) => node.id.includes(`-${candidate}-`))
    if (!key) return

    node.addEventListener('pointerenter', () => {
      root.classList.add('has-node-focus')
      node.classList.add('is-hovered')
      const related = new Set(connections.filter((pair) => pair.includes(key)).flat())
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

async function render() {
  if (!diagram.value) return

  const version = ++renderVersion
  const dark = document.documentElement.classList.contains('dark')
  const { default: mermaid } = await import('mermaid')

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    flowchart: {
      curve: 'basis',
      htmlLabels: true,
      nodeSpacing: 34,
      rankSpacing: 42,
      useMaxWidth: true
    },
    themeVariables: dark
      ? {
          background: '#111c22', primaryColor: '#152229', primaryTextColor: '#f5f7f8',
          primaryBorderColor: '#34434b', lineColor: '#82939e', secondaryColor: '#152229',
          tertiaryColor: '#1a2931', fontFamily: 'Encode Sans, system-ui, sans-serif'
        }
      : {
          background: '#ffffff', primaryColor: '#f5f7f8', primaryTextColor: '#17232c',
          primaryBorderColor: '#d8e0e5', lineColor: '#82939e', secondaryColor: '#f5f7f8',
          tertiaryColor: '#eef7fb', fontFamily: 'Encode Sans, system-ui, sans-serif'
        }
  })

  const palette = dark
    ? `
      classDef input fill:#152229,stroke:#42606f,color:#f5f7f8;
      classDef logic fill:#123147,stroke:#55b8e6,color:#f5f7f8;
      classDef output fill:#152229,stroke:#42606f,color:#f5f7f8;
      classDef evidence fill:#152229,stroke:#42606f,color:#f5f7f8;
      classDef foundation fill:#332a12,stroke:#a8750e,color:#f5f7f8;`
    : `
      classDef input fill:#f5f7f8,stroke:#d8e0e5,color:#013a5b;
      classDef logic fill:#eef7fb,stroke:#0283c2,color:#013a5b;
      classDef output fill:#f5f7f8,stroke:#d8e0e5,color:#013a5b;
      classDef evidence fill:#f5f7f8,stroke:#d8e0e5,color:#013a5b;
      classDef foundation fill:#fff8e8,stroke:#f8ad15,color:#013a5b;`

  try {
    const diagramSource = compactQuery?.matches ? compactSource : source
    const { svg } = await mermaid.render(`robot-system-map-${version}`, `${diagramSource}\n${palette}`)
    if (version !== renderVersion || !diagram.value) return
    diagram.value.innerHTML = svg
    wireNodeHover(diagram.value)
    error.value = false
  } catch {
    if (version === renderVersion) error.value = true
  }
}

onMounted(() => {
  compactQuery = window.matchMedia('(max-width: 760px)')
  void render()
  observer = new MutationObserver(() => void render())
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  compactQuery.addEventListener('change', render)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  compactQuery?.removeEventListener('change', render)
  renderVersion += 1
})
</script>

<template>
  <figure class="system-map" aria-labelledby="system-map-title" aria-describedby="system-map-desc">
    <div class="system-map__intro">
      <strong id="system-map-title">The robot control loop</strong>
      <span id="system-map-desc">A request becomes an action, then a measured result.</span>
    </div>

    <div
      ref="diagram"
      class="system-map__diagram"
      role="img"
      aria-label="Controls and vision inform autonomous decisions. Decisions command drivetrain and mechanisms. Telemetry reports results, while electrical power and CAN communication support the robot."
    ></div>

    <p v-if="error" class="system-map__error" role="status">
      The diagram could not be rendered. Use the system links below to continue.
    </p>

    <nav class="system-map__links" aria-label="Systems shown in the diagram">
      <a v-for="system in systems" :key="system.name" :href="system.href">{{ system.name }}</a>
    </nav>

    <figcaption>Telemetry closes the loop by comparing the result with the original request.</figcaption>
  </figure>
</template>
