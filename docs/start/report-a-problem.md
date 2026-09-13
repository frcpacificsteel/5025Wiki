# Report a robot problem

Anyone on the team can report a software problem. You do not need to know which file is wrong or how to fix it. A useful issue records what the robot did, what you expected, and enough context for someone else to reproduce it.

## Make the robot safe first

If the robot is moving unexpectedly, damaging itself, or creating a safety risk, disable it before writing anything down. Tell the drive coach, pit lead, or programming lead immediately.

Do not keep repeating a dangerous failure to collect better evidence.

## Choose the right repository

Robot behavior belongs in the repository for the current season’s robot code. Wiki errors belong in the `5025Wiki` repository.

1. Open the [Pacific Steel GitHub organization](https://github.com/frcpacificsteel).
2. Select the repository for the robot or project you were using.
3. Open the **Issues** tab.
4. Select **New issue**.
5. Choose one of the repository's issue templates. Do not select a blank issue or replace the form with your own format.

If you are unsure which repository to use, ask a programmer before submitting. Do not guess between competition, practice, and offseason robot projects.

## Choose the issue template

GitHub will show the templates available in that repository. Pick the one that matches what you need:

- **Bug report** — the robot or software behaved incorrectly, unsafely, or unreliably. Use this when robot code is not working.
- **Feature or improvement request** — you need the robot or software to do something it does not do yet, or an existing behavior should be improved.
- **Test session result** — you are recording what happened during an organized robot test, including measurements, evidence, and the next decision.
- **Programming task** — a scoped implementation task that programming has already discussed and triaged. Non-programmers normally should not start here.

For a general question or an idea that is not ready to become planned work, use the repository's **Team discussion** link or ask in the team chat first.

Complete the fields in the selected form. The prompts are there to collect the details programmers need, so do not delete them. If a field asks for technical information you do not know, write `Unknown` and describe what you observed instead.

## Write a searchable title

Name the system and the observed failure.

Good titles:

- `Elevator stops halfway to the scoring position`
- `Driver A button does not start intake`
- `Robot pose jumps after accepting vision`
- `Autonomous stops after the first path`

Avoid titles such as `Robot broken`, `Code issue`, or `Help`. They do not distinguish one failure from another.

## Report observations, not guesses

Write `the intake motor made no sound and Intake/MotorConnected was false`, not `the CAN code is broken` unless you verified that diagnosis. Incorrect theories can send troubleshooting in the wrong direction.

Useful details include:

- The exact controller button or autonomous routine used
- Whether the robot was disabled, autonomous, teleoperated, or in test mode
- The mechanism’s starting position
- Driver Station errors or warnings, copied exactly
- Whether the failure happens every time or only sometimes
- What changed immediately before the problem appeared
- A timestamp that helps programmers locate the event in a robot log

## Attach evidence carefully

Short video can show timing, direction, and operator actions. Photos can show wiring or dashboard state. Robot logs are usually the strongest evidence because they preserve requests, measurements, faults, and timestamps.

Before attaching anything, check that it does not contain passwords, API keys, private contact information, venue Wi-Fi credentials, or unrelated personal conversations.

## Choose urgency honestly

Use urgent language for a safety risk, a disabled drivetrain, or a failure blocking a scheduled match. A confusing dashboard label or optional improvement is still worth reporting, but it should not be marked as an emergency.

If the problem affects safety, tell a lead in person. A GitHub issue is a record, not an emergency notification system.

## After submitting

Keep the issue open until the team verifies the behavior on the correct robot. A code change or successful build does not prove the physical problem is fixed.

Respond when a programmer asks for a timestamp, log, or repeat test. When the fix is verified, add a short comment describing the successful test so the issue records both the failure and the evidence that closed it.

::: tip You are helping the programmers
A precise report saves time even when you cannot identify the cause. “I don’t know” is better than an invented diagnosis.
:::
