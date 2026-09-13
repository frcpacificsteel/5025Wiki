import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import SystemMap from './components/SystemMap.vue'
import WikiAssistant from './components/WikiAssistant.vue'
import WikiLoader from './components/WikiLoader.vue'
import MobileGlobalActions from './components/MobileGlobalActions.vue'
import TechnicalDiagram from './components/TechnicalDiagram.vue'
import BackToTop from './components/BackToTop.vue'
import './custom.css'

let routeAnimationTimer: number | undefined

function animateRoute() {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const chunks = document.querySelectorAll<HTMLElement>('.VPDoc .vp-doc > div > *')

  window.clearTimeout(routeAnimationTimer)
  root.classList.remove('wiki-route-enter')
  chunks.forEach((chunk, index) => {
    chunk.classList.add('wiki-route-chunk')
    chunk.style.setProperty('--wiki-chunk-index', String(Math.min(index, 8)))
  })

  requestAnimationFrame(() => root.classList.add('wiki-route-enter'))
  routeAnimationTimer = window.setTimeout(() => {
    root.classList.remove('wiki-route-enter')
    chunks.forEach((chunk) => {
      chunk.classList.remove('wiki-route-chunk')
      chunk.style.removeProperty('--wiki-chunk-index')
    })
  }, 1400)
}

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'sidebar-nav-before': () => h(MobileGlobalActions),
    'layout-bottom': () => [h(WikiLoader), h(WikiAssistant), h(BackToTop)]
  }),
  enhanceApp({ app, router }) {
    app.component('SystemMap', SystemMap)
    app.component('WikiAssistant', WikiAssistant)
    app.component('TechnicalDiagram', TechnicalDiagram)

    if (typeof window !== 'undefined') {
      window.addEventListener('wiki-loader-complete', animateRoute)
    }

    router.onAfterRouteChanged = animateRoute
  }
}

export default theme
