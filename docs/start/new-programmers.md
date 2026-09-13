# New programmer path

Robot programming is software engineering tied to moving hardware. You do not need to understand the whole robot before contributing, but you must know how to make a small change safely and prove what it did.

## What you are learning

The first goal is not “write autonomous.” It is to trace one behavior from an operator request to a command, a subsystem, hardware output, and telemetry.

<TechnicalDiagram type="beginner-loop" label="A driver input schedules a command that requests a subsystem goal. The controller drives hardware, sensors report the result, and telemetry records the decision." />

## The learning sequence

1. Complete [workstation setup](/start/workstation-setup) and run **WPILib: Build Robot Code** without editing the project.
2. Read [Java for robot code](/programming/java-for-robotics).
3. Learn the [project anatomy](/programming/project-anatomy).
4. Follow the [command-based architecture](/programming/command-based) from a button binding into a subsystem.
5. Make a documentation or telemetry-only change and submit it for review.
6. Add or modify one small command with a clear finish condition.
7. Run **WPILib: Simulate Robot Code** when the project supports it, then follow the team’s robot test process.

## Your first code-reading exercise

Choose one driver action. Find where the controller button is bound, identify the scheduled command, list its subsystem requirements, and find the method that ultimately writes to hardware.

Write down:

- What starts the behavior?
- What keeps it running?
- What ends or interrupts it?
- What physical units cross each boundary?
- What telemetry proves it worked?
- What happens if a sensor disconnects?

If any answer is unclear, that is useful review feedback.

## A safe first change

Good first changes are observable and easy to reverse: improve a log key, add a missing connection signal, clarify a command name, or add a unit test around pure logic.

```java
Logger.recordOutput("Intake/RequestedState", requestedState.name());
Logger.recordOutput("Intake/BeamBreakBlocked", inputs.beamBreakBlocked());
Logger.recordOutput("Intake/MotorConnected", inputs.motorConnected());
```

Do not begin by changing CAN identifiers, current limits, inversion, encoder offsets, or closed-loop gains. Those values can move hardware unexpectedly.

## Definition of done

A beginner change is complete when **Build Robot Code** succeeds, the relevant test passes, the expected telemetry is visible, failure behavior is understood, and another programmer can explain the change from the diff.

::: warning Robot testing
Never enable a mechanism because the code “looks right.” Use the team’s safety process, announce the test, establish a disable operator, and begin with constrained motion.
:::
