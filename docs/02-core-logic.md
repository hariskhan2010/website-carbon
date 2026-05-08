# Core Logic — Carbon Calculation, Rating & Tips

## vercel.json

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Carbon Calculation (Client-Side Formula)

All calculation happens in the browser using the Sustainable Web Design formula.

```javascript
function estimateCleanerThan(co2Grams) {
  if (co2Grams <= 0.095) return 0.95;
  if (co2Grams <= 0.186) return 0.80;
  if (co2Grams <= 0.341) return 0.60;
  if (co2Grams <= 0.493) return 0.40;
  if (co2Grams <= 0.656) return 0.20;
  return 0.07;
}

function calculateCarbonFromBytes(bytes) {
  const gb = bytes / (1024 * 1024 * 1024);
  const co2Grams = gb * 0.812 * 494;
  const cleanerThan = estimateCleanerThan(co2Grams);
  return {
    co2Grams: parseFloat(co2Grams.toFixed(3)),
    pageSizeKB: parseFloat((bytes / 1024).toFixed(1)),
    cleanerThanPercent: parseFloat((cleanerThan * 100).toFixed(1)),
    energyKwh: parseFloat((gb * 0.812).toFixed(6)),
    co2PerYearKg: parseFloat(((co2Grams * 10000 * 12) / 1000).toFixed(2)),
    treesNeeded: parseFloat(((co2Grams * 10000 * 12) / 21000).toFixed(2)),
  };
}
```

**Formula:**
```
CO₂ (grams) = (bytes / 1,073,741,824) × 0.812 kWh/GB × 494 gCO₂e/kWh
```

- `0.812` = energy intensity of data transfer (kWh per GB)
- `494` = global average carbon intensity of grid electricity (gCO₂e per kWh)

## Rating System (A+ to F)

```javascript
function getRating(co2Grams) {
  if (co2Grams <= 0.095) return { grade: 'A+', color: '#00c853', bg: 'rgba(0,200,83,0.15)' };
  if (co2Grams <= 0.186) return { grade: 'A',  color: '#64dd17', bg: 'rgba(100,221,23,0.15)' };
  if (co2Grams <= 0.341) return { grade: 'B',  color: '#aeea00', bg: 'rgba(174,234,0,0.15)' };
  if (co2Grams <= 0.493) return { grade: 'C',  color: '#ffd600', bg: 'rgba(255,214,0,0.15)' };
  if (co2Grams <= 0.656) return { grade: 'D',  color: '#ff6d00', bg: 'rgba(255,109,0,0.15)' };
  if (co2Grams <= 0.846) return { grade: 'E',  color: '#dd2c00', bg: 'rgba(221,44,0,0.15)' };
  return                         { grade: 'F',  color: '#b71c1c', bg: 'rgba(183,28,28,0.15)' };
}
```

The API response now uses `gco2e` (top-level) instead of nested `co2.grid.grams`. The `/data` endpoint also returns `rating` and `cleanerThan` directly.

## Rating System (A+ to F)

```javascript
function getRating(co2Grams) {
  if (co2Grams <= 0.095) return { grade: 'A+', color: '#00c853', bg: 'rgba(0,200,83,0.15)' };
  if (co2Grams <= 0.186) return { grade: 'A',  color: '#64dd17', bg: 'rgba(100,221,23,0.15)' };
  if (co2Grams <= 0.341) return { grade: 'B',  color: '#aeea00', bg: 'rgba(174,234,0,0.15)' };
  if (co2Grams <= 0.493) return { grade: 'C',  color: '#ffd600', bg: 'rgba(255,214,0,0.15)' };
  if (co2Grams <= 0.656) return { grade: 'D',  color: '#ff6d00', bg: 'rgba(255,109,0,0.15)' };
  if (co2Grams <= 0.846) return { grade: 'E',  color: '#dd2c00', bg: 'rgba(221,44,0,0.15)' };
  return                         { grade: 'F',  color: '#b71c1c', bg: 'rgba(183,28,28,0.15)' };
}
```

## Tips System

```javascript
function getTips(pageSizeKB, co2Grams) {
  const tips = [];
  if (pageSizeKB > 1000) tips.push("Compress images — they make up ~60% of page weight");
  if (pageSizeKB > 500)  tips.push("Enable GZIP/Brotli compression on your server");
  if (pageSizeKB > 300)  tips.push("Minify CSS, JavaScript and HTML files");
  if (co2Grams > 0.3)    tips.push("Switch to a green hosting provider using renewable energy");
  tips.push("Use browser caching to reduce repeat visit impact");
  tips.push("Lazy load images and videos below the fold");
  tips.push("Use a dark color scheme — saves energy on OLED screens");
  return tips.slice(0, 5);
}
```
