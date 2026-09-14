# Run the wiki locally

Local preview catches broken links, unreadable diagrams, layout problems, and code-block mistakes before they reach the team.

## Requirements

- Git
- Node.js 22
- npm
- A code editor; VS Code is the normal choice for this repository

The repository records exact package versions in `package-lock.json`. Use `npm ci` so your installation matches the automated build.

## First setup

Open PowerShell in the folder where you keep projects:

```powershell
git clone https://github.com/frcpacificsteel/5025Wiki.git
cd 5025Wiki
npm ci
```

If you already have the repository, update `main` before starting:

```powershell
git switch main
git pull --ff-only
npm ci
```

## Create a branch

Never build a documentation change directly on `main`.

```powershell
git switch -c docs/describe-the-change
```

Use a short name such as `docs/add-can-troubleshooting` or `fix/vision-units`.

## Start the development server

```powershell
npm run docs:dev
```

Open the localhost address printed in the terminal, normally `http://127.0.0.1:5173/`. VitePress updates the page as files change. Keep the terminal running while you edit.

## Check the production build

Stop the development server with `Ctrl+C`, then run:

```powershell
npm run docs:build
```

This must finish successfully before opening a pull request. Generated output is written to `docs/.vitepress/dist/`; do not commit that folder.

To inspect the production output locally:

```powershell
npm run docs:preview
```

## What to test

- Follow every new or changed link.
- Use the sidebar and **On this page** navigation.
- Check a narrow mobile width and a wide desktop window.
- Switch between light and dark appearances.
- Navigate with Tab, Shift+Tab, Enter, and Escape.
- Verify code blocks scroll instead of widening the page.
- Confirm tables remain usable on a narrow screen.
- Read diagram labels and explanations without relying on color.

## Common build problems

| Problem | First check |
| --- | --- |
| Page is missing | File is inside `docs/` and ends in `.md` |
| Sidebar link returns 404 | Link matches the folder and filename without `.md` |
| Component is unknown | Component is registered in `theme/index.ts` |
| Diagram is blank | Mermaid syntax and the component's `type` value |
| Dependency errors | Run `npm ci` from the repository root |
| Local build differs from CI | Use Node.js 22 and commit the lockfile when dependencies change |
