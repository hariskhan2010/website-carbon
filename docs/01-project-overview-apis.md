# 🌍 Website Carbon Calculator — Project Overview & Calculation Approach

## Project Overview

Build a **100% frontend Website Carbon Calculator** that:
- Deployed on **Vercel** — no backend, no server
- User enters any website URL
- Calculates CO₂ per visit using client-side formula, gives rating A+ to F
- Shows tips, comparisons
- Shareable result card
- Works on **PC and Mobile** (fully responsive)
- Zero cost to run — forever free on Vercel

## Calculation Approach (100% Client-Side)

No external API calls needed. Everything calculated in the browser.

**Formula (Sustainable Web Design methodology):**
```
CO₂ (grams) = (bytes / 1,073,741,824) × 0.812 kWh/GB × 494 gCO₂e/kWh
```

**Data flow:**
1. **Estimate page size** — Try fetching the target URL from browser to get `Content-Length` (HTML size × 10 multiplier). If CORS blocks it, fall back to ~2MB (2,048,000 bytes).
2. **Calculate CO₂** — Apply the formula above to get grams of CO₂ per visit.
3. **Generate rating** — Map CO₂ grams to A+ through F using standard thresholds.
4. **Estimate cleaner-than percentile** — Map CO₂ to percentile based on HTTP Archive data ranges.
5. **Generate tips** — Based on page size and CO₂ values.

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
| No CORS issues | ✅ No API calls needed at all |
| Speed | ✅ Instant — all calculation in browser |
| Cost | ✅ Free forever on Vercel |
| Complexity | ✅ Just 1 HTML file |
| Maintenance | ✅ Nothing to maintain |
| Works offline | ✅ Yes — no network dependencies |
