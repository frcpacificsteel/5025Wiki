# Navigation and assets

A page is not finished until readers can find it. Navigation changes should preserve the systems-first structure and keep the top bar limited to high-value destinations.

## Add a page to the sidebar

The sidebar is configured in `docs/.vitepress/config.mts`. Add the page to the most relevant section:

```ts
{
  text: 'Programming foundations',
  collapsed: true,
  items: [
    { text: 'Configuration', link: '/programming/configuration' },
    { text: 'Logging', link: '/programming/logging' }
  ]
}
```

The `link` starts at the site root and omits `.md`. A folder's `index.md` normally uses a trailing slash, such as `/systems/vision/`.

Order items from foundational to specialized, or in the order a reader should learn them. Avoid creating a new section for one isolated page.

## Keep top navigation selective

The `nav` array in `config.mts` controls the links beside search. It is intentionally short. Add a top-level link only when it is a common entry point for a large part of the team. Ordinary pages belong in the sidebar and in links from related articles.

## Link related pages

Sidebar placement establishes hierarchy; links establish relationships. Add a contextual link when another page is the natural next step or supplies a prerequisite.

```md
Before tuning a controller, review [Units and coordinate frames](../controls/units-and-frames).
```

Do not add a generic related-links list to every page. Choose only connections that help the reader continue the task.

## Add an image or download

Place public files under `docs/public/`. Files retain the same path on the built site:

| Repository file | Site path |
| --- | --- |
| `docs/public/assets/wiring-example.webp` | `/assets/wiring-example.webp` |
| `docs/public/checklists/pre-enable.pdf` | `/checklists/pre-enable.pdf` |

Use descriptive, lowercase filenames with hyphens. Optimize images before committing them. Prefer SVG for diagrams and icons, WebP or AVIF for photographs, and PNG only when lossless raster detail is necessary.

## Image requirements

- Crop irrelevant desktop or dashboard space.
- Remove API keys, Wi-Fi credentials, personal information, and private messages.
- Include meaningful alternative text.
- Add a caption or nearby explanation when context is needed.
- Confirm the image remains understandable in light and dark appearances.

Do not edit or replace team logos without checking the supplied brand assets and confirming that the light and dark variants remain paired correctly.
