# 5025UI

`@frcpacificsteel/ui` is Pacific Steel 5025's accessible React component system. It combines Base UI behavior with shared team typography, colors, spacing, surfaces, and motion. Use it to give team tools a consistent interface without rebuilding common controls in each app.

## Requirements and installation

Version 0.1.1 supports React 18 and React 19. Base UI and Tailwind CSS v4 are peer dependencies for projects that use the corresponding package features.

```bash
npm install @frcpacificsteel/ui @base-ui/react react react-dom tailwindcss
```

Import the stylesheet once at the application root. In Next.js, do this in the root layout; in Vite, do it in the application entry point.

```tsx
import '@frcpacificsteel/ui/styles.css';
```

For Tailwind v4 utilities that map to the package tokens, add the Tailwind entry to the app's global stylesheet:

```css
@import "tailwindcss";
@import "@frcpacificsteel/ui/tailwind.css";
```

The package includes Encode Sans and Encode Sans Semi Expanded font assets. An app can use the provided font variables after importing the component stylesheet.

## Use a component

Components are imported from the package root. Interactive components that use React state or browser APIs belong below a client boundary in frameworks such as Next.js.

```tsx
'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@frcpacificsteel/ui';

export function MatchSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Match 42</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Open report</Button>
      </CardContent>
    </Card>
  );
}
```

Props follow the underlying HTML element or Base UI primitive where practical. The package exports TypeScript definitions for its public components.

## Component families

The package groups components by the work they support:

- **Foundations:** logos, headings, lead text, muted text, code, keyboard hints, avatars, aspect ratio, separator, skeleton, spinner, and application loader.
- **Actions:** button, button group, toggle, toggle group, and toolbar.
- **Forms:** input, textarea, native select, select, combobox, checkbox, switch, radio group, slider, number field, OTP input, input group, field labels, hints, and errors.
- **Navigation:** breadcrumbs, tabs, pagination, menubar, navigation menu, and sidebar.
- **Data display:** cards, tables, data table, items, scroll area, progress, meter, chart container, and empty state.
- **Disclosure and overlays:** accordion, collapsible, dialog, alert dialog, popover, tooltip, hover card, menus, drawer, sheet, and toast.
- **Composition:** command menu, carousel, and resizable panels.

See [components and logos](./components) for usage patterns and [styling and themes](./styling) for tokens and CSS setup.

## Compatibility notes

The package is a React component library, not a framework-specific app. It does not provide routing or data fetching. Consumers own application state and data flow. Review peer dependency requirements when upgrading React, Base UI, or Tailwind.
