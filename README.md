# starkhacks-website

A SvelteKit website for StarkHacks.

## Development

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying to Cloudflare Pages

This project uses `@sveltejs/adapter-cloudflare`. **Do not** use `npx wrangler deploy` as the build command—that targets Workers and will fail on `.svelte` files.

**In Cloudflare Pages (Git integration):**

1. **Framework preset:** SvelteKit (or leave default and set the options below).
2. **Build command:** `npm run build`
3. **Build output directory:** `.svelte-kit/cloudflare`

Cloudflare will run `npm run build`, then deploy the output from `.svelte-kit/cloudflare`. No custom deploy command is needed.

**For CLI deploy:** Run `npm run build`, then `npx wrangler pages deploy .svelte-kit/cloudflare --project-name=<your-project-name>`.

## Environment Variables

### Google Analytics

To enable Google Analytics tracking, you need to set the `PUBLIC_GA_ID` environment variable with your Google Analytics 4 (GA4) Measurement ID.

1. Get your GA4 Measurement ID from [Google Analytics](https://analytics.google.com/)
   - Format: `G-XXXXXXXXXX`

2. For local development, create a `.env` file in the root directory:
   ```bash
   PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. For production deployment:
   - **Netlify:** Site settings → Environment variables → Add `PUBLIC_GA_ID`
   - **Cloudflare Pages:** Project → Settings → Environment variables → Add `PUBLIC_GA_ID`

The Google Analytics component will automatically:
- Load the GA4 script
- Track page views on initial load
- Track page views on SvelteKit client-side navigation

## Project Structure

- `src/routes/` - Contains the routes/pages of your application
- `src/app.html` - The HTML template
- `src/app.css` - Global styles
- `static/` - Static assets (can be referenced from the root URL)