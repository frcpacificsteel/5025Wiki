# Pacific Steel packages

The Pacific Steel packages provide shared building blocks for team software. 5025UI supplies the React interface system; QR Transfer moves a JSON value between two nearby devices using their screens and cameras.

| Package | Purpose | Current published version |
| --- | --- | --- |
| [`@frcpacificsteel/ui`](https://www.npmjs.com/package/@frcpacificsteel/ui) | Accessible React components, styles, tokens, fonts, and team logos | 0.1.1 |
| [`@frcpacificsteel/qr-transfer`](https://www.npmjs.com/package/@frcpacificsteel/qr-transfer) | Two-device, one-way JSON transfer over animated QR frames | 0.1.1 |

Both are public npm packages. QR Transfer uses 5025UI as a peer dependency, so applications using it must install the UI package and its React requirements as well.

## Choose a package

- Start with [5025UI](./5025ui/) when building a React interface and you want consistent team controls, typography, surfaces, colors, and brand components.
- Start with [QR Transfer](./qr-transfer/) when two nearby devices need to exchange a JSON value without a network connection. It uses the UI package for its provided React components.

## Package boundaries

The packages are distributed through npm and maintained in separate repositories. This wiki describes the released public API and the browser behavior readers need to integrate them. Source links point to the corresponding repositories:

- [5025UI on GitHub](https://github.com/frcpacificsteel/5025UI)
- [QR Transfer on GitHub](https://github.com/frcpacificsteel/QRTransfer)

Package APIs can evolve between versions. Check npm and the linked source when relying on a feature newer than the versions listed above.
