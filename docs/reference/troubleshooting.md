# Troubleshooting

Troubleshooting starts with an observation and narrows it into a question the team can test.

## Start with the symptom

Describe what happened without embedding a theory. “The left-front module rotated continuously after enable” is more useful than “the encoder is broken.”

## Divide the system

Trace the path from request to result:

1. Was the action requested?
2. Was it permitted?
3. Was an output sent?
4. Did power and communication reach the device?
5. Did the mechanism move?
6. Did sensors report that movement correctly?

## Compare request and response

Most robot faults can be narrowed by lining up four signals:

| Signal | Question |
| --- | --- |
| Request | What behavior did the operator or routine ask for? |
| Permission | Did an interlock, limit, or mode block it? |
| Output | What voltage, current, or device command was sent? |
| Response | What motion or sensor change followed? |

If there was no request, start in controls or autonomous logic. If the request was blocked, inspect the named condition. If output was sent with no response, move toward power, communication, wiring, and mechanics. If the response happened but was reported incorrectly, inspect sensing, units, and transforms.

## Keep a working hypothesis

Write one sentence that can be disproved: “The steering motor receives a command, but its absolute encoder does not change.” Then choose the smallest safe observation that would confirm or reject it.

Useful evidence includes:

- A timestamped log around the event
- Device faults and connection state
- Requested, permitted, and applied outputs
- Photos of wiring or mechanical position
- Exact enable mode and test conditions
- A known-good comparison from another module or device

## Use a known-good comparison carefully

Comparing identical modules can separate a shared software issue from a local hardware issue. Swap only one known-safe element at a time, record the original state, and do not move configuration values with the hardware unless that is the variable being tested.

## Change one thing

A controlled test gives a useful result. Changing several things at once may hide the cause, even if the symptom goes away.

## Close the issue

After the fix, reproduce the original conditions and confirm the symptom is gone. Record the cause, correction, and test evidence. A repair is not complete when the robot merely turns on again.
