# Programming

Robot software should make physical behavior easy to follow. Organize code around system responsibilities, write safety and coordination rules plainly, and expose enough state to diagnose a problem.

## Practices that carry forward

- Keep hardware values and geometry in maintained configuration.
- Give commands clear requirements and interruption behavior.
- Separate subsystem capability from operator bindings.
- Prefer named states and conditions over scattered booleans.
- Compile and test after structural or documentation-driven changes.

## Keep hardware behind an interface

Subsystem logic is easier to test when vendor objects stay inside a hardware adapter.

```java
public interface ArmIO {
  record Inputs(double positionRad, double velocityRadPerSec,
      double appliedVolts, double currentAmps, boolean connected) {}

  Inputs readInputs();
  void setVoltage(double volts);
  void stop();
}
```

The real adapter owns motor controllers and encoders. A simulation or test adapter implements the same interface without requiring a robot.

## Give the subsystem a small contract

Commands should request capabilities rather than manipulate motors directly.

```java
public final class Arm extends SubsystemBase {
  private final ArmIO io;
  private Goal goal = Goal.STOW;

  public Arm(ArmIO io) {
    this.io = io;
  }

  public void setGoal(Goal nextGoal) {
    goal = nextGoal;
  }

  public boolean atGoal() {
    return Math.abs(goal.positionRad() - io.readInputs().positionRad()) < 0.03;
  }

  @Override
  public void periodic() {
    // Read inputs, calculate output, apply limits, then log the result.
  }
}
```

Keep methods in physical units. `setGoalRadians` is clearer than `setSetpoint`, and `setVoltage` is clearer than `setOutput`.

## Commands own timing and interruption

```java
public Command moveArmTo(Goal goal) {
  return runOnce(() -> setGoal(goal))
      .andThen(waitUntil(this::atGoal))
      .withTimeout(1.5)
      .finallyDo(interrupted -> {
        if (interrupted) stop();
      });
}
```

A command should make its finish condition, timeout, requirements, and interrupted behavior easy to find. If a timeout is normal recovery rather than success, report it as a distinct result.

## Configuration is not logic

Put dimensions, gear ratios, limits, CAN identifiers, and tuning values in maintained configuration. Give each value a unit in its name or type.

```java
public record ArmConfig(
    int motorCanId,
    double gearRatio,
    double minAngleRad,
    double maxAngleRad,
    double currentLimitAmps) {}
```

Changing configuration should not require editing the control algorithm. Changing the algorithm should not silently change the robot's physical limits.

## Log decisions, not only sensor values

Sensor data can show that the arm did not move. Decision logs should show why.

```java
Logger.recordOutput("Arm/Goal", goal.name());
Logger.recordOutput("Arm/AllowedToMove", allowedToMove);
Logger.recordOutput("Arm/AtGoal", atGoal());
Logger.recordOutput("Arm/Fault", activeFault.name());
```

Use stable keys and consistent units. Renaming log fields every week makes comparisons and replay harder.

## Read from behavior into code

Begin with the observed action, identify the command or state requesting it, follow the subsystem interface, and then inspect configuration and hardware adapters. This is usually faster than searching for a motor identifier first.

## Review checklist

- Are physical units visible at system boundaries?
- Can hardware-specific code be replaced for a test?
- Are command requirements and interruption behavior explicit?
- Are limits enforced below the operator-binding layer?
- Can logs explain why an action was accepted or blocked?
- Does loss of a sensor or connection produce a defined response?
