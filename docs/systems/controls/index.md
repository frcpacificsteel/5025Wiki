# Controls

Controls turn driver and operator input into robot actions. A good layout matches how the operators think about the task, shows what the robot is doing, and always leaves a quick way to stop.

## Design around tasks

Map controls to meaningful actions rather than individual motors. Keep common actions easy to reach, make conflicting actions difficult to trigger accidentally, and test with the actual operators.

## Feedback closes the loop

Drivers need confirmation from robot motion, controller feedback, lights, sound, or the dashboard. They should be able to tell whether an action was accepted, is running, finished, or was blocked.

## Bind intent, not motors

```java
operator.a().onTrue(superstructure.requestScoreHigh());
operator.b().onTrue(superstructure.requestStow());
driver.leftBumper().whileTrue(drivetrain.precisionMode());
```

Bindings should read like operator actions. Motor directions, voltages, and interlocks belong in the systems that own them.

## Shape analog input once

Deadband and response curves should be shared and testable rather than repeated in every binding.

```java
static double shapeAxis(double raw, double deadband) {
  double value = MathUtil.applyDeadband(raw, deadband);
  return Math.copySign(value * value, value);
}
```

Log raw and shaped values when tuning. A curve that feels precise to one driver may feel delayed to another.

## Make state clear

Use named states for persistent operator choices such as scoring level or drive orientation. Reset or preserve them at mode changes deliberately.

```java
public enum ScoringLevel { LOW, MID, HIGH }

private ScoringLevel selectedLevel = ScoringLevel.MID;
```

Do not use button state itself as the robot's memory. The requested state should be available to commands, lights, dashboards, and logs.

## Review with the drive team

- Can the robot be stopped quickly from every action?
- Are frequent actions reachable without looking down?
- Can two controls request conflicting states?
- Is there feedback when an action is blocked?
- What resets when the robot disables or changes mode?
- Can a substitute operator understand the layout?

## For controls programmers

Pay close attention to command scheduling, triggers, debouncing, default commands, mode handling, haptics, operator state, and what happens when an action is interrupted.
