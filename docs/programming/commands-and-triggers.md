# Commands and triggers

Commands describe actions. Triggers convert operator or robot conditions into scheduling decisions.

## Choose binding semantics deliberately

```java
driver.a().whileTrue(intake.acquireCommand());
driver.b().onTrue(intake.stowCommand());
driver.x().toggleOnTrue(drivetrain.precisionModeCommand());
```

- `onTrue` schedules once at the rising edge.
- `whileTrue` keeps the command associated with the held condition.
- `toggleOnTrue` persists state and therefore needs a clear operator indication.

## Prefer command factories

```java
public Command acquireCommand() {
  return startEnd(
      () -> requestGoal(IntakeGoal.ACQUIRE),
      () -> requestGoal(IntakeGoal.IDLE));
}
```

The subsystem can provide commands that preserve its requirements and cleanup rules. The controls layer decides which input uses them.

## Finish conditions must mean something

```java
return run(() -> requestGoal(goal))
    .until(this::atGoal)
    .withTimeout(1.5)
    .finallyDo(interrupted -> recordResult(interrupted, atGoal()));
```

A timeout prevents an endless command, but it should not silently report success. Record whether the goal was reached.

## Defaults

A default command runs when no other command requires the subsystem. Drivetrain teleoperation is a common example. Defaults should tolerate being interrupted and resumed at any time.

## Review questions

- Does the command require every subsystem it writes to?
- Can it finish, time out, or be canceled safely?
- Does interruption leave a known goal?
- Can the driver tell whether a toggle is active?
- Is the binding separate from mechanism safety?
