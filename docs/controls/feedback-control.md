# Feedback control

Feedback compares a measured state with a goal and changes the actuator command to reduce the error.

## PID terms

```text
error = setpoint - measurement
output = kP·error + kI·integral(error) + kD·rateOfError
```

- Proportional responds to current error.
- Integral responds to accumulated error and can wind up.
- Derivative responds to changing error and amplifies noise.

Most FRC mechanisms begin with proportional control plus feedforward. Add terms only to solve an observed problem.

```java
PIDController controller = new PIDController(kP, kI, kD);
controller.setTolerance(positionToleranceMeters, velocityToleranceMetersPerSecond);

double feedbackVolts = controller.calculate(positionMeters, goalMeters);
```

## Tuning order

1. Verify sensor units, sign, and update rate.
2. Verify output sign at a low safe voltage.
3. Add feedforward for known physical demand.
4. Increase proportional gain until response is useful but stable.
5. Add derivative only if damping is needed and measurement noise is controlled.
6. Add integral only when persistent error has a known cause and anti-windup is defined.

## Saturation and constraints

The controller may request more voltage than the robot can provide. Clamp the final output and log saturation. Motion profiles constrain velocity and acceleration so the goal remains physically achievable.

## `atGoal` is a policy

Require both position and velocity tolerance when settling matters. Consider how long the measurement must remain inside tolerance and what happens when the sensor is invalid.
