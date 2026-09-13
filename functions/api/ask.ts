interface Env {
  GROQ_API_KEY: string
  ALLOWED_ORIGIN?: string
}

interface WikiExcerpt {
  title: string
  url: string
  content: string
}

interface AskBody {
  question?: unknown
  sources?: unknown
  history?: unknown
}

interface PagesContext {
  request: Request
  env: Env
}

const MODEL = 'openai/gpt-oss-20b'
const ALLOWED_SOURCE_PATH = /^\/(systems|practice|reference|start)(\/|$)|^\/$/

function json(error: string, status: number) {
  return Response.json({ error }, { status })
}

function validSources(value: unknown): WikiExcerpt[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, 3).flatMap((source) => {
    if (!source || typeof source !== 'object') return []
    const item = source as Record<string, unknown>
    if (typeof item.title !== 'string' || typeof item.url !== 'string' || typeof item.content !== 'string') return []
    if (!ALLOWED_SOURCE_PATH.test(item.url) || item.title.length > 100) return []
    return [{ title: item.title, url: item.url, content: item.content.slice(0, 4200) }]
  })
}

function validHistory(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.slice(-4).flatMap((message) => {
    if (!message || typeof message !== 'object') return []
    const item = message as Record<string, unknown>
    if ((item.role !== 'user' && item.role !== 'assistant') || typeof item.content !== 'string') return []
    return [{ role: item.role, content: item.content.slice(0, 1000) }]
  })
}

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  if (!env.GROQ_API_KEY) return json('The assistant is not configured.', 503)

  const origin = request.headers.get('Origin')
  if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) return json('Origin not allowed.', 403)

  const length = Number(request.headers.get('Content-Length') ?? 0)
  if (length > 18000) return json('Request is too large.', 413)

  let body: AskBody
  try {
    body = await request.json() as AskBody
  } catch {
    return json('Invalid request.', 400)
  }

  if (typeof body.question !== 'string' || body.question.trim().length < 2 || body.question.length > 600) {
    return json('Question must be between 2 and 600 characters.', 400)
  }

  const sources = validSources(body.sources)
  if (sources.length === 0) return json('No relevant wiki pages were found.', 400)
  const context = sources.map((source) => `SOURCE: ${source.title} (${source.url})\n${source.content}`).join('\n\n---\n\n')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)
  try {
    const groq = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Authorization': `Bearer ${env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.2,
        max_completion_tokens: 500,
        messages: [
          {
            role: 'system',
            content: `You answer questions for Pacific Steel FRC Team 5025. Use only the supplied wiki excerpts. Be concise but technically useful. If the excerpts do not contain the answer, say what is missing. Do not invent team procedures, constants, wiring, or robot-specific facts. Explain code in plain language when useful. Return plain text only: no Markdown markers, no headings, and no sources section; the interface supplies source links.\n\nWIKI EXCERPTS:\n${context}`
          },
          ...validHistory(body.history),
          { role: 'user', content: body.question.trim() }
        ]
      })
    })

    if (!groq.ok) {
      console.error('Groq request failed', groq.status, await groq.text())
      return json(groq.status === 429 ? 'Usage limit reached. Try again later.' : 'The model provider is unavailable.', groq.status === 429 ? 429 : 502)
    }
    if (!groq.body) return json('The model provider returned no response.', 502)

    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    let buffer = ''
    const textStream = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, output) {
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ') || line === 'data: [DONE]') continue
          try {
            const event = JSON.parse(line.slice(6))
            const token = event.choices?.[0]?.delta?.content
            if (typeof token === 'string') output.enqueue(encoder.encode(token))
          } catch {
            // Ignore incomplete or provider-specific stream events.
          }
        }
      }
    })

    return new Response(groq.body.pipeThrough(textStream), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
    })
  } catch (cause) {
    console.error('Groq request error', cause)
    return json('The model provider did not respond.', 504)
  } finally {
    clearTimeout(timeout)
  }
}

export const onRequest = async (): Promise<Response> => json('Method not allowed.', 405)
