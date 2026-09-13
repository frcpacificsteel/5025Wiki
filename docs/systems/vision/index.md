# Vision

Vision turns camera images into observations the robot can use. The result depends on the lens, camera mount, exposure, processing, geometry, timing, and the code that decides whether to trust it.

## Signal path

1. The camera captures an image at a known time.
2. A pipeline finds field features or game pieces.
3. Camera calibration turns pixels into angles and geometry.
4. The camera-to-robot transform places the observation in the robot frame.
5. Robot code checks age, ambiguity, distance, and consistency.
6. An accepted observation updates targeting or pose estimation.

Each step should expose enough information to tell whether it produced a usable result. A final pose alone is difficult to debug.

## Trust is measured

A detection is not enough by itself. Check when the image was captured, where the camera was, how uncertain the estimate is, and whether other sensors agree.

## Test across conditions

Test at different distances and angles, while moving, under field lighting, with blocked sightlines, and under normal network load. A workbench test does not cover field conditions.

## Define the measurement

A vision interface should return a measurement, not write directly into drivetrain state. Include the capture time and uncertainty so the consumer can decide how much weight to give it.

```java
public record VisionMeasurement(
    Pose2d fieldToRobot,
    double captureTimestampSeconds,
    Matrix<N3, N1> standardDeviations,
    int visibleTargetCount) {}

public interface VisionIO {
  Optional<VisionMeasurement> latestMeasurement();
}
```

This boundary keeps camera-specific APIs out of localization code and makes recorded measurements easy to replay in tests.

## Reject bad data explicitly

Write rejection rules as named checks. Avoid one large condition whose reason cannot be logged.

```java
private Optional<VisionMeasurement> validate(VisionMeasurement measurement) {
  double ageSeconds = Timer.getFPGATimestamp()
      - measurement.captureTimestampSeconds();

  if (ageSeconds > 0.35) {
    rejectionReason = "stale";
    return Optional.empty();
  }
  if (!fieldBounds.contains(measurement.fieldToRobot().getTranslation())) {
    rejectionReason = "outside-field";
    return Optional.empty();
  }
  if (measurement.visibleTargetCount() < 1) {
    rejectionReason = "no-targets";
    return Optional.empty();
  }
  return Optional.of(measurement);
}
```

Thresholds are robot- and camera-dependent. Keep them in configuration, log the rejection reason, and tune them from recorded data.

## Fuse by confidence

Pose estimators accept standard deviations because not every observation is equally reliable. Distance, target count, viewing angle, and calibration quality can all affect confidence.

```java
vision.latestMeasurement()
    .flatMap(this::validate)
    .ifPresent(measurement -> poseEstimator.addVisionMeasurement(
        measurement.fieldToRobot(),
        measurement.captureTimestampSeconds(),
        measurement.standardDeviations()));
```

Use the image capture timestamp, not the time the network packet arrived. Otherwise the estimator applies an old observation as though it were current.

## What to log

- Camera connection and frame rate
- Capture timestamp and measurement age
- Target count, ambiguity, and average distance
- Raw and accepted robot poses
- Standard deviations used for fusion
- Rejection count grouped by reason
- Camera-to-robot transform and calibration version

## Common failure patterns

| Symptom | Check first | Why |
| --- | --- | --- |
| Pose jumps while turning | Timestamp and camera transform | Rotational motion makes timing and transform errors obvious |
| Works nearby but not far away | Exposure, focus, and uncertainty model | A detection may remain valid while its pose estimate becomes weak |
| Consistent position offset | Field layout and camera transform | A fixed geometry error usually produces a repeatable offset |
| Robot pose moves while disabled | Stale frames or duplicate timestamps | Old observations may be accepted more than once |
| Network usage spikes | Stream resolution and publish rates | Driver video and processed results compete for bandwidth |

## For vision programmers

Be ready to work with camera calibration, transforms, latency compensation, AprilTag geometry, pose fusion, covariance, filtering, and rules for rejecting bad measurements.

Keep three frames distinct in code and discussion: field coordinates, robot coordinates, and camera coordinates. Name transforms by direction—for example, `robotToCamera`—because an inverted transform can still produce believable numbers.

::: warning Vision is advisory
Do not make a safety-critical motion depend on vision as its only source of truth. Define a timeout and a safe response for missing or rejected measurements.
:::
