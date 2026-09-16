<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

type MapMode = 'overview' | 'detailed'

const diagram = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const mode = ref<MapMode>('overview')
const zoom = ref(1)
const canvasHeight = ref(520)
const error = ref(false)
const isPanning = ref(false)
let observer: MutationObserver | undefined
let renderVersion = 0
let panStartX = 0
let panStartY = 0
let panStartScrollLeft = 0
let panStartScrollTop = 0

const MIN_ZOOM = 0.25
const MAX_ZOOM = 1.6
const ZOOM_STEP = 0.1

const canvasWidth = computed(() => mode.value === 'detailed' ? 1540 : 980)
const zoomPercent = computed(() => `${Math.round(zoom.value * 100)}%`)
const stageStyle = computed(() => ({
  width: `${canvasWidth.value * zoom.value}px`,
  height: `${canvasHeight.value * zoom.value}px`
}))
const diagramStyle = computed(() => ({
  width: `${canvasWidth.value}px`,
  height: `${canvasHeight.value}px`,
  transform: `scale(${zoom.value})`
}))

const systems = [
  { name: 'Controls', href: '/systems/controls/' },
  { name: 'Autonomous', href: '/systems/autonomous/' },
  { name: 'Superstructure', href: '/systems/superstructure/' },
  { name: 'Drivetrain', href: '/systems/drivetrain/' },
  { name: 'Vision', href: '/systems/vision/' },
  { name: 'Mechanisms', href: '/systems/mechanisms/' },
  { name: 'Telemetry', href: '/systems/telemetry/' },
  { name: 'Electrical & CAN', href: '/systems/electrical/' }
]

const overviewSource = String.raw`flowchart LR
  subgraph Runtime["Runtime"]
    direction TB
    Robot["Robot lifecycle"]
    Scheduler["WPILib scheduler"]
    Robot --> Scheduler
  end

  subgraph Intent["Intent"]
    direction TB
    Controls["Driver + operator controls"]
    Autonomous["Autonomous plans"]
  end

  subgraph Coordination["Coordination"]
    direction TB
    FieldTargets["Field targets + paths"]
    Superstructure["Superstructure goals"]
  end

  subgraph Systems["Robot systems"]
    direction TB
    Vision["Vision estimates"]
    Drivetrain["Swerve drivetrain"]
    Mechanisms["Mechanisms + safety"]
  end

  subgraph Evidence["Evidence"]
    direction TB
    Telemetry["Telemetry + health"]
    Dashboard["Driver Station + dashboard"]
    Telemetry --> Dashboard
  end

  subgraph Foundation["Foundation"]
    direction TB
    Config["Configuration"]
    Electrical["Power + CAN"]
  end

  Controls -->|commands| Scheduler
  Autonomous -->|selected command| Scheduler
  Scheduler --> FieldTargets
  Scheduler --> Superstructure
  Scheduler --> Drivetrain
  FieldTargets -->|pathfind + follow| Drivetrain
  Vision -->|trusted pose| Drivetrain
  Superstructure -->|safe goals| Mechanisms
  Drivetrain --> Telemetry
  Vision --> Telemetry
  Mechanisms --> Telemetry
  Telemetry -. feedback .-> Intent
  Config -. policy + limits .-> Coordination
  Config -. calibration .-> Systems
  Electrical -. power + communication .-> Systems

  class Robot,Scheduler runtime
  class Controls,Autonomous input
  class FieldTargets,Superstructure logic
  class Vision,Drivetrain,Mechanisms hardware
  class Config,Electrical foundation
  class Telemetry,Dashboard evidence`

