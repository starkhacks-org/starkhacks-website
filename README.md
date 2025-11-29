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

## Project Structure

- `src/routes/` - Contains the routes/pages of your application
- `src/app.html` - The HTML template
- `src/app.css` - Global styles
- `static/` - Static assets (can be referenced from the root URL)