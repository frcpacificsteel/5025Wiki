# Diagrams and components

Diagrams should explain a relationship that is harder to understand as prose: signal flow, sequence, state, ownership, or system boundaries. Every diagram also needs a useful accessible label and nearby text that explains its conclusion.

## Use the existing technical diagrams

The wiki provides a `TechnicalDiagram` component for four maintained diagrams:

```md
<TechnicalDiagram
  type="pose"
  label="Wheel, gyro, and vision measurements enter the pose estimator."
/>
```

| Type | Use |
| --- | --- |
| `beginner-loop` | Driver input through commands, mechanisms, sensors, and telemetry |
| `scheduler` | WPILib scheduler sequence |
| `pose` | Pose-estimation inputs and output |
| `test-layers` | Progression from unit tests to full-system validation |

They are defined in `docs/.vitepress/theme/components/TechnicalDiagram.vue`. They match light and dark modes and emphasize connected nodes on hover.

## Add a maintained Mermaid diagram

The wiki renders Mermaid through Vue components instead of raw `mermaid` fences. This keeps styling, accessibility, security, and interactions consistent.

1. Add a name to the `type` union in `TechnicalDiagram.vue`.
2. Add its Mermaid source to the `sources` object.
3. For a flowchart, add node relationships to `connections` for hover emphasis.
4. Use the component in Markdown with a concise `label`.
5. Test it in both color modes and at mobile width.

Example source inside the component:

```ts
faults: `flowchart LR
  O[Observation] --> C{Connected?}
  C -->|No| W[Check wiring and power]
  C -->|Yes| L[Inspect logs and state]`
```

Keep node text short. Explain details in the page instead of turning the diagram into a wall of text.

## Choose the diagram form

| Relationship | Mermaid form |
| --- | --- |
| Components and data flow | `flowchart LR` or `flowchart TD` |
| Events over time | `sequenceDiagram` |
| Explicit operating modes | `stateDiagram-v2` |
| Classes and interfaces | `classDiagram` |

Prefer left-to-right flow for a short sequence. Use top-to-bottom flow when it has branches or must fit a narrow reading column.

## Add a Vue component only when necessary

New global components belong in `docs/.vitepress/theme/components/` and must be registered in `docs/.vitepress/theme/index.ts`:

```ts
import NewComponent from './components/NewComponent.vue'

// Inside enhanceApp:
app.component('NewComponent', NewComponent)
```

A component must include semantic HTML, keyboard support, visible focus, light and dark appearance, mobile behavior, reduced-motion handling, and an error state when rendering can fail.

Do not build a one-off component when headings, lists, a table, or a static image communicate the same idea.

