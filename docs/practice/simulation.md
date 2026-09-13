# Simulation and tests

Use the cheapest environment that can prove the behavior. Pure logic tests are fast, subsystem simulations exercise dynamics, and robot tests validate wiring and physics.

## Testing layers

<TechnicalDiagram type="test-layers" label="Testing progresses from pure unit tests and fake hardware through simulation, disabled checks, constrained enabled tests, and full-system validation." />

Do not skip directly to enabled hardware for logic that can be proven on a laptop.

## Test pure decisions

```java
@Test
void upperLimitBlocksPositiveVoltage() {
  Inputs inputs = new Inputs(1.2, 0.0, true, false, true);
  assertEquals(0.0, limits.apply(4.0, inputs), 1e-9);
  assertEquals(-4.0, limits.apply(-4.0, inputs), 1e-9);
}
```

Tests should describe behavior, not private implementation.

## Fake IO

A fake adapter records outputs and supplies controlled inputs. It can verify sensor disconnection, limits, timeouts, and state transitions without vendor hardware.

```java
final class FakeElevatorIO implements ElevatorIO {
  Inputs inputs = new Inputs(0, 0, 0, 0, true);
  double commandedVolts;

  public Inputs updateInputs() { return inputs; }
  public void setVoltage(double volts) { commandedVolts = volts; }
  public void stop() { commandedVolts = 0; }
}
```

## Test time explicitly

Commands, debouncers, and timeouts depend on scheduler time. Use the framework’s test timing support or inject a clock. Avoid tests that sleep and hope enough time passed.

## Hardware test record

Before enabling, state the expected motion, maximum output, stop condition, disable operator, and telemetry to watch. Afterward, record what happened—not only whether the test “worked.”
