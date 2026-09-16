---
title: Robot System Map
description: A durable model for understanding how robot systems interact.
aside: false
---

# Robot System Map

A competition robot runs as a control loop. People and sensors provide information, software chooses an action, hardware carries it out, and telemetry reports the result. The parts change each season; this loop does not.

<SystemMap />

Start with **Broad** to understand the durable system boundaries. Switch to **Detailed** to inspect the current template classes, readiness paths, publishers, and configuration dependencies. The print control fits the entire selected map to a landscape page rather than printing only the visible canvas area.

## Read the loop

Read from left to right. Controls and autonomous code request named goals. The superstructure coordinates those goals with mechanisms, while vision feeds measurements to drivetrain localization. Drivetrain and mechanisms do the physical work. Telemetry reports the result to operators and software.

Power and CAN communication support every stage. A fault there can look like a drivetrain, mechanism, sensor, or software problem, so check that path early.

## Use the boundaries

A system boundary should answer four questions: What does this system need? What does it provide? How can it fail? How can the rest of the robot tell what state it is in?

## Trace one interaction

When diagnosing behavior, trace one interaction from start to finish:

1. What requested the action?
2. What conditions allowed or prevented it?
3. What hardware received the command?
4. What evidence confirms the result?

Use the same sequence for driving, alignment, game-piece handling, or fault recovery.
