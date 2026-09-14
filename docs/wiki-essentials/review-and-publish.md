# Review and publish

Every wiki change goes through a pull request. Review protects technical accuracy, keeps the writing understandable, and records why the page changed.

## Before opening a pull request

Review the change as a reader, not only as its author.

- The subject belongs in the evergreen wiki.
- The page begins in language the whole team can understand.
- Technical claims, units, and code have been checked by someone familiar with the system.
- Safety limits and failure behavior are explicit where relevant.
- Headings describe the content and follow a sensible order.
- Links work and new pages appear in the sidebar.
- Images contain no credentials or private information.
- Light mode, dark mode, mobile, and keyboard use remain functional.
- `npm run docs:build` passes.

## Commit the change

Use a Conventional Commit message that says what the commit does:

```powershell
git add docs/
git commit -m "docs: explain motor current limits"
git push -u origin docs/describe-the-change
```

Use `docs:` for content-only changes, `fix:` for a defect, `feat:` for a new user-facing capability, and `ci:` for automation changes. Keep unrelated work in separate commits or pull requests.

## Open the pull request

On GitHub, select the branch and choose **Compare & pull request**. The description should answer:

1. What did this change add or correct?
2. Why will it help the team?
3. How was it checked?
4. Does a specialist need to verify a technical claim?

Screenshots are useful for theme, component, diagram, and responsive changes. They are usually unnecessary for a wording correction.

## Automated checks

The **Wiki CI** workflow installs dependencies and runs the VitePress production build for every pull request. A passing build proves that the site compiled; it does not prove that the explanation is correct or the page reads well on every device.

Do not merge while the build is failing. Open the failed job in GitHub **Actions**, read the first relevant error, fix it on the same branch, and push again.

## Review expectations

A reviewer should check the page at two levels:

- **Team clarity:** Could a student outside the specialty understand the purpose, behavior, and next action?
- **Technical integrity:** Are the interfaces, code, units, assumptions, and failure modes accurate enough for a specialist?

Review comments should identify a concrete problem or question. Authors should either make the change or explain why a different approach is safer or clearer.

## Merge and deployment

After approval and a passing build, the repository owner merges the pull request into `main`. The production workflow builds the wiki again and deploys it to Cloudflare Pages.

Watch both **Build wiki** and **Deploy production**. The change is published only when deployment succeeds. Then open [wiki-5025.pages.dev](https://wiki-5025.pages.dev/) and verify the affected page.

## Fix a published mistake

For a small error, open a focused correction pull request. For dangerous guidance, exposed credentials, or a change that prevents the site from working, notify the repository owner immediately and identify the exact page or deployment.

Do not rewrite Git history or delete a deployment unless a maintainer has confirmed that recovery requires it.
