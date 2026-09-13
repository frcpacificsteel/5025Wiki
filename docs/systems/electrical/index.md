# Electrical & CAN

The electrical system supplies power and carries device communication. Every other subsystem depends on it working under load.

## Power is a system

Trace energy from the battery through protection and distribution to each actuator. Wire size, connector quality, mechanical strain relief, current limits, and battery condition all affect delivered voltage.

## CAN is shared communication

Every CAN device shares the bus. Keep the topology valid, terminations secure, identifiers unique, status rates reasonable, and documentation matched to the physical robot.

## Diagnose with evidence

Inspect voltage, current, resistance, device presence, fault history, and physical connections before assuming a software defect.

## Follow both paths

Every controlled device has a power path and a communication path. Trace them separately.

```text
Power:         battery → main breaker → distribution → branch protection → device
Communication: roboRIO → CAN segment → device → next device → termination
```

A device may appear in software while lacking enough voltage to do useful work. It may also have full power but no valid command because communication is broken.

## Build a device inventory

Maintain one source of truth for CAN identifiers, bus names, breaker sizes, wire gauges, and expected firmware. Check it against the physical robot after rewiring.

```java
public final class CanIds {
  public static final int FRONT_LEFT_DRIVE = 1;
  public static final int FRONT_LEFT_STEER = 2;
  public static final int FRONT_LEFT_ENCODER = 3;

  private CanIds() {}
}
```

The exact structure can vary, but duplicate IDs should be difficult to introduce and easy to review.

## Read faults in context

Log battery voltage, total current, CAN utilization, receive errors, device resets, and brownout state together. A timestamped group of signals is more useful than a photo of one dashboard value.

| Symptom | Check first |
| --- | --- |
| Several devices reset together | Battery, main connections, and voltage under load |
| One device disappears intermittently | Connectors, strain relief, branch wiring, and termination path |
| Commands lag while devices remain present | CAN utilization and status-frame rates |
| Motor reports output but does not move | Branch power, breaker, controller output voltage, and mechanical load |
| Fault appears only during hard acceleration | Voltage sag, current limits, and connection resistance |

## Before enabling after service

1. Inspect polarity and exposed conductors.
2. Tug-test changed connections.
3. Confirm breaker and wire sizing.
4. Check the device inventory and CAN topology.
5. Power on with mechanisms in a safe position.
6. Confirm device presence before commanding motion.

::: danger De-energize before service
Follow team lockout and verification procedures before changing power wiring or working near stored mechanical energy.
:::
