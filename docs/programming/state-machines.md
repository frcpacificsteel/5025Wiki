# State machines

State machines make modes, transitions, and failure behavior explicit. Use them when several booleans would otherwise describe one operating condition.

## State and goal are different

The goal is what another part of the robot requests. State is what the mechanism is currently doing or able to do.

```java
enum State { UNINITIALIZED, HOMING, READY, MOVING, FAULTED }
enum Goal { STOW, INTAKE, SCORE }
```

A mechanism can have goal `SCORE` while state `HOMING`; that does not mean it may move toward the score position yet.

## Define transitions centrally

```java
private State nextState(State current, Inputs in) {
  return switch (current) {
    case UNINITIALIZED -> homingRequested ? State.HOMING : current;
    case HOMING -> {
      if (homingTimedOut()) yield State.FAULTED;
      if (in.homeSwitch()) yield State.READY;
      yield current;
    }
    case READY, MOVING -> in.encoderConnected() ? desiredOperatingState() : State.FAULTED;
    case FAULTED -> resetApproved && sensorsValid(in) ? State.UNINITIALIZED : current;
  };
}
```

Keep transition causes visible. Scattered assignments make impossible transitions difficult to find.

## Log transitions as events

```java
if (next != state) {
  eventLog.append("Elevator state: " + state + " -> " + next);
  state = next;
}
```

Tests should cover every allowed transition and verify that forbidden transitions remain blocked.
