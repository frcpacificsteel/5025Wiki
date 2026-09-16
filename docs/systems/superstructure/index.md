# Superstructure

The superstructure is the coordination layer between high-level robot intent and individual mechanisms. Controls and autonomous code request a goal; the superstructure decides which mechanism actions are allowed, in what order, and what status the rest of the robot should see.

It prevents a controller binding or auto routine from reaching into a motor subsystem and bypassing a safety rule. That boundary becomes more important as mechanisms begin to share space, power, sensors, and sequencing requirements.

## Request goals, not mechanism outputs

The 5025 template defines game-neutral `SuperstructureGoal` values. The current starting goals are `STOW`, `PRIMARY_ACTION`, and `MANUAL_OVERRIDE`; replace or extend them after kickoff without changing the control architecture.

```java
driver.runPrimaryGoal()
    .onTrue(superstructure.requestGoal(SuperstructureGoal.PRIMARY_ACTION));

operator.stow()
    .onTrue(superstructure.requestGoal(SuperstructureGoal.STOW));
```

Bindings name an operator's intent. The superstructure converts that intent into mechanism behavior, so controller code never needs to know a motor direction, voltage, encoder value, or interlock condition.

## Keep the request path visible

For any action, the team should be able to trace this path:

```text
Driver or autonomous request
  → SuperstructureGoal
  → superstructure coordination and interlocks
  → mechanism subsystem output
  → sensors, faults, and telemetry
```

When a mechanism does not move, start with the requested goal and status detail. A valid button press or selected auto does not prove the mechanism is ready, homed, connected, or safe to move.

## Publish a status contract

The template exposes an immutable status snapshot for autonomous preflight and telemetry:

```java
public record SuperstructureStatus(
    SuperstructureGoal requestedGoal,
    boolean ready,
    String detail) {}
```

`ready` answers whether the coordinated mechanism set can safely participate in an action. `detail` explains why it cannot. Keep that explanation specific enough to direct the next check—for example, an unhomed elevator, a disconnected sensor, or an active interlock.

## Coordinate transitions, not only endpoints

Two requested states may both be safe while the direct path between them is not. The superstructure should define intermediate states and sequencing rules when mechanisms can collide, block one another, or overload the electrical system.

```java
switch (requestedGoal) {
  case STOW -> requestSafeStowSequence();
  case PRIMARY_ACTION -> requestPrimaryActionSequence();
  case MANUAL_OVERRIDE -> requestControlledManualMotion();
}
```

Real implementations often need checks such as “pivot clears before elevator extends” or “roller stops before arm retracts.” Keep those rules in the coordination layer or in the owning mechanism safety boundary—not in controller bindings or a one-off autonomous command.

## Treat manual override as a controlled state

Manual override is not a shortcut around hardware safety. The template enters `MANUAL_OVERRIDE` only while the request is held, then returns to `STOW` when released. Hard interlocks, sensor validity, and fault handling still apply.

Limit any override to an intentional testing context, make it visible in telemetry, and define a safe release behavior before allowing it near a moving robot.

## Gate autonomous on readiness

An auto that needs a mechanism should check superstructure readiness before it begins its dependent action. The template supplies `isReadyForAuto()` and a `safeStopCommand()` that requests `STOW` when recovery is needed.

```java
Command scoreWhenReady = Commands.either(
    auto.goal(SuperstructureGoal.PRIMARY_ACTION),
    auto.stow(),
    superstructure::isReadyForAuto);
```

An autonomous routine should log a blocked condition and take a safe fallback rather than pretending a scoring action completed.

## What to log

- Requested goal
- Ready state and detail
- Active coordination step or transition
- Per-mechanism readiness, homing state, and blocker
- Fault-clearing events and manual-override state
- Commands or autos blocked by readiness

These values let the team separate an operator request problem from a coordination, mechanism, sensor, or electrical problem.

## Test the coordination boundary

- Request each goal from a known safe state.
- Interrupt a transition and verify the safe response.
- Simulate a missing homing signal, sensor, or mechanism fault.
- Request two incompatible goals in quick succession.
- Verify autonomous takes its documented fallback when readiness is false.
- Release manual override and confirm the robot returns to a defined safe goal.

The superstructure should make unsafe or unavailable behavior explainable, not merely prevent motion without context.
