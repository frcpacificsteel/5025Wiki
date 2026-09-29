# 5025UI styling and themes

Import `@frcpacificsteel/ui/styles.css` once before applying app-specific styles. It defines the component styles, semantic `--ps-*` variables, typography, and light and dark palettes.

## Semantic tokens

Prefer semantic tokens over literal colors so a surface can adapt to the active theme. Define app-specific overrides on a root class or container:

```css
.scouting-app {
  --ps-canvas: #f5f7f8;
  --ps-surface: #ffffff;
  --ps-primary: #013a5b;
  --ps-focus: #0283c2;
  --ps-radius-sm: 0.25rem;
  --ps-duration: 180ms;
}
```

Common token groups cover:

- **Surfaces and lines:** canvas, subtle canvas, surface, raised/hover/active surfaces, line strengths, and overlay.
- **Text:** strong, regular, muted, and faint ink colors.
- **Team palette:** red, Del Mar blue, Pacific blue, gold, slate, black, and white scales.
- **Interaction:** primary, accent, focus ring, disabled treatment, and semantic status colors.
- **Shape and motion:** small, medium, large, and round radii; shared fast and standard durations, easing curves, and shadows.
- **Typography:** header and body font variables backed by the included Encode Sans families.

The complete values live in the package stylesheet; inspect those values rather than hardcoding approximations into app code.

## Dark theme

Add `data-theme="dark"` or the `.dark` class to an ancestor of the components. The semantic palette changes while component structure remains the same.

```html
<div data-theme="dark">
  <!-- 5025UI components -->
</div>
```

Choose `LogoHorizontalDarkMode` for a dark surface and the light-mode logo for a light surface. The theme switch does not change the SVG artwork.

## Tailwind CSS v4

The optional `@frcpacificsteel/ui/tailwind.css` entry maps package tokens to Tailwind theme variables. Import it after Tailwind in the global stylesheet:

```css
@import "tailwindcss";
@import "@frcpacificsteel/ui/tailwind.css";
```

## Styling guidance

Use component props for supported variants and semantic tokens for app-level customization. Keep overrides scoped to the application. Avoid targeting internal DOM structure or undocumented class names; those are implementation details and can change between package releases. Respect reduced-motion preferences when adding app-specific transitions.
