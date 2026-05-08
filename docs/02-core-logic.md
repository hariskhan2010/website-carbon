# Core Logic — Carbon Calculation, Rating & Tips

## vercel.json

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Carbon Calculation (API data + fallback formula)

```javascript
function calculateCarbon(apiData) {
  const co2Grams = apiData?.statistics?.co2?.grid?.grams || 
                   (apiData.bytes / (1024*1024*1024)) * 0.812 * 494;
  const bytes = apiData.bytes || apiData?.statistics?.adjustedBytes || 0;
  const cleanerThan = apiData.cleanerThan || 0;
  
  return {
    co2Grams: parseFloat(co2Grams.toFixed(3)),
    pageSizeKB: parseFloat((bytes / 1024).toFixed(1)),
    cleanerThanPercent: parseFloat((cleanerThan * 100).toFixed(1)),
    energyKwh: parseFloat((apiData?.statistics?.energy || (bytes/1024/1024/1024)*0.812).toFixed(6)),
    co2PerYearKg: parseFloat(((co2Grams * 10000 * 12) / 1000).toFixed(2)),
    treesNeeded: parseFloat(((co2Grams * 10000 * 12) / 21000).toFixed(2)),
  };
}
```

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
