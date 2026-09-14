# Add or edit a page

Wiki pages are Markdown files inside `docs/`. The folder and filename determine the page URL.

## Edit an existing page

The quickest route is **Improve this page on GitHub** at the bottom of every standard article. When editing locally, find the matching file under `docs/`.

| Page URL | Source file |
| --- | --- |
| `/programming/configuration` | `docs/programming/configuration.md` |
| `/systems/vision/` | `docs/systems/vision/index.md` |
| `/wiki-essentials/markdown` | `docs/wiki-essentials/markdown.md` |

Keep an edit focused. If the page needs a different purpose or audience, discuss that in an issue before rewriting it.

## Create a page

1. Choose the section that best matches the subject.
2. Create a lowercase, hyphenated `.md` filename such as `motor-current-limits.md`.
3. Add one level-one heading at the top.
4. Open with what the page teaches and why it matters.
5. Divide the rest into descriptive level-two and level-three headings.
6. Add the page to `docs/.vitepress/config.mts`.
7. Link it from a related article when that helps discovery.

```md
# Motor current limits

Current limits protect wiring, controllers, motors, and mechanisms while helping the electrical system remain stable under load.

## What the limit controls

Explain the concept in language the whole team can follow.

## How programmers configure it

Add implementation detail, code, assumptions, and failure behavior.

## How to verify it

Describe a safe test and the evidence that shows it works.
```

## Use frontmatter only when needed

Frontmatter is optional metadata between `---` lines at the top of a file.

```yaml
---
title: Motor current limits
description: How current limiting protects a robot and affects performance.
outline: [2, 3]
---
```

Most pages do not need it. VitePress uses the first heading as the title, and the site already lists level-two and level-three headings under **On this page**. Copy special options such as `pageClass` or `outline: false` only when the page needs different layout behavior.

## Write in layers

1. **Whole-team understanding:** purpose, behavior, and connections.
2. **Operation and diagnosis:** correct behavior, safe use, and useful evidence.
3. **Specialist depth:** interfaces, algorithms, code, units, assumptions, and tests.

Do not label every paragraph beginner or advanced. A well-ordered page lets readers stop when they have enough detail.

## Keep pages durable

Prefer names such as `leftMotor`, `mechanism`, and `targetPosition` in examples. Avoid presenting a current robot's ports or constants as universal facts. If a seasonal example is valuable, name the season and explain which parts transfer.

## Rename or remove carefully

Changing a filename changes its URL. Search the repository for the old path, update the sidebar, and consider external bookmarks. Ask a maintainer before removing a page or changing a widely used URL.
