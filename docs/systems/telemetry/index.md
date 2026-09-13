# Telemetry

Telemetry records what the robot did. Each value should answer an operating or troubleshooting question without burying the team in data.

## Design from questions

Start with a question: “Did the command run?”, “What prevented motion?”, or “Did measured position follow the target?” Log the smallest set of values needed to answer it.

## Separate audiences

Drivers need a compact operating view. Pit crew need health and fault summaries. Programmers need detailed signals and logs. They can use the same source data without seeing the same amount of it.

## Use stable names and units

A key should identify the system, signal, and unit where the API does not carry units separately.

```java
Logger.recordOutput("Drivetrain/MeasuredVxMetersPerSec", measured.vxMetersPerSecond);
Logger.recordOutput("Drivetrain/GyroConnected", gyroConnected);
Logger.recordOutput("Elevator/Goal", goal.name());
Logger.recordOutput("Elevator/PositionMeters", positionMeters);
```

Do not reuse one key for different meanings. Keep naming stable enough to compare logs from separate test sessions.

## Log events as events

Some information changes rarely and should not be sampled every loop.

```java
if (fault != previousFault) {
  eventLog.append(String.format(
      "%.3f Elevator fault changed: %s -> %s",
      Timer.getFPGATimestamp(), previousFault, fault));
  previousFault = fault;
}
```

Mode changes, command starts and finishes, fault transitions, pose resets, and configuration loads are useful event markers.

## Choose a rate on purpose

Fast control signals may need high-rate logging. Temperatures, connection state, and operator selections usually do not. Measure loop timing and network load after adding telemetry.

| Data | Typical reason to record it |
| --- | --- |
| Requests and setpoints | Show what the robot was asked to do |
| Measurements | Show the physical response |
| Constraints and interlocks | Explain why output was limited or blocked |
| Applied outputs | Show what reached the device API |
| Faults and connection state | Separate control problems from hardware availability |
| Timestamps and loop duration | Find latency, stalls, and ordering problems |

## Reconstruct one incident

For any recorded fault, the team should be able to answer:

1. What mode was the robot in?
2. What action was requested?
3. What conditions allowed or blocked it?
4. What output was applied?
5. What did the sensors report?
6. What changed immediately before the fault?

## For telemetry programmers

Plan for structured logs, timestamps, event markers, sampling rates, bandwidth limits, replay, dashboards, and fault summaries.