const detailedSource = String.raw`flowchart LR
  subgraph Runtime["Runtime and composition"]
    direction TB
    Robot["Robot<br/>TimedRobot mode lifecycle"]
    Container["RobotContainer<br/>constructs and wires dependencies"]
    Scheduler["CommandScheduler<br/>runs commands + periodic methods"]
    Robot -->|constructs| Container
    Robot -->|robotPeriodic| Scheduler
  end

  subgraph Intent["Operator and autonomous intent"]
    direction TB
    Controllers["DriverControls + OperatorControls<br/>axes, triggers, connection state"]
    Bindings["ControlBindings<br/>intent to WPILib commands"]
    AutoCatalog["Autos + AutoFactory + AutoRoutine<br/>steps, checks and fallback names"]
    AutoManager["AutoManager<br/>selection, preflight and recovery"]
    Controllers --> Bindings
    AutoCatalog -->|register plans| AutoManager
  end

  subgraph Coordination["Commands, coordination and safety"]
    direction TB
    CommandGraph["WPILib command graph<br/>requirements + interruption"]
    FieldTargets["FieldTargetManager<br/>alliance targets + PathPlanner"]
    Superstructure["Superstructure<br/>STOW · PRIMARY_ACTION · MANUAL_OVERRIDE"]
    Safety["SafetyManager + FaultMonitor + HomingState<br/>interlocks, latched faults + readiness"]
  end

  subgraph Systems["Hardware-facing robot systems"]
    direction TB
    Drivetrain["CommandSwerveDrivetrain<br/>requests, gyro, odometry + pose"]
    Vision["LimelightVisionSubsystem<br/>heartbeat, filtering + covariance"]
    Mechanisms["Mechanism subsystems<br/>sensor state + gated outputs"]
  end

  subgraph Evidence["Telemetry, health and operator evidence"]
    direction TB
    DriveTelemetry["Telemetry<br/>drive state, Field2d + SignalLogger"]
    NT4["NetworkTables publishers<br/>Auto · Vision · Safety · Superstructure"]
    Status["RobotStatus + RobotAlerts<br/>health checks + DS warnings"]
    Dashboard["Driver Station + dashboard<br/>selection, warnings + diagnosis"]
    DriveTelemetry --> NT4
    NT4 --> Dashboard
    Status --> Dashboard
  end

  subgraph Foundation["Configuration and physical infrastructure"]
    direction TB
    Config["RobotConfig + constants<br/>profiles, field, drive, vision + auto policy"]
    Topology["CanTopology + SwerveConstants<br/>device IDs, buses, gains + geometry"]
    Electrical["Electrical + CAN<br/>power, controllers, sensors + camera"]
  end

  Container -. wires controls .-> Bindings
  Container -. registers autos .-> AutoCatalog
  Container -. constructs .-> Drivetrain
  Container -. constructs .-> Vision
  Container -. constructs .-> Mechanisms
  Container -. constructs .-> Superstructure
  Container -. registers health suppliers .-> Status

  Bindings -->|drive, brake + reset| CommandGraph
  Bindings -->|target selection + pathfind| FieldTargets
  Bindings -->|goals, override + clear faults| Superstructure
  Bindings -->|disabled-mode selection| AutoManager
  AutoManager -->|validated auto or fallback| CommandGraph
  Scheduler -->|executes| CommandGraph
  CommandGraph -->|swerve requests| Drivetrain
  CommandGraph -->|path commands| FieldTargets
  CommandGraph -->|named goals| Superstructure
  FieldTargets -->|pathfind + follow| Drivetrain

  Superstructure -->|activate or stow| Mechanisms
  Safety -->|gates every output| Mechanisms
  Mechanisms -. readiness + faults .-> Superstructure
  Vision -->|trusted pose + covariance| Drivetrain
  Drivetrain -. heading + angular rate .-> Vision
  Vision -. recent trusted pose .-> AutoManager
  Superstructure -. ready + safe stop .-> AutoManager

  Config -. policy + limits .-> Bindings
  Config -. auto policy .-> AutoCatalog
  Config -. filtering limits .-> Vision
  Topology -. hardware definition .-> Drivetrain
  Topology -. hardware definition .-> Mechanisms
  Electrical -. power + communication .-> Drivetrain
  Electrical -. power + communication .-> Vision
  Electrical -. power + communication .-> Mechanisms

  Drivetrain -->|registered callback| DriveTelemetry
  AutoManager -. publishes .-> NT4
  Vision -. publishes .-> NT4
  Superstructure -. publishes .-> NT4
  Safety -. publishes .-> NT4

  class Robot,Container,Scheduler runtime
  class Controllers,Bindings input
  class AutoCatalog,AutoManager,CommandGraph,FieldTargets,Superstructure logic
  class Safety safety
  class Drivetrain,Vision,Mechanisms hardware
  class Config,Topology,Electrical foundation
  class DriveTelemetry,NT4,Status,Dashboard evidence`

