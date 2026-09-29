# QR Transfer

`@frcpacificsteel/qr-transfer` transfers one JSON value from a sender device to a receiver device using the two screens and cameras. Both devices display a QR code and scan the other device. The sender's value is prepared once; the receiver's application callback runs once, after all chunks arrive and the complete payload passes integrity checks.

## Requirements

- Two nearby devices with a camera and a screen.
- A browser that supports `getUserMedia`, `requestAnimationFrame`, `TextEncoder`, and secure random values.
- A secure origin: HTTPS or `localhost`. Browsers normally block camera access on plain HTTP LAN addresses.
- Permission to use a camera on each device.

This release provides browser camera scanning and React components. Native platform adapters and cross-platform integration are future work.

## Install and styles

```bash
npm install @frcpacificsteel/qr-transfer @frcpacificsteel/ui @base-ui/react react react-dom tailwindcss
```

Import both stylesheets once:

```tsx
import '@frcpacificsteel/ui/styles.css';
import '@frcpacificsteel/qr-transfer/styles.css';
```

The UI stylesheet supplies shared controls and tokens; the transfer stylesheet supplies the camera, QR, and transfer layout. UI declares Base UI, React, React DOM, and Tailwind v4 as peer dependencies. The Tailwind token entry is optional if the app does not use Tailwind utilities.

## Sender and receiver

Mount one sender and one receiver on separate devices, usually in separate app views. The receiver requires an `onComplete` callback.

```tsx
'use client';

import { QRTransferReceiver, QRTransferSender } from '@frcpacificsteel/qr-transfer';

const report = { team: 5025, match: 42, notes: 'Ready to review' };

export function SendReport() {
  return <QRTransferSender value={report} onProgress={progress => {
    console.log(progress.phase, progress.percent);
  }} />;
}

export function ReceiveReport() {
  return <QRTransferReceiver onComplete={verifiedReport => {
    // Called once with the full JSON value after integrity verification.
    saveReport(verifiedReport);
  }} />;
}
```

Open the sender and receiver on separate devices and leave both views active. Each scans the QR shown by the other. The built-in UI provides status, progress, camera retry, camera switching, and **Start over** controls.

Read [browser integration](./integration) before deployment and [protocol and API](./protocol) for the lower-level API and payload behavior.
