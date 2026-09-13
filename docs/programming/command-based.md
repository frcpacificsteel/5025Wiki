# Command-based architecture

Command-based robot code separates what the robot can do from when it should do it. Subsystems own capabilities. Commands coordinate those capabilities. Triggers decide when commands are scheduled.

## Scheduler model

The command scheduler runs every robot loop. It polls triggers, schedules new commands, executes scheduled commands, ends finished commands, and calls subsystem periodic methods.

<TechnicalDiagram type="scheduler" label="Each robot loop runs the command scheduler, which polls triggers, runs command lifecycle methods, and updates subsystems." />

## Requirements prevent conflicts

Commands declare the subsystems they require. Scheduling another command with the same requirement interrupts the current command unless composition says otherwise.

```java
public final class RunIntake extends Command {
  private final Intake intake;

  public RunIntake(Intake intake) {
    this.intake = intake;
    addRequirements(intake);
  }
}
```

Missing requirements allow two commands to fight over one actuator. Excess requirements block unrelated work.

## Lifecycle

- `initialize()` runs once when scheduled.
- `execute()` runs every scheduler cycle.
- `isFinished()` decides normal completion.
- `end(interrupted)` runs for both completion and interruption.

```java
@Override
public void end(boolean interrupted) {
  intake.setGoal(IntakeGoal.IDLE);
  Logger.recordOutput("Commands/RunIntake/Interrupted", interrupted);
}
```

Cleanup must be correct for both paths. Never assume a command only ends normally.

## Composition

Use sequence when order matters, parallel groups when actions can overlap, race when the first completion should end all work, and deadline when one command defines the group lifetime. Make timeout behavior explicit; timing out is usually not the same as succeeding.