const overviewConnections = [
  ['Robot', 'Scheduler'], ['Controls', 'Scheduler'], ['Autonomous', 'Scheduler'],
  ['Scheduler', 'FieldTargets'], ['Scheduler', 'Superstructure'], ['Scheduler', 'Drivetrain'],
  ['FieldTargets', 'Drivetrain'], ['Vision', 'Drivetrain'], ['Superstructure', 'Mechanisms'],
  ['Drivetrain', 'Telemetry'], ['Vision', 'Telemetry'], ['Mechanisms', 'Telemetry'],
  ['Telemetry', 'Intent'], ['Config', 'Coordination'], ['Config', 'Systems'],
  ['Electrical', 'Systems'], ['Telemetry', 'Dashboard']
]

const detailedConnections = [
  ['Robot', 'Container'], ['Robot', 'Scheduler'], ['Controllers', 'Bindings'],
  ['AutoCatalog', 'AutoManager'], ['Container', 'Bindings'], ['Container', 'AutoCatalog'],
  ['Container', 'Drivetrain'], ['Container', 'Vision'], ['Container', 'Mechanisms'],
  ['Container', 'Superstructure'], ['Container', 'Status'], ['Bindings', 'CommandGraph'],
  ['Bindings', 'FieldTargets'], ['Bindings', 'Superstructure'], ['Bindings', 'AutoManager'],
  ['AutoManager', 'CommandGraph'], ['Scheduler', 'CommandGraph'], ['CommandGraph', 'Drivetrain'],
  ['CommandGraph', 'FieldTargets'], ['CommandGraph', 'Superstructure'], ['FieldTargets', 'Drivetrain'],
  ['Superstructure', 'Mechanisms'], ['Safety', 'Mechanisms'], ['Mechanisms', 'Superstructure'],
  ['Vision', 'Drivetrain'], ['Drivetrain', 'Vision'], ['Vision', 'AutoManager'],
  ['Superstructure', 'AutoManager'], ['Config', 'Bindings'], ['Config', 'AutoCatalog'],
  ['Config', 'Vision'], ['Topology', 'Drivetrain'], ['Topology', 'Mechanisms'],
  ['Electrical', 'Drivetrain'], ['Electrical', 'Vision'], ['Electrical', 'Mechanisms'],
  ['Drivetrain', 'DriveTelemetry'], ['AutoManager', 'NT4'], ['Vision', 'NT4'],
  ['Superstructure', 'NT4'], ['Safety', 'NT4'], ['DriveTelemetry', 'NT4'],
  ['NT4', 'Dashboard'], ['Status', 'Dashboard']
]

function activeConnections() {
  return mode.value === 'detailed' ? detailedConnections : overviewConnections
}

function wireNodeHover(root: HTMLElement) {
  const nodes = [...root.querySelectorAll<SVGGElement>('.node')]
  const connections = activeConnections()
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

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
}

function centerViewport() {
  if (!viewport.value) return
  viewport.value.scrollLeft = Math.max(0, (viewport.value.scrollWidth - viewport.value.clientWidth) / 2)
  viewport.value.scrollTop = 0
}

async function fitToViewport() {
  await nextTick()
  if (!viewport.value) return
  zoom.value = clampZoom((viewport.value.clientWidth - 28) / canvasWidth.value)
  await nextTick()
  centerViewport()
}

async function resetView() {
  await nextTick()
  if (!viewport.value) return
  const exactFit = (viewport.value.clientWidth - 28) / canvasWidth.value
  const narrow = window.matchMedia('(max-width: 760px)').matches
  const readableMinimum = mode.value === 'detailed'
    ? (narrow ? 0.42 : 0.5)
    : (narrow ? 0.5 : exactFit)
  zoom.value = clampZoom(Math.max(exactFit, readableMinimum))
  await nextTick()
  centerViewport()
}

async function setZoom(nextZoom: number) {
  const root = viewport.value
  const previousZoom = zoom.value
  const centerX = root ? (root.scrollLeft + root.clientWidth / 2) / previousZoom : 0
  const centerY = root ? (root.scrollTop + root.clientHeight / 2) / previousZoom : 0
  zoom.value = clampZoom(nextZoom)
  await nextTick()
  if (!root) return
  root.scrollLeft = Math.max(0, centerX * zoom.value - root.clientWidth / 2)
  root.scrollTop = Math.max(0, centerY * zoom.value - root.clientHeight / 2)
}

function zoomBy(delta: number) {
  void setZoom(zoom.value + delta)
}

function fitDiagram() {
  void fitToViewport()
}

function onWheel(event: WheelEvent) {
  void setZoom(zoom.value + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP))
}

