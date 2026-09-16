# Mechanisms

Mechanisms move game pieces or change the robot's physical configuration. The job is to produce repeatable motion safely, even when the load and geometry are not exactly as expected.

## Define the contract

Document what the mechanism can do, what must be true before it moves, how it detects completion, and what it does when a sensor or actuator gives an unexpected result.

## Coordinate explicitly

When mechanisms can collide or compete for power, use named safe states and explicit transition rules. Avoid spreading interlock logic across unrelated buttons and commands.

Use a [superstructure](../superstructure/) when multiple mechanisms must act as one coordinated system. It should receive the high-level goal, sequence each mechanism safely, and publish why a request is blocked.

## Separate goals from control

The rest of the robot should request a physical goal. The mechanism decides how to reach it within its limits.

```java
public enum ElevatorGoal {
  STOW(0.05),
  INTAKE(0.18),
  SCORE_HIGH(1.42);

  public final double heightMeters;

  ElevatorGoal(double heightMeters) {
    this.heightMeters = heightMeters;
  }
}
```

Named goals give controls, autonomous code, telemetry, and tests a shared vocabulary. Keep the physical value beside the goal or in configuration, not in button bindings.

## Enforce limits in the subsystem

```java
private double safeVoltage(double requestedVolts, Inputs inputs) {
  if (!inputs.encoderConnected()) return 0.0;
  if (inputs.upperLimit() && requestedVolts > 0.0) return 0.0;
  if (inputs.lowerLimit() && requestedVolts < 0.0) return 0.0;
  return MathUtil.clamp(requestedVolts, -maxVolts, maxVolts);
}
```

Operator controls may add another layer of protection, but the subsystem remains responsible for its own physical limits.

## Know the mechanism state

Track whether the mechanism is uninitialized, homing, ready, moving, or faulted. Position alone does not tell the full story.

```java
public enum MechanismState {
  UNINITIALIZED,
  HOMING,
  READY,
  MOVING,
  FAULTED
}
```

Define what transitions are allowed and what event causes each one. Homing must have a timeout and a response for a switch that never changes.

## Test the edges

- Approach both travel limits slowly.
- Interrupt motion in both directions.
- Disconnect or invalidate each position sensor.
- Start from an unknown position.
- Apply a heavier and lighter load.
- Request conflicting mechanism states.
- Brown out or disable during motion, then re-enable safely.

## For mechanism programmers

Mechanism code commonly involves gearing, current limits, motion profiles, limit detection, homing, feedforward, closed-loop control, command requirements, and coordination with the rest of the superstructure.
