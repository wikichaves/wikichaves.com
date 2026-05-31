# wikichaves.com

My personal site — designer and musician. Static HTML, no build step, hosted on Vercel.

## Structure

```
index.html         · home
shared.css         · global styles
assets/            · logo + OG image
design/            · /design — design overview
  projects/        · /design/projects — index + 6 case studies
music/             · /music — record catalog + audio
vercel.json        · redirects + cache
```

## Case studies

Tero Bot, Xapo Bank, Netflix (Hawkins), Airbnb Cards, Airbnb PDP, Lemon Wallet.
Each is a self-contained `index.html` with its own inline `<style>`. Shared
touches: a click-to-expand **lightbox** on the figures (keyboard + swipe), and —
on Tero — **live repo stats** from the GitHub API plus a build **timelapse**
that plays on scroll-in and offers a replay.

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

## Local

```bash
python3 -m http.server 8000
```

## Deploy

Every push to `main` auto-deploys on Vercel.