function startPan(event: PointerEvent) {
  if (event.button !== 0 || !viewport.value) return
  isPanning.value = true
  panStartX = event.clientX
  panStartY = event.clientY
  panStartScrollLeft = viewport.value.scrollLeft
  panStartScrollTop = viewport.value.scrollTop
  viewport.value.setPointerCapture(event.pointerId)
}

function movePan(event: PointerEvent) {
  if (!isPanning.value || !viewport.value) return
  viewport.value.scrollLeft = panStartScrollLeft - (event.clientX - panStartX)
  viewport.value.scrollTop = panStartScrollTop - (event.clientY - panStartY)
}

function endPan(event: PointerEvent) {
  if (!isPanning.value || !viewport.value) return
  isPanning.value = false
  if (viewport.value.hasPointerCapture(event.pointerId)) {
    viewport.value.releasePointerCapture(event.pointerId)
  }
}

async function setMode(nextMode: MapMode) {
  if (mode.value === nextMode) return
  mode.value = nextMode
  await render()
}

function printDiagram() {
  document.documentElement.classList.add('printing-system-map')
  const cleanup = () => document.documentElement.classList.remove('printing-system-map')
  window.addEventListener('afterprint', cleanup, { once: true })
  window.setTimeout(() => window.print(), 60)
  window.setTimeout(cleanup, 30000)
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
      curve: 'linear',
      htmlLabels: true,
      nodeSpacing: mode.value === 'detailed' ? 34 : 42,
      rankSpacing: mode.value === 'detailed' ? 52 : 66,
      useMaxWidth: false
    },
    themeVariables: dark
      ? {
          background: '#111c22', primaryColor: '#152229', primaryTextColor: '#f5f7f8',
          primaryBorderColor: '#42606f', lineColor: '#82939e', secondaryColor: '#152229',
          tertiaryColor: '#1a2931', fontFamily: 'Encode Sans, system-ui, sans-serif'
        }
      : {
          background: '#ffffff', primaryColor: '#ffffff', primaryTextColor: '#17232c',
          primaryBorderColor: '#b8c4ca', lineColor: '#6f808a', secondaryColor: '#f5f7f8',
          tertiaryColor: '#eef7fb', fontFamily: 'Encode Sans, system-ui, sans-serif'
        }
  })

  const palette = dark
    ? `
      classDef runtime fill:#17252d,stroke:#627782,color:#f5f7f8;
      classDef input fill:#17252d,stroke:#4c6978,color:#f5f7f8;
      classDef logic fill:#123147,stroke:#55b8e6,color:#f5f7f8;
      classDef safety fill:#351d20,stroke:#d55258,color:#f5f7f8;
      classDef hardware fill:#17252d,stroke:#4c6978,color:#f5f7f8;
      classDef foundation fill:#332a12,stroke:#a8750e,color:#f5f7f8;
      classDef evidence fill:#17252d,stroke:#4c6978,color:#f5f7f8;
      style Runtime fill:#132027,stroke:#34454f,color:#dce4e8
      style Intent fill:#14232b,stroke:#3d5968,color:#dce4e8
      style Coordination fill:#102a3b,stroke:#2f6f91,color:#dce4e8
      style Systems fill:#162229,stroke:#3b4e58,color:#dce4e8
      style Evidence fill:#14252b,stroke:#3f5d67,color:#dce4e8
      style Foundation fill:#29240f,stroke:#725d20,color:#e9e2c9`
    : `
      classDef runtime fill:#ffffff,stroke:#9aa9b2,color:#17232c;
      classDef input fill:#ffffff,stroke:#9eb2bd,color:#17232c;
      classDef logic fill:#ffffff,stroke:#0283c2,color:#013a5b;
      classDef safety fill:#fff8f8,stroke:#d82d34,color:#5a171a;
      classDef hardware fill:#ffffff,stroke:#9eb2bd,color:#17232c;
      classDef foundation fill:#fffdf7,stroke:#d89a18,color:#493507;
      classDef evidence fill:#ffffff,stroke:#9eb2bd,color:#17232c;
      style Runtime fill:#f4f6f7,stroke:#c9d2d7,color:#17232c
      style Intent fill:#eef7fb,stroke:#b9dcea,color:#17232c
      style Coordination fill:#e5f4fb,stroke:#82c7e5,color:#013a5b
      style Systems fill:#f4f6f7,stroke:#c9d2d7,color:#17232c
      style Evidence fill:#edf7f5,stroke:#bad8d2,color:#173b36
      style Foundation fill:#fff8e8,stroke:#e3bd63,color:#493507`

  try {
    const source = mode.value === 'detailed' ? detailedSource : overviewSource
    const { svg } = await mermaid.render(`robot-system-map-${version}`, `${source}\n${palette}`)
    if (version !== renderVersion || !diagram.value) return
    diagram.value.innerHTML = svg
    const renderedSvg = diagram.value.querySelector<SVGSVGElement>('svg')
    if (renderedSvg?.viewBox.baseVal.width) {
      canvasHeight.value = canvasWidth.value
        * renderedSvg.viewBox.baseVal.height
        / renderedSvg.viewBox.baseVal.width
    }
    wireNodeHover(diagram.value)
    error.value = false
    await resetView()
  } catch {
    if (version === renderVersion) error.value = true
  }
}

