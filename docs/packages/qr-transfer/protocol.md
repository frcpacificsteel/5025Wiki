# QR Transfer protocol and API

The protocol is a one-way application transfer with two-way QR signaling. The sender sends JSON bytes in frames; the receiver sends pairing and acknowledgement frames. Each device's camera reads frames shown on the other screen.

## Session sequence

1. The sender displays a pairing offer; the receiver displays a ready frame.
2. Each device scans the other's code. The sessions bind to each other and ignore frames from unrelated sessions.
3. The sender shows one data chunk at a time. The receiver accepts the expected offset and returns an acknowledgement.
4. The sender advances only after it reads that acknowledgement. The receiver verifies the complete byte stream before exposing the JSON value.
5. The receiver emits a completion frame; the sender marks the transfer complete.

This stop-and-wait design prioritizes reliability and simple recovery. It is slower than network transfer and requires both cameras to continue seeing the screens.

## Public API

### React components

`QRTransferSenderProps`:

| Prop | Type | Meaning |
| --- | --- | --- |
| `value` | `JsonValue` | Required JSON value to serialize and send. |
| `onProgress` | `(progress: TransferProgress) => void` | Optional status callback. It receives no payload or partial JSON. |
| `className` | `string` | Optional class added to the package card. |

`QRTransferReceiverProps`:

| Prop | Type | Meaning |
| --- | --- | --- |
| `onComplete` | `(value: JsonValue) => void` | Required callback, called once with the complete verified value. |
| `onProgress` | `(progress: TransferProgress) => void` | Optional status callback with no payload content. |
| `className` | `string` | Optional class added to the package card. |

`JsonValue` includes `null`, booleans, numbers, strings, arrays, and string-keyed objects made from those types. Values must be JSON serializable; functions, symbols, cyclic references, `BigInt`, and `undefined` are not JSON data.

`TransferProgress` fields are `role` (`sender` or `receiver`), `phase` (`connecting`, `transferring`, `adjusting`, `verifying`, `complete`, or `error`), `transferredBytes`, `totalBytes`, `percent`, and a human-readable `message`.

### Protocol core

Import `QRTransferSession` and `prepareJson` from `@frcpacificsteel/qr-transfer/core` when building custom UI or scanner integration. A session is constructed with a role, optional sender value, and optional session ID. Feed scanned QR text into `receive`, call `tick` on an interval to trigger retry adaptation, inspect `getProgress`, and retrieve the verified result with `takeCompleted` on the receiver. `TransferSnapshot` extends progress with the current `qrText`, `qrSize`, and `inverted` display hints.

For example, the rendering and scanning loop can follow this shape; `drawQr` and `scanner.onText` represent the QR encoder and decoder supplied by the host app:

```ts
import { QRTransferSession } from '@frcpacificsteel/qr-transfer/core';

const session = new QRTransferSession('sender', report);
const retryTimer = window.setInterval(() => {
  if (session.tick()) render(session.getProgress());
}, 500);

scanner.onText(text => {
  if (!session.receive(text)) return;
  const snapshot = session.getProgress();
  drawQr(snapshot.qrText, { size: snapshot.qrSize, inverted: snapshot.inverted });
  render(snapshot);
});

// On a receiver session, after receive(text) reports a change:
const result = receiverSession.takeCompleted();
if (result) deliverToApplication(result.value);
```

The host app should redraw its QR when `qrText`, `qrSize`, or `inverted` changes, forward only complete receiver results to application data handling, and stop its timer and scanner when the view is disposed.

The core exports types `JsonValue`, `TransferProgress`, `TransferSnapshot`, `TransferPhase`, and `TransferRole`. The default React package entry exports the same core types and classes as well as the sender and receiver.

## Chunking and integrity

The current implementation accepts payloads up to 256 KiB. It UTF-8 encodes JSON, divides it into QR-friendly chunks, and includes a CRC-32 checksum of the serialized bytes. A chunk carries an offset, total byte length, transfer identifiers, checksum, and encoded body. The receiver accepts only the next expected offset. After reassembly, it decodes UTF-8 strictly, checks the checksum, parses JSON, and makes the full value available once.

If no matching response arrives for a short interval, the session adapts QR size and contrast and reduces the chunk length. The UI also supports scanning both normal and inverted QR contrast. Acknowledgements let the sender retry a frame without exposing partial application data.

## Trust boundary

Integrity checking detects accidental corruption; it does not authenticate a sender. The current protocol is not encrypted and does not protect against a malicious nearby device. Transfer only data appropriate for the physical setting and use trusted devices. Do not treat a successful checksum as proof of identity or confidentiality.
