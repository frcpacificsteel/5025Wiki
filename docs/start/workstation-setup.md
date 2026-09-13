# Workstation setup

Set up the development environment once, then verify it against an unchanged project. A successful build separates workstation problems from code problems.

## Install the toolchain

Use the WPILib release selected by the team. It includes the supported JDK, VS Code extensions, Gradle tooling, simulation support, and vendor-library workflow. Avoid substituting a different Java installation until the standard toolchain works.

## Open and build the project

Open the project folder itself, not its parent. In a terminal at the repository root:

```powershell
./gradlew.bat assemble
```

On macOS or Linux:

```bash
./gradlew assemble
```

The Gradle wrapper pins the build tooling used by the repository. A local Gradle installation is not required.

## Confirm the repository state

```bash
git status --short
git branch --show-current
git remote -v
```

Know which branch you are on before editing. Do not discard files you did not create; they may be another person’s uncommitted work.

## Vendor dependencies

Robot projects often depend on CTRE, REV, PathPlanner, AdvantageKit, or other libraries. Their JSON declarations belong in `vendordeps`. If classes cannot be resolved, check that the repository contains the expected dependency declaration before reinstalling tools.

## Useful verification commands

```powershell
./gradlew.bat test
./gradlew.bat simulateJava
./gradlew.bat tasks
```

`assemble` proves the code compiles. It does not prove CAN IDs, motor direction, sensor offsets, or mechanism safety on the physical robot.

## Common setup failures

| Symptom | First check |
| --- | --- |
| `JAVA_HOME` or Java version error | Launch the WPILib terminal and verify the selected JDK |
| Missing vendor class | Check `vendordeps` and internet access during dependency resolution |
| Gradle daemon failure | Stop daemons with `./gradlew.bat --stop`, then rebuild |
| Project builds for one teammate only | Compare committed wrapper and vendor dependency files |
| Simulation opens but robot code exits | Read the first exception, not the final shutdown messages |

Record the exact command and first relevant error when asking for help.
