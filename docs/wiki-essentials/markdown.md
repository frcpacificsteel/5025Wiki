# Markdown reference

VitePress turns Markdown files into wiki pages. Standard Markdown handles most documentation; VitePress adds code highlighting, custom containers, and Vue components.

## Headings

Use one `#` heading for the page title. Continue in order without skipping levels.

```md
# Page title

## Main section

### Detail within that section
```

Headings become link targets and populate **On this page**. Keep them short, specific, and unique within the page.

## Emphasis and inline code

```md
Use **bold** for a term or action that needs emphasis.
Use *italics* sparingly for a new term.
Use `inline code` for filenames, commands, classes, methods, and values.
```

Do not use bold as a substitute for headings. Use monospace only for code or literal technical values.

## Lists

```md
- Unordered item
- Another item

1. First step
2. Second step
3. Third step
```

Use numbered lists when order matters. Start each step with an action. Use bullets when order does not matter.

## Links

Use relative links for other wiki pages:

```md
Read [Testing changes](../practice/testing).
Read [Vision](../systems/vision/).
```

Use the complete address for external sites:

```md
See the [WPILib documentation](https://docs.wpilib.org/).
```

Write link text that identifies the destination. Avoid `click here` because it loses meaning out of context.

## Images

Place shared images in `docs/public/assets/`, then reference them from the site root:

```md
![A descriptive explanation of the image](/assets/example-diagram.png)
```

Alternative text should communicate the image's purpose. For a purely decorative image, use empty alternative text: `![](/assets/decoration.svg)`.

## Tables

```md
| Signal | Unit | Meaning |
| --- | --- | --- |
| Position | meters | Distance along the mechanism axis |
| Velocity | meters per second | Rate of position change |
```

Use tables for genuine comparisons or repeated fields. Keep cells concise. A long procedure is easier to read as headings and steps, especially on mobile.

## Quotes

```md
> Record what the robot did before deciding why it happened.
```

Quotes are for attributed language or a short principle. Use a custom container for warnings and operational notes.

## Code blocks

Name the language after the opening fence so VitePress can highlight it:

````md
```java
public boolean atGoal() {
  return Math.abs(goalMeters - positionMeters) < toleranceMeters;
}
```
````

Common labels include `java`, `json`, `yaml`, `bash`, `powershell`, `text`, and `md`. Team commands should normally use `powershell` because development happens on Windows.

Highlight important lines with brace notation:

````md
```java{2,4}
public void setGoal(double goalMeters) {
  this.goalMeters = goalMeters;
  controller.setGoal(goalMeters);
  Logger.recordOutput("Mechanism/GoalMeters", goalMeters);
}
```
````

Code samples should compile conceptually, use explicit units, and contain enough context to explain the pattern. Do not paste an entire season subsystem when a focused example will do.

## Custom containers

```md
::: info Why this matters
Measurements need units so logs and APIs cannot be misread.
:::

::: tip Test strategy
Verify the smallest behavior before integrating the whole robot.
:::

::: warning Robot safety
Disable the robot before inspecting wiring or moving mechanisms by hand.
:::

::: danger Immediate hazard
Stop the test if the mechanism can damage itself or injure someone.
:::
```

Use `warning` and `danger` only for real risk. Too many callouts make important information easier to ignore.

## Escaping Markdown

Add a backslash before a character when Markdown should display it literally:

```md
\*This displays asterisks instead of italics.\*
```

For a Markdown example that contains a code block, wrap the example in four backticks so it can contain an ordinary three-backtick fence.

## Raw HTML and Vue

VitePress accepts HTML and registered Vue components inside Markdown. Use them only when Markdown cannot express the content. Custom behavior adds maintenance cost and must remain keyboard accessible, responsive, and compatible with light and dark modes.

