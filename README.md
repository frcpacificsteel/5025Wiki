# Pacific Steel 5025 Wiki

An evergreen, systems-based robotics knowledge library for the whole team.

## Local development

```powershell
npm.cmd install
npm.cmd run docs:dev
```

## Production build

```powershell
npm.cmd run docs:build
```

## Wiki assistant

The assistant uses a Cloudflare Pages Function at `/api/ask` and Groq's `openai/gpt-oss-20b` model. The API key must never be added to VitePress code or committed to the repository.

For local function testing, create an ignored `.dev.vars` file:

```dotenv
GROQ_API_KEY=your_groq_key
```

Build the site, then run it through the Pages development server:

```powershell
npm.cmd run docs:build
npx.cmd wrangler pages dev
```

For deployment, create a Cloudflare Pages project with:

- Build command: `npm run docs:build`
- Build output: `docs/.vitepress/dist`
- Secret: `GROQ_API_KEY`
- Variable: `ALLOWED_ORIGIN` set to the site's full origin, such as `https://wiki.team5025.com`

The function fixes the model and system instructions server-side, limits prompt size, permits only wiki page paths as sources, and streams plain text back to the browser.

The site content lives in `docs/`. Keep durable robotics knowledge here; keep season-specific robot implementation details in that season's robot repository.
