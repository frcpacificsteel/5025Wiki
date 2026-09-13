# Testing changes

Test from the safest, cheapest check to the most realistic one: static checks, simulation or hardware-free tests, controlled subsystem tests, full-robot tests, and practice.

Use the WPILib Command Palette in WPILib VS Code for normal team work. **Build Robot Code** is the compile check, **Simulate Robot Code** runs the desktop simulator, and **Deploy Robot Code** sends the program to the roboRIO after the hardware test is approved.

## Before enabling

- State the expected behavior and stop condition.
- Keep the test physically bounded.
- Assign one person to enable and disable.
- Make relevant telemetry visible.
- Confirm everyone nearby understands the test.

## Use a test ladder

Move to the next level only after the current one produces the expected evidence.

| Level | Example | What it proves |
| --- | --- | --- |
| Static | Run **WPILib: Build Robot Code**, format, inspect configuration | The project is internally consistent |
| Unit | Test a conversion or decision rule | Logic works for known inputs |
| Simulation | Run **WPILib: Simulate Robot Code** | Commands and state changes interact correctly |
| Bench | Move one actuator at limited output | Wiring, signs, sensors, and basic control are correct |
| Integrated | Run **WPILib: Deploy Robot Code**, then test connected systems | Boundaries and interlocks work together |
| Practice | Repeat a realistic cycle | Timing, usability, and reliability hold under load |

## Test behavior at the boundary

Prefer tests against a public system contract. This keeps them useful when vendor hardware or internal implementation changes.

```java
@Test
void blocksExtensionWhenPivotIsUnsafe() {
  FakePivotIO pivotIO = new FakePivotIO();
  FakeElevatorIO elevatorIO = new FakeElevatorIO();
  Superstructure superstructure = new Superstructure(pivotIO, elevatorIO);

  pivotIO.positionRad = 0.10;
  superstructure.requestHighScore();
  superstructure.periodic();

  assertEquals(0.0, elevatorIO.commandedVolts, 1e-9);
  assertEquals(BlockReason.PIVOT_NOT_CLEAR, superstructure.blockReason());
}
```

This test checks a safety rule and its explanation. It does not depend on a motor-controller library.

## Include failure cases

- Sensor disconnected or returning an invalid value
- Command interrupted halfway through motion
- Goal outside the configured range
- Timeout before completion
- Robot disabled and re-enabled
- Two systems requesting conflicting states
- Data arriving late or out of order

## Record the test

Use a short test note with enough detail for another person to repeat it:

```text
Change: Updated elevator homing timeout
Setup: Robot on blocks, carriage below midpoint, fresh battery
Expected: Motor moves down at 1.5 V and stops at switch within 2 s
Observed: Stopped at 1.18 s; state changed HOMING → READY
Evidence: log_2026-09-12_1423.wpilog
Remaining: Repeat after full practice cycle
```

## After the test

Capture the result while it is fresh. Record failures as observations before proposing causes.
