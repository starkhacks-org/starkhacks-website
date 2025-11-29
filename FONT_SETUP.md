# How to Add Your Custom Font

Follow these steps to add your downloaded custom font to the project:

## Step 1: Place Font Files

1. Copy your font files (`.woff2`, `.woff`, `.ttf`, or `.otf`) into the `static/fonts/` directory
2. Common font formats (in order of preference):
   - `.woff2` - Best compression, modern browser support
   - `.woff` - Good compression, wide browser support
   - `.ttf` - Larger file size but universal support
   - `.otf` - Similar to TTF

## Step 2: Define @font-face in CSS

1. Open `src/app.css`
2. Find the commented-out `@font-face` examples
3. Uncomment and customize them with your font details:

```css
@font-face {
  font-family: "YourFontName"; /* Change to your font's name */
  src: url("/fonts/YourFont-Regular.woff2") format("woff2"), url("/fonts/YourFont-Regular.woff")
      format("woff");
  font-weight: 400; /* Regular weight */
  font-style: normal;
  font-display: swap; /* Ensures text is visible during font load */
}
```

4. Add additional `@font-face` rules for different weights/styles if you have them:
   - Bold: `font-weight: 700;`
   - Italic: `font-style: italic;`
   - Light: `font-weight: 300;`

## Step 3: Use the Font

Update the `font-family` in the `:root` selector in `src/app.css`:

```css
:root {
  font-family: "YourFontName", Inter, system-ui, Avenir, Helvetica, Arial,
    sans-serif;
  /* ... rest of your styles */
}
```

Or use it in specific components by adding a style tag:

```svelte
<style>
	.custom-text {
		font-family: 'YourFontName', sans-serif;
	}
</style>
```

## Example: Complete Setup

If your font files are:

- `static/fonts/MyFont-Regular.woff2`
- `static/fonts/MyFont-Bold.woff2`

Your `app.css` would have:

```css
@font-face {
  font-family: "MyFont";
  src: url("/fonts/MyFont-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "MyFont";
  src: url("/fonts/MyFont-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

:root {
  font-family: "MyFont", Inter, system-ui, sans-serif;
  /* ... */
}
```

## Notes

- Files in `static/` are served from the root URL, so `/fonts/` refers to `static/fonts/`
- `font-display: swap` prevents invisible text while fonts load
- Always include fallback fonts in your font-family stack
- Use `.woff2` format when possible for best performance
