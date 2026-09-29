# QR Transfer troubleshooting

Use the visible status message first. It distinguishes camera setup, pairing, transfer, retry adaptation, verification, and completion.

| Symptom | Likely cause | What to try |
| --- | --- | --- |
| Camera permission is denied | Permission was blocked in the browser or OS | Allow camera access for the site in browser settings, then retry. |
| Camera does not start | Page is on an insecure origin, device has no available camera, or another app holds it | Use HTTPS or localhost, close other camera apps, and retry. |
| Scanner sees no QR | QR is too small, out of focus, glare, or camera points the wrong way | Bring screens closer, steady them, adjust brightness, and switch cameras if needed. |
| Pairing does not complete | One device is not scanning the other device's current pairing code | Keep both transfer views visible and aim each camera at the other screen. Reset and retry if the codes have been replaced. |
| Transfer repeatedly adjusts | Frames or acknowledgements are being missed | Improve focus and lighting, reduce distance, keep the screens awake, and try a smaller JSON value. |
| Transfer reports an error during verification | A frame was lost or content did not match the expected transfer | Start over on both sides; the receiver does not deliver partial or invalid data. |
| Completion callback seems to run twice | The host app remounts/replays its own state update or adds duplicate callback logic | Keep the callback idempotent. The built-in receiver only releases its verified result once per mounted session. |
| JSON value is rejected | Value is not serializable or exceeds the 256 KiB limit | Remove unsupported values and reduce the serialized JSON size. |

## Camera access checklist

1. Confirm the page URL uses HTTPS or `localhost`.
2. Confirm browser and operating system camera permission.
3. Check that another app is not using the camera.
4. Retry the camera and switch between front and rear cameras.
5. Keep the browser tab in the foreground during transfer.

## When reporting a defect

Include package version, browser and OS versions, device models, origin type (HTTPS or localhost), approximate JSON size, the last visible phase, and whether the issue reproduces with both cameras. Do not include private payload content, camera recordings, or sensitive QR images in an issue.