onMounted(() => {
  void render()
  observer = new MutationObserver(() => void render())
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  document.documentElement.classList.remove('printing-system-map')
  renderVersion += 1
})
</script>

<template>
  <figure class="system-map" aria-labelledby="system-map-title" aria-describedby="system-map-desc">
    <div class="system-map__header">
      <div class="system-map__intro">
        <strong id="system-map-title">Robot architecture</strong>
        <span id="system-map-desc">Follow a request from intent to hardware, then back through evidence.</span>
      </div>

      <div class="system-map__toolbar" aria-label="Diagram controls">
        <div class="system-map__mode" aria-label="Diagram detail">
          <button type="button" :class="{ 'is-active': mode === 'overview' }" :aria-pressed="mode === 'overview'" @click="setMode('overview')">Broad</button>
          <button type="button" :class="{ 'is-active': mode === 'detailed' }" :aria-pressed="mode === 'detailed'" @click="setMode('detailed')">Detailed</button>
        </div>

        <div class="system-map__tools">
          <button type="button" aria-label="Zoom out" title="Zoom out" :disabled="zoom <= MIN_ZOOM" @click="zoomBy(-ZOOM_STEP)">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 11h14v2H5z" /></svg>
          </button>
          <output aria-live="polite">{{ zoomPercent }}</output>
          <button type="button" aria-label="Zoom in" title="Zoom in" :disabled="zoom >= MAX_ZOOM" @click="zoomBy(ZOOM_STEP)">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" /></svg>
          </button>
          <button type="button" aria-label="Fit diagram" title="Fit diagram" @click="fitDiagram">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4h6v2H6v4H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Z" /></svg>
          </button>
          <button type="button" aria-label="Print full diagram" title="Print full diagram" @click="printDiagram">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 3h10v4h2a3 3 0 0 1 3 3v6h-4v5H6v-5H2v-6a3 3 0 0 1 3-3h2V3Zm2 4h6V5H9v2Zm7 7H8v5h8v-5Zm2 0h2v-4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v4h2v-2h12v2Z" /></svg>
          </button>
        </div>
      </div>
    </div>

    <div
      ref="viewport"
      class="system-map__viewport"
      :class="{ 'is-panning': isPanning }"
      @wheel.ctrl.prevent="onWheel"
      @pointerdown="startPan"
      @pointermove="movePan"
      @pointerup="endPan"
      @pointercancel="endPan"
    >
      <div class="system-map__stage" :style="stageStyle">
        <div
          ref="diagram"
          class="system-map__diagram"
          :style="diagramStyle"
          role="img"
          :aria-label="mode === 'detailed'
            ? 'Detailed code-backed robot architecture with grouped runtime, intent, coordination, hardware, evidence, and infrastructure systems.'
            : 'Overview of the robot control loop grouped by runtime, intent, coordination, robot systems, evidence, and foundation.'"
        ></div>
      </div>
    </div>

    <p v-if="error" class="system-map__error" role="status">
      The diagram could not be rendered. Use the system links below to continue.
    </p>

    <div class="system-map__footer">
      <div class="system-map__legend" aria-label="Diagram legend">
        <span><i class="system-map__line"></i>Command or data flow</span>
        <span><i class="system-map__line system-map__line--dashed"></i>Configuration, readiness, feedback or support</span>
      </div>
      <span class="system-map__hint">Drag the canvas or use the scrollbars. Hold Ctrl while scrolling to zoom.</span>
    </div>

    <nav class="system-map__links" aria-label="Systems shown in the diagram">
      <a v-for="system in systems" :key="system.name" :href="system.href">{{ system.name }}</a>
    </nav>

    <figcaption>The detailed view mirrors the current template's dependency wiring and package boundaries.</figcaption>
  </figure>
</template>
