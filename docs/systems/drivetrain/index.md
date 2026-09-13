# Drivetrain & swerve

The drivetrain turns a motion request into movement across the carpet. With swerve, each module controls wheel speed and steering angle, which lets the robot translate and rotate independently.

## Mental model

Follow the request through the system: the driver or autonomous routine requests chassis motion, kinematics calculates a state for each module, and the module controllers command wheel angle and speed.

```text
driver or path planner
        ↓ ChassisSpeeds
coordinate conversion and limits
        ↓ ChassisSpeeds
swerve kinematics
        ↓ SwerveModuleState[4]
module steering and drive loops
        ↓ voltage/current
wheel contact with the carpet
```

Name the coordinate frame at every boundary. Field-relative motion, robot-relative motion, and module-relative steering angles are different quantities even when they use the same units.

## What good behavior looks like

- All modules agree on forward and rotate through the shortest sensible path.
- The robot tracks commanded motion without persistent drift or oscillation.
- Odometry changes consistently with physical movement.
- A disabled or faulted sensor produces an observable, safe response.

## Diagnose before tuning

Verify mechanical freedom, wheel orientation, sensor direction, encoder offsets, motor inversion, and units before changing controller gains. Tuning cannot correct an incorrect coordinate frame.

## Keep requests separate from limits

The caller describes desired chassis motion. The drivetrain applies physical limits and converts it to module states.

```java
public void driveRobotRelative(ChassisSpeeds requested) {
  ChassisSpeeds limited = limiter.calculate(requested);
  SwerveModuleState[] states = kinematics.toSwerveModuleStates(limited);
  SwerveDriveKinematics.desaturateWheelSpeeds(states, maxSpeedMetersPerSecond);

  for (int i = 0; i < modules.length; i++) {
    modules[i].setDesiredState(states[i]);
  }
}
```

Desaturation preserves the direction of the requested chassis motion while scaling wheel speeds to what the hardware can produce.

## Optimize at the module

```java
SwerveModuleState optimized = desired.optimize(currentAngle);
driveController.setSetpoint(optimized.speedMetersPerSecond);
steerController.setSetpoint(optimized.angle.getRadians());
```

Optimization chooses an equivalent wheel direction that requires less steering rotation. Verify sensor direction and angle wrapping before relying on it.

## Odometry and pose

Wheel positions describe how far each module traveled. The gyro supplies heading. Odometry combines them into a pose estimate; vision can correct accumulated error.

```java
poseEstimator.update(
    gyro.getRotation2d(),
    Arrays.stream(modules)
        .map(SwerveModule::getPosition)
        .toArray(SwerveModulePosition[]::new));
```

Use distance for odometry, not wheel velocity. Keep gyro resets, field-origin changes, and pose resets explicit and logged.

## Useful telemetry

- Requested and measured chassis speeds
- Desired and measured state for every module
- Steering error and drive velocity error
- Absolute and relative encoder angles
- Gyro heading and connection state
- Estimated pose and vision corrections
- Motor voltage, current, temperature, and faults

## For drivetrain programmers

Treat coordinate systems, swerve kinematics, odometry, pose estimation, feedforward, feedback control, current limits, and traction as parts of the same motion system.

::: tip Tuning order
Confirm units, signs, offsets, and mechanical freedom. Tune steering next, then wheel velocity, then whole-robot motion. Change one layer at a time.
:::

::: warning Safety boundary
Perform initial steering and drive checks with the robot supported safely and an operator ready to disable it.
:::
