# Cloudflare Workers: `ctx.waitUntil()` demo

This repo demonstrates a minimal, practical pattern for Cloudflare Workers `ctx.waitUntil()` — background work without blocking responses.

Docs: [Context (ctx) API](https://developers.cloudflare.com/workers/runtime-apis/context/)

## Quick start

Prereqs: Node 18+ and npm.

```bash
npm install
npm run dev:local
# open http://localhost:8787
```

You can also run `npm run dev` to use the default mode; no login is required for the `--local` flow.

## Endpoints

- **GET /no-wait-until**: Forwards `https://buffer.com` and awaits a mock 1s analytics call (slower response).
- **GET /with-wait-until**: Forwards `https://buffer.com` and runs the same mock 1s analytics call via `ctx.waitUntil()` (fast response; analytics completes in background).

To observe background work, tail logs in the dev console output. The response will return immediately while the logs appear shortly after.

## Notes

- `ctx.waitUntil()` extends the lifetime of the Worker to finish the provided Promise after the response is returned, as described in the official docs: [Context (ctx) API](https://developers.cloudflare.com/workers/runtime-apis/context/).
- Both endpoints fetch and forward `https://buffer.com`, per the demo setup.
