<script setup lang="ts">
const systems = [
  { name: 'Drivetrain', detail: 'Modules, odometry, motion control', href: '/systems/drivetrain/' },
  { name: 'Mechanisms', detail: 'Goals, limits, sequencing, faults', href: '/systems/mechanisms/' },
  { name: 'Vision', detail: 'Measurements, timing, confidence', href: '/systems/vision/' },
  { name: 'Autonomous', detail: 'Plans, coordination, recovery', href: '/systems/autonomous/' },
  { name: 'Driver controls', detail: 'Intent, bindings, feedback', href: '/systems/controls/' },
  { name: 'Electrical and CAN', detail: 'Power, wiring, communication', href: '/systems/electrical/' },
  { name: 'Telemetry', detail: 'Logs, alerts, test evidence', href: '/systems/telemetry/' }
]

const work = [
  { label: 'New to robot code', detail: 'Set up, build, and trace your first behavior.', href: '/start/new-programmers' },
  { label: 'Something is broken', detail: 'Make the robot safe, collect evidence, file an issue.', href: '/start/report-a-problem' },
  { label: 'Testing a change', detail: 'Plan simulation, bench, and robot checks.', href: '/practice/testing' },
  { label: 'Looking up a term', detail: 'Find team vocabulary and common abbreviations.', href: '/reference/glossary' }
]
</script>

<template>
  <main class="wiki-home-content">
    <header class="workbench-head">
      <div class="workbench-title">
        <p class="workbench-kicker">Pacific Steel Robotics</p>
        <h1>5025 Wiki</h1>
      </div>
      <div class="workbench-intro">
        <p>Notes on how we design, program, test, and troubleshoot our robots. This is where the team keeps information that remains useful after a season ends.</p>
        <nav aria-label="Start here">
          <a href="/systems/">System map <span aria-hidden="true">↗</span></a>
          <a href="/start/how-to-use">How this wiki is organized <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>

    <aside class="scope-note" aria-label="What belongs in this wiki">
      <strong class="scope-mark">What goes here</strong>
      <p>Concepts, procedures, failure modes, and reusable code patterns belong in the wiki.</p>
      <p>Ports, gains, dimensions, and season-specific behavior stay with the robot code.</p>
    </aside>

    <section class="workbench-section" aria-labelledby="systems-heading">
      <header class="workbench-section-head">
        <h2 id="systems-heading">Browse by system</h2>
        <a href="/systems/">See how the systems connect →</a>
      </header>
      <nav class="system-ledger" aria-label="Robot systems">
        <a v-for="system in systems" :key="system.name" :href="system.href">
          <strong>{{ system.name }}</strong>
          <small>{{ system.detail }}</small><span class="ledger-arrow" aria-hidden="true">→</span>
        </a>
      </nav>
    </section>

    <section class="workbench-section" aria-labelledby="work-heading">
      <header class="workbench-section-head">
        <h2 id="work-heading">Common tasks</h2>
      </header>
      <nav class="work-ledger" aria-label="Common tasks">
        <a v-for="item in work" :key="item.label" :href="item.href">
          <span><strong>{{ item.label }}</strong><small>{{ item.detail }}</small></span>
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </section>

    <footer class="workbench-foot">
      <p>Found something unclear or outdated?</p>
      <a href="https://github.com/frcpacificsteel/5025Wiki/issues">Open an issue on GitHub ↗</a>
    </footer>
  </main>
</template>
