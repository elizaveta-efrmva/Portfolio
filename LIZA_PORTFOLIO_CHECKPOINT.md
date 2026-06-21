# Liza Efremova Portfolio Checkpoint

Checkpoint date: 2026-06-22

This checkpoint preserves the restored landing page for Liza Efremova's video editing portfolio.

## Main files

- `static/index.html` - complete static landing page.
- `scripts/build-static.mjs` - static export script that writes the page to `out/`.
- `public/poster.jpg` - temporary poster placeholder for videos.
- `package.json` - `npm run build` uses the static export script.

## Commands

```bash
npm run build
python3 -m http.server 4173 -d out
```

Local preview:

```text
http://127.0.0.1:4173/
```

## Required replacement placeholders

- `showreel.mp4`
- `case_1.mp4`
- `case_2.mp4`
- `case_3.mp4`
- `poster.jpg`
- `https://t.me/username`
- case context comments inside `static/index.html`

## Landing structure

The page follows the technical specification for Liza Efremova:

1. Hero with showreel placeholder.
2. Audience trigger block.
3. Works/cases with video modal.
4. Value/results block.
5. Services block.
6. Process block.
7. FAQ.
8. Final CTA.
