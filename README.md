# wikichaves.com/music

A quiet catalog site. Static HTML + audio assets. No build step.

## Structure
- `index.html` — the whole site
- `audio/` — MP3s per album (`audio/<album>/NN-track.mp3`)
- `covers/` — album art
- `photos/` — bio photography
- `vercel.json` — caching + clean URL config

## Deploy
Hosted on Vercel. Every push to `main` auto-deploys.
