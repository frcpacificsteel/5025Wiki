# Contributing to the wiki

The wiki is a shared engineering manual. Anyone on the team can correct an unclear sentence, record a repeatable procedure, or propose a new page. You do not need to be a programmer to contribute.

## Choose the right home

Add information here when it should remain useful across robots and seasons:

- How a subsystem is expected to behave
- A safe testing or troubleshooting procedure
- The reasoning behind an architecture or control method
- A reusable code pattern with enough context to understand it
- A diagram showing how systems exchange intent, power, or measurements

Keep controller mappings, CAN IDs, tuned gains, dimensions, autonomous routines, and other robot-specific facts in that season's code repository. The wiki may link to a seasonal example, but its explanation should stand on its own.

## Pick a contribution path

### Small correction

Use **Improve this page on GitHub** at the bottom of the article. GitHub opens its Markdown source. Make the correction, describe it briefly, and propose the change as a pull request.

### New page or larger revision

Work in a branch, preview the wiki locally, and open a pull request. Follow [Add or edit a page](./pages) and [Run the wiki locally](./local-development).

### Report a documentation problem

Open a [wiki issue](https://github.com/frcpacificsteel/5025Wiki/issues/new/choose). Explain what is missing, outdated, or confusing and link the affected page. A maintainer can turn the report into a documentation change.

## Repository map

| Location | Purpose |
| --- | --- |
| `docs/start/` | Orientation and first contribution paths |
| `docs/programming/` | Durable software concepts and architecture |
| `docs/controls/` | Control theory, units, and estimation |
| `docs/systems/` | Knowledge organized around robot systems |
| `docs/practice/` | Building, testing, and operating workflows |
| `docs/reference/` | Safety, troubleshooting, and vocabulary |
| `docs/wiki-essentials/` | Instructions for maintaining this wiki |
| `docs/public/assets/` | Logos and files served directly by the site |
| `docs/.vitepress/` | Site configuration, theme, and components |

## The contribution workflow

1. Decide whether the information is evergreen.
2. Find the closest existing page before creating another one.
3. Write for the whole team first, then add specialist detail.
4. Use links, tables, diagrams, and code where they clarify the subject.
5. Preview the page and run the production build.
6. Open a pull request and respond to review.
7. Merge only after the automated build passes.

Start with [Add or edit a page](./pages) for file-level instructions.
