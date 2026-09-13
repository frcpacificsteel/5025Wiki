# Workstation setup

Set up the development environment once, then verify it against an unchanged project. A successful build separates workstation problems from code problems.

## Install the toolchain

Use the WPILib release selected by the team. It includes the supported JDK, VS Code extensions, Gradle tooling, simulation support, and vendor-library workflow. Avoid substituting a different Java installation until the standard toolchain works.

## Open and build the project

Open the project folder itself, not its parent, in the WPILib version of VS Code. Click the WPILib logo in the upper-right corner to open the WPILib Command Palette, then choose **Build Robot Code**.

Wait for `BUILD SUCCESSFUL` in the terminal. Build the unchanged project before editing anything. If it fails now, the problem is in the workstation, dependencies, or repository state rather than your change.

You can also press `Ctrl+Shift+P`, type `WPILib`, and select **WPILib: Build Robot Code**. Use the WPILib commands throughout this guide instead of VS Code's generic Run button.

## Commands used by the team

| Task | WPILib VS Code command | Use it when |
| --- | --- | --- |
| Compile the project | **Build Robot Code** | Before review and after code changes |
| Run without a robot | **Simulate Robot Code** | Checking commands, state changes, and supported device models |
| Send code to the roboRIO | **Deploy Robot Code** | The robot is connected and the test lead has approved deployment |
| Debug on the roboRIO | **Debug Robot Code** | A programmer needs breakpoints on the running robot |
| Add or update a vendor dependency | **Manage Vendor Libraries** | The project needs a supported CTRE, REV, or other vendor library |

**Deploy Robot Code** builds first, then transfers the program to the roboRIO. Do not switch off the robot during deployment. When deployment finishes, RioLog opens so you can read the robot program's output.

## Confirm the repository state

```bash
git status --short
git branch --show-current
git remote -v
```

Know which branch you are on before editing. Do not discard files you did not create; they may be another person’s uncommitted work.

## Vendor dependencies

Robot projects often depend on CTRE, REV, PathPlanner, AdvantageKit, or other libraries. Use **WPILib: Manage Vendor Libraries** to install or update them. Their JSON declarations belong in `vendordeps`. If classes cannot be resolved, confirm that the expected declaration is committed before reinstalling tools.

**Build Robot Code** proves the code compiles. It does not prove CAN IDs, motor direction, sensor offsets, or mechanism safety on the physical robot. **Simulate Robot Code** provides more evidence, but vendor devices may not support simulation completely.

## Common setup failures

| Symptom | First check |
| --- | --- |
| Java version error | Confirm the project is open in WPILib VS Code rather than another VS Code installation |
| Missing vendor class | Check `vendordeps` and internet access during dependency resolution |
| Build process will not start | Close WPILib VS Code, reopen the project folder, and run **Build Robot Code** again |
| Project builds for one teammate only | Compare committed wrapper and vendor dependency files |
| Simulation opens but robot code exits | Read the first exception, not the final shutdown messages |

Record the WPILib command you selected and the first relevant error when asking for help.
