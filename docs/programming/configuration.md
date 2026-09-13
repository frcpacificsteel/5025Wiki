# Configuration

Configuration describes the physical robot and selected operating limits. Control logic consumes configuration; it should not invent it.

## What belongs in configuration

- CAN, PWM, DIO, and analog identifiers
- motor inversion and sensor direction
- gear ratios and wheel diameters
- mechanism travel limits
- current limits and voltage constraints
- controller gains and motion constraints
- camera transforms and field dimensions

```java
public record ElevatorConfig(
    int leaderCanId,
    int followerCanId,
    double gearRatio,
    double drumRadiusMeters,
    double minHeightMeters,
    double maxHeightMeters,
    double currentLimitAmps) {}
```

## Validate at startup

```java
public ElevatorConfig {
  if (gearRatio <= 0.0) throw new IllegalArgumentException("gearRatio must be positive");
  if (minHeightMeters >= maxHeightMeters) throw new IllegalArgumentException("invalid height range");
}
```

Fail early for impossible values. Runtime clamping should protect physical motion, not conceal broken configuration.

## Profiles

If the team maintains multiple robots, select a named robot profile once at startup. Do not scatter `if (practiceRobot)` checks through subsystems.

## Change discipline

Configuration changes deserve the same review as logic. State why the value changed, how it was measured, which robot profile it affects, and what verification was performed.

::: danger Never guess identifiers
A duplicate CAN ID or incorrect inversion can disable a device or create unexpected motion. Verify against the maintained wiring and configuration source.
:::
