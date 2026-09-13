import { createContentLoader } from 'vitepress'

export interface WikiPage {
  title: string
  url: string
  content: string
}

export default createContentLoader('**/*.md', {
  includeSrc: true,
  transform(pages): WikiPage[] {
    return pages.map((page) => ({
      title: page.frontmatter.title
        ?? page.src?.match(/^#\s+(.+)$/m)?.[1]
        ?? page.url,
      url: page.url,
      content: (page.src ?? '')
        .replace(/^---[\s\S]*?---\s*/, '')
        .replace(/<[^>]+>/g, '')
        .trim()
    }))
  }
})
