# 5025UI components and logos

5025UI exports components from `@frcpacificsteel/ui`. Compose the primitives in the app rather than depending on package-internal source paths.

## Team logos

The package includes the 5025 mark and horizontal logos as image-backed React components. Select the horizontal variant that matches the surface; the logo art itself is not recolored automatically.

```tsx
import {
  LogoIcon,
  LogoHorizontal,
  LogoHorizontalDarkMode,
  LogoHorizontalLightMode,
} from '@frcpacificsteel/ui';

<LogoHorizontal mode="light" />
<LogoHorizontal mode="dark" />
<LogoHorizontalLightMode />
<LogoHorizontalDarkMode />
<LogoIcon alt="Pacific Steel 5025" />
```

All logo components accept normal image attributes such as `width`, `height`, `alt`, `loading`, and `className`. They include the `ps-logo` class and a variant class, so size them with CSS or image attributes. Give an informative `alt` value when the logo identifies the team. Use `alt=""` when it is decorative beside equivalent text.

The corresponding URL exports are `logoIconSrc`, `logoHorizontalLightSrc`, and `logoHorizontalDarkSrc`. Use these when an image URL is needed instead of a React component. The SVG data is bundled with the package, so consumers do not need to copy the original asset files into their public directory.

## Application loader

`Loader` supplies the team's animated startup treatment and uses `LogoIcon` artwork by default.

```tsx
import { Loader } from '@frcpacificsteel/ui';

<Loader open={loading} onComplete={() => setReady(true)} />
```

When `open` is provided, visibility is controlled by the caller. `duration` sets the visible duration for the uncontrolled initial-load behavior; `markSrc` can provide a different icon URL, and `label` sets the accessible status text. The loader affects root loading classes and emits `ps-loader-complete` and the compatibility `wiki-loader-complete` event when its reveal completes. Use it for application startup, not routine short operations; use `Spinner` or `Progress` for those.

## Accessible composition

Use the supplied labels, descriptions, hints, and error components with their controls. Do not remove visible focus styles or use color alone to communicate validation or status. Components based on Base UI manage interaction semantics, but applications still need meaningful names, labels, and content.

For examples of the complete component catalog, see the [5025UI repository preview](https://github.com/frcpacificsteel/5025UI).
