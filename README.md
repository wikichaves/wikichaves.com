# wikichaves.com

My personal site — designer and musician. Static HTML, no build step, hosted on Vercel.

## Structure

```
index.html         · home
shared.css         · global styles (nav, footer, type scale, tokens)
assets/            · logo + OG image
design/            · /design — design overview
  projects/        · /design/projects — index + 6 case studies
    case-study.css · layout shared by all 6 case studies
    lightbox.js    · shared click-to-expand gallery
music/             · /music — record catalog + audio (player + timeline inline)
robots.txt         · + sitemap.xml
vercel.json        · redirects + cache + security headers
```

## Case studies

Tero Bot, Xapo Bank, Netflix (Hawkins), Airbnb Cards, Airbnb PDP, Lemon Wallet.
Each is an `index.html` that loads `shared.css` then `case-study.css`, and keeps
only its own quirks in an inline `<style>` — which overrides from there. The
click-to-expand **lightbox** (keyboard + swipe) lives in `lightbox.js`; Tero adds
**live repo stats** from the GitHub API (cached 24h in localStorage) plus a build
**timelapse** that plays on scroll-in and offers a replay.

Bump the `?v=` on the `shared.css` / `case-study.css` / `lightbox.js` links when
you edit them — that query is the only cache-buster.

Every page loads `shared.css` for the nav, footer, type scale and tokens, then
overrides what it needs in its own inline `<style>`. `/music` is the one page
that owns most of its layout (the timeline, the tracklists, the mini player) —
it still takes the chrome from `shared.css` and keeps only its own in the page.

## Images

Every photo ships in three formats (AVIF, WebP, JPG) wrapped in `<picture>`,
co-located in the same folder: `photo.jpg`, `photo.webp`, `photo.avif`.
The browser picks the smallest one it supports.

Recipe — cover-crop to the target ratio, then encode each format:

```bash
VF="scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900"
ffmpeg -i in.jpg -vf "$VF" out.png
ffmpeg -i in.jpg -vf "$VF" -f image2pipe -vcodec ppm - | cjpeg -quality 80 -progressive -optimize > photo.jpg
cwebp -q 80 -m 6 out.png -o photo.webp
avifenc --min 26 --max 32 --speed 6 out.png photo.avif
```

Give every `<img>` its intrinsic `width`/`height` so the browser reserves the box
before the file lands (no layout shift). The first figure on a page is the LCP
element — it gets `fetchpriority="high"` and no `loading="lazy"`.

## Local

```bash
python3 -m http.server 8000
```

## Deploy

Every push to `main` auto-deploys on Vercel.
