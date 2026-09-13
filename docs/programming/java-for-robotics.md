# Java for robot code

FRC Java uses ordinary Java with a framework that calls robot code on a schedule. Focus first on types, objects, methods, records, enums, collections, and lambdas.

## Types carry meaning

Prefer names that expose units and purpose.

```java
double elevatorHeightMeters = 0.42;
double wheelSpeedMetersPerSecond = 3.1;
boolean gyroConnected = true;
```

A `double` does not protect units by itself. The variable and method name must.

## Objects represent responsibilities

```java
public final class Intake extends SubsystemBase {
  private final IntakeIO io;
  private IntakeGoal goal = IntakeGoal.IDLE;

  public Intake(IntakeIO io) {
    this.io = io;
  }
}
```

`private final` means the reference is assigned during construction and cannot later point to a different object. Dependency injection through the constructor makes ownership visible and testing easier.

## Records hold data

```java
public record Inputs(
    double positionRad,
    double velocityRadPerSec,
    double currentAmps,
    boolean connected) {}
```

Records are useful for snapshots, configuration, and results. They reduce boilerplate but should still use precise field names.

## Enums define a closed vocabulary

```java
public enum IntakeGoal {
  IDLE,
  ACQUIRE,
  HOLD,
  EJECT
}
```

An enum is safer than several booleans that can contradict one another.

## Lambdas delay an action

```java
Commands.runOnce(() -> intake.setGoal(IntakeGoal.ACQUIRE), intake);
```

`() -> ...` is code passed as a value. The scheduler runs it later. A common beginner mistake is confusing code construction with code execution.

## Null, optionals, and validity

Avoid using `null` for sensor validity. Return an explicit connection flag, result type, or `Optional` when absence is meaningful. Hardware code must distinguish a real zero from a missing measurement.

## Read exceptions from the top cause

Stack traces show the chain of calls. Find the first line that points into team code, then inspect the exception type and message. The last line printed is often cleanup, not the cause.
