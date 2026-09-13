<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { data as wikiPages, type WikiPage } from '../wiki.data'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: WikiPage[]
}

const open = ref(false)
const answering = ref(false)
const question = ref('')
const status = ref('')
const messages = ref<Message[]>([])
const messageList = ref<HTMLElement | null>(null)
const questionInput = ref<HTMLTextAreaElement | null>(null)
const canAsk = computed(() => !answering.value && question.value.trim().length > 1)

watch(open, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  questionInput.value?.focus()
})

function terms(value: string) {
  return [...new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? [])]
    .filter((term) => term.length > 2)
}

function findSources(query: string) {
  const queryTerms = terms(query)
  return wikiPages
    .map((page) => {
      const haystack = `${page.title} ${page.content}`.toLowerCase()
      const score = queryTerms.reduce((total, term) => {
        const matches = haystack.split(term).length - 1
        return total + Math.min(matches, 5) + (page.title.toLowerCase().includes(term) ? 4 : 0)
      }, 0)
      return { page, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ page }) => page)
}

function excerpt(page: WikiPage) {
  return {
    title: page.title,
    url: page.url,
    content: page.content
      .replace(/```[\s\S]*?```/g, (code) => code.slice(0, 1400))
      .slice(0, 4200)
  }
}

async function scrollToLatest() {
  await nextTick()
  messageList.value?.scrollTo({ top: messageList.value.scrollHeight, behavior: 'smooth' })
}

function displayContent(content: string) {
  return content
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*\*\s+/gm, '– ')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

function clearConversation() {
  if (answering.value) return
  messages.value = []
  question.value = ''
  status.value = ''
}

async function ask() {
  const content = question.value.trim()
  if (!canAsk.value) return

  const sources = findSources(content)
  question.value = ''
  messages.value.push({ role: 'user', content })
  const answer: Message = { role: 'assistant', content: '', sources }
  messages.value.push(answer)
  answering.value = true
  status.value = 'Finding the relevant notes…'
  await scrollToLatest()

  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: content,
        sources: sources.map(excerpt),
        history: messages.value.slice(0, -2).slice(-4).map(({ role, content }) => ({ role, content }))
      })
    })

    if (!response.ok) {
      const problem = await response.json().catch(() => null) as { error?: string } | null
      throw new Error(`${response.status}: ${problem?.error ?? 'Request failed.'}`)
    }

    if (!response.body) throw new Error('The response did not include a stream.')
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      answer.content += decoder.decode(value, { stream: true })
      await scrollToLatest()
    }
    answer.content += decoder.decode()
  } catch (cause) {
    console.error('The wiki assistant could not answer.', cause)
    const message = cause instanceof Error ? cause.message : ''
    answer.content = message.startsWith('429:')
      ? 'The assistant has reached its current usage limit. The wiki pages are still available from the source links below.'
      : 'The assistant is unavailable right now. Use the source links below, or try again in a moment.'
  } finally {
    answering.value = false
    status.value = ''
  }
}
</script>

<template>
  <button class="wiki-assistant-trigger" type="button" aria-label="Ask the 5025 Wiki" :aria-expanded="open" @click="open = !open">
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 5.75h14v10.5H9.5L5 19.5V5.75Z" />
      <path d="M8.5 9h7M8.5 12.5h4.5" />
    </svg>
    <span>Ask the wiki</span>
  </button>

  <Transition name="assistant-panel">
    <section v-if="open" class="wiki-assistant" aria-label="5025 Wiki assistant" @keydown.esc="open = false">
      <header class="wiki-assistant__header">
        <div>
          <strong>Ask the wiki</strong>
          <span v-if="status" aria-live="polite">{{ status }}</span>
        </div>
        <div class="wiki-assistant__actions">
          <button v-if="messages.length" type="button" aria-label="Clear conversation" :disabled="answering" @click="clearConversation">Clear</button>
          <button type="button" aria-label="Close assistant" @click="open = false">×</button>
        </div>
      </header>

      <div ref="messageList" class="wiki-assistant__messages" aria-live="polite">
        <div v-if="messages.length === 0" class="wiki-assistant__empty">
          <p>Ask about systems, testing, or code.</p>
          <div class="wiki-assistant__prompts">
            <button type="button" @click="question = 'How should I diagnose a mechanism that does not move?'">Diagnose a stuck mechanism</button>
            <button type="button" @click="question = 'What should telemetry record?'">Plan telemetry</button>
          </div>
          <small>Answers link back to the pages they use. Verify anything that affects the robot.</small>
        </div>

        <article v-for="(message, index) in messages" :key="index" :class="['wiki-assistant__message', `is-${message.role}`]">
          <span>{{ message.role === 'user' ? 'You' : '5025 Wiki' }}</span>
          <p>{{ displayContent(message.content) || 'Thinking…' }}</p>
          <nav v-if="message.sources?.length" aria-label="Sources for this answer">
            <a v-for="source in message.sources" :key="source.url" :href="source.url">{{ source.title }}</a>
          </nav>
        </article>
      </div>

      <form class="wiki-assistant__form" @submit.prevent="ask">
        <label for="wiki-question">Question</label>
        <textarea ref="questionInput" id="wiki-question" v-model="question" rows="2" maxlength="600" placeholder="Ask about the robot…" @keydown.enter.exact.prevent="ask"></textarea>
        <button type="submit" :disabled="!canAsk">{{ answering ? 'Answering…' : 'Ask' }}</button>
      </form>
    </section>
  </Transition>
</template>
