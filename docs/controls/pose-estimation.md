# Pose estimation

Pose estimation combines drivetrain motion and external observations into a best estimate of robot position and heading.

## Information sources

Wheel encoders provide relative movement. A gyro provides heading change. Vision provides delayed, noisy observations tied to field landmarks.

<TechnicalDiagram type="pose" label="Wheel positions and gyro heading update the pose estimator. Vision measurements pass quality checks before correcting the estimated pose." />

## Update continuously

```java
poseEstimator.update(gyroRotation, modulePositions);
```

Use module distance positions for odometry. Velocity alone cannot recover the same integrated motion reliably.

## Add vision at measurement time

```java
if (estimate.isUsable()) {
  poseEstimator.addVisionMeasurement(
      estimate.pose(),
      estimate.timestampSeconds(),
      estimate.standardDeviations());
}
```

The timestamp matters because image processing and transport add latency. Quality checks should consider ambiguity, target count, distance, robot motion, field bounds, and camera health.

## Reset deliberately

Log every pose reset with its source and timestamp. Resetting gyro heading, changing alliance origin, and resetting the full pose are separate operations.

## Diagnose disagreement

Compare raw odometry, accepted vision measurements, rejected measurements, and fused pose. Sudden jumps usually indicate a frame transform, timestamp, field origin, or quality-filter problem—not merely “bad vision.”
