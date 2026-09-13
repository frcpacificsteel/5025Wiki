# Feedforward

Feedforward predicts the actuator effort needed for a desired motion. Feedback corrects the remaining error. Used together, they produce faster and more consistent control.

## Common model

```text
voltage = kS·sign(velocity) + kV·velocity + kA·acceleration
```

`kS` overcomes static friction, `kV` models velocity demand, and `kA` models acceleration demand. Elevators and arms also need gravity terms.

```java
double ffVolts = feedforward.calculate(setpoint.velocity, setpoint.acceleration);
double pidVolts = controller.calculate(measuredPosition, setpoint.position);
io.setVoltage(MathUtil.clamp(ffVolts + pidVolts, -12.0, 12.0));
```

## Why feedforward helps

A feedback-only controller must wait for error before reacting. Feedforward can request approximately the right effort immediately, leaving feedback to handle model error, friction changes, battery voltage, and load variation.

## Characterization

Estimate constants from measured voltage, velocity, and acceleration rather than guessing. Characterize the real mechanism in both directions where gravity or friction is asymmetric.

## Validation

Plot requested velocity, measured velocity, feedforward voltage, feedback voltage, and applied voltage. A large continuous feedback term suggests an incorrect model, units problem, or unmodeled load.
