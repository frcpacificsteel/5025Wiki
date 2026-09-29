# QR Transfer browser integration

QR Transfer relies on browser camera access, so deployment origin and component lifecycle directly affect whether a transfer can start.

## Secure camera origin

Browsers permit camera access in secure contexts, normally HTTPS or `localhost`. A development server opened at `http://localhost` can use the camera. The same server reached as `http://192.168...` usually cannot. For two physical devices, deploy to an HTTPS origin or use a trusted local HTTPS setup.

The user must grant camera permission. The sender and receiver each scan the other, so both devices need a working camera even though only one side delivers the application value.

## React lifecycle

Render the sender with a stable JSON value for the duration of a session. Render the receiver with a callback that commits the complete value into app state or storage. Do not update application data from progress callbacks; those expose transfer status only.

The UI starts and stops camera tracks with component lifecycle. If the app hides or unmounts the transfer view, the camera can stop. Keep the transfer screen visible while exchanging frames. On permission or device errors, let the user retry or switch cameras from the provided controls.

In a Next.js app, place the components behind a client boundary because camera and animation APIs are browser-only. Import styles in the root layout or global entry once.

## Custom UI with the protocol core

The `/core` subpath avoids importing React components. A custom scanner needs to deliver decoded QR text into each session and render the session's current QR text. It must call `tick` on a regular interval so adaptation and retry behavior can progress. On the receiver, consume the completed value using `takeCompleted`; this prevents duplicate delivery. See [protocol and API](./protocol) for the exported types.

## Operational guidance

- Keep devices close enough that the QR fills a useful portion of each camera view.
- Avoid glare, severe screen brightness mismatch, motion blur, and rapidly moving the devices.
- Keep both screens awake and the transfer views in the foreground.
- Use a smaller JSON value when the transfer is slow; the 256 KiB cap is a maximum, not a performance target.
- Reset both sides and start a fresh session if either UI reaches an unrecoverable error.

Transfer speed depends on screen size, camera focus, lighting, and decode rate. QR transfer is intended for nearby devices and small structured data, not bulk files or real-time streaming.
