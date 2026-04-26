# wikichaves.com

My personal site — designer and musician. Static HTML, no build step, hosted on Vercel.

## Structure

```
index.html         · home
shared.css         · global styles
assets/            · logo + OG image
design/            · /design — design overview
  projects/        · /design/projects — case studies (5)
music/             · /music — record catalog + audio
vercel.json        · redirects + cache
```

## Images

Every photo ships in three formats (AVIF, WebP, JPG) wrapped in `<picture>`,
co-located in the same folder: `photo.jpg`, `photo.webp`, `photo.avif`.
The browser picks the smallest one it supports.

## Local

```bash
python3 -m http.server 8000
```

## Deploy

Every push to `main` auto-deploys on Vercel.
