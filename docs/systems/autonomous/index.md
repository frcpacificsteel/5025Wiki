# Autonomous

Autonomous code carries out a goal without continuous driver input. Keep the goal, plan, execution, feedback, and recovery separate enough that each can be tested.

## Design for changing reality

The field will not always match the plan. Before continuing a sequence, check that the next action is still useful and reachable.

## Build in layers

1. Prove each action manually.
2. Compose short deterministic sequences.
3. Add path following and localization.
4. Add conditional behavior and recovery.
5. Validate under realistic timing and starting error.

## Make outcomes visible

An action should report more than “finished.” It may succeed, time out, become unsafe, lose its target, or no longer be useful.

```java
public enum ActionResult {
  RUNNING,
  SUCCEEDED,
  TIMED_OUT,
  BLOCKED,
  LOST_TARGET
}
```

Keep the result in telemetry and use it when choosing the next action. A timeout that silently advances the routine is difficult to distinguish from success.

## Compose small commands

```java
Command acquirePiece = Commands.sequence(
    intake.deploy(),
    intake.runUntilDetected().withTimeout(1.25),
    intake.hold()
).finallyDo(interrupted -> intake.stopRoller());

Command scoreIfReady = Commands.either(
    scorer.score(),
    Commands.none(),
    () -> localization.isReliable() && scorer.hasPiece());
```

Each command should also work in isolation. That lets the team prove mechanisms manually before adding paths and branching logic.

## Treat time as a budget

Give each stage a maximum duration and reserve time for the actions that matter most. Log both the planned and actual duration.

```java
double remainingSeconds = autonomousEndTime - Timer.getFPGATimestamp();
boolean canAttemptAnotherCycle = remainingSeconds > estimatedCycleSeconds + reserveSeconds;
```

An estimate should include normal variation, not only the fastest practice run.

## Test recovery cases

- Start with position and heading error.
- Remove or move an expected game piece.
- Delay a mechanism beyond its usual completion time.
- Temporarily reject vision measurements.
- Prevent one action and confirm the next decision is safe.
- Run with the same battery and network conditions expected on the field.

## For autonomous programmers

The core tools are command composition, trajectory constraints, path following, pose estimation, event markers, time budgets, state machines, and clearly defined failure behavior.

Keep path files as data and behavior choices in code. A path should describe geometry and constraints; it should not become the only place where the sequence of robot actions can be understood.
