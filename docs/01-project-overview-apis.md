# 🌍 Website Carbon Calculator — Project Overview & APIs

## Project Overview

Build a **100% frontend Website Carbon Calculator** that:
- Deployed on **Vercel** — no backend, no server
- User enters any website URL
- App calls free public APIs directly from browser
- Calculates CO₂ per visit, gives rating A+ to F
- Shows green hosting badge, tips, comparisons
- Shareable result card
- Works on **PC and Mobile** (fully responsive)
- Zero cost to run — forever free on Vercel

## APIs Used (All Free, All Support CORS)

| API | Purpose | URL |
|---|---|---|
| Website Carbon API | CO₂ calculation from bytes + green status | https://api.websitecarbon.com/data?bytes=XXX&green=1 |
| Green Web Foundation | Green hosting check | https://api.thegreenwebfoundation.org/api/v3/greencheck/DOMAIN |

Both APIs support **CORS** — can be called directly from browser JavaScript. No backend needed!

**Note:** The Website Carbon API deprecated their free `/site` endpoint as of July 14, 2025. The `/data` endpoint is still free and public. Page size is estimated by fetching the target URL directly from the browser (CORS-permitting), with a ~2MB fallback if blocked.

## Project Structure

```
website-carbon-calculator/
├── index.html        # Everything in one file (HTML + CSS + JS)
└── vercel.json       # Vercel config (optional, just for clean URLs)
```

That's it — only 2 files!

## Why Pure Frontend is Perfect Here

| Concern | Status |
|---|---|
| CORS issues | ✅ Both APIs support CORS |
| Speed | ✅ Fast — direct API calls |
| Cost | ✅ Free forever on Vercel |
| Complexity | ✅ Just 1 HTML file |
| Maintenance | ✅ Nothing to maintain |
