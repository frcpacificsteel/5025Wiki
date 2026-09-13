# Subsystems and hardware IO

A subsystem owns one robot capability and its safety boundary. Hardware-specific APIs should not leak through the rest of the project.

## IO boundary

```java
public interface ElevatorIO {
  record Inputs(
      double positionMeters,
      double velocityMetersPerSecond,
      double appliedVolts,
      double supplyCurrentAmps,
      boolean encoderConnected) {}

  Inputs updateInputs();
  void setVoltage(double volts);
  void stop();
}
```

Implementations can target real motor controllers, simulation, or tests. The subsystem consumes the same snapshot regardless of source.

## Periodic data flow

Use a consistent order: read inputs, update state, calculate the requested output, apply safety limits, write output, then log the decision.

```java
@Override
public void periodic() {
  Inputs inputs = io.updateInputs();
  updateState(inputs);

  double requestedVolts = controller.calculate(inputs.positionMeters(), goal.heightMeters());
  double safeVolts = limits.apply(requestedVolts, inputs);
  io.setVoltage(safeVolts);

  Logger.recordOutput("Elevator/RequestedVolts", requestedVolts);
  Logger.recordOutput("Elevator/AppliedVolts", safeVolts);
}
```

Logging both values explains whether control or safety logic limited the output.

## Public API

Expose physical goals and meaningful status, not raw vendor controls.

```java
public void requestGoal(ElevatorGoal goal)
public boolean atGoal()
public boolean isHomed()
public Optional<Fault> activeFault()
```

Commands should not set motor duty cycle, change encoder positions, or clear faults through a subsystem’s public operating API.

## Fault behavior

Define responses for disconnected sensors, invalid values, stalled motion, limit disagreement, and failed homing. A safe output alone is insufficient; the reason must be observable.
