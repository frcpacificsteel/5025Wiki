# Units and coordinate frames

Many robot bugs are mathematically valid calculations performed in the wrong unit or reference frame.

## Name every frame

- Field frame: fixed to the field.
- Robot frame: fixed to the chassis.
- Mechanism frame: fixed to a joint or assembly.
- Camera frame: fixed to the camera lens and orientation.

```java
ChassisSpeeds robotRelative = ChassisSpeeds.fromFieldRelativeSpeeds(
    fieldVxMetersPerSecond,
    fieldVyMetersPerSecond,
    omegaRadiansPerSecond,
    robotHeading);
```

The heading is required because a field-forward request changes meaning as the robot rotates.

## Rotations and translations

`Rotation2d` represents an angle. `Translation2d` represents an x/y displacement. `Pose2d` combines a translation and orientation. `Transform2d` represents a relative change between poses.

Do not use a pose when you mean a transform; the operations encode different questions.

## Units at boundaries

Convert vendor-native rotations, encoder ticks, or RPM once near the hardware boundary. Keep mechanism logic in meters, radians, seconds, volts, and amperes.

```java
double mechanismRadians = motorRotations * 2.0 * Math.PI / gearRatio;
```

Document whether a gear ratio is motor rotations per mechanism rotation or the inverse.

## Sign conventions

Choose positive directions before writing controllers. Verify each sensor and motor independently, then log requested and measured direction together.
