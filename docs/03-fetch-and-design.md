# Data Flow & Dark Eco Theme

## Data Flow (100% Client-Side)

No external API calls. Everything happens in the browser:

1. **Estimate page size** — Try fetching target URL from browser (CORS-permitting sites). Get `Content-Length` × 10 multiplier, or measure response body. Fall back to ~2MB (2,048,000 bytes) if CORS blocks.
2. **Calculate CO₂** — Apply Sustainable Web Design formula: `(bytes / 1,073,741,824) × 0.812 × 494 = gCO₂`
3. **Generate rating** — Map gCO₂ to A+ through F.
4. **Estimate cleaner-than percentile** — Map CO₂ to percentile.
5. **Generate tips** — Based on page size and CO₂.

## Main Functions

```javascript
async function estimatePageSize(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { method: 'GET', mode: 'cors', signal: controller.signal });
    clearTimeout(timeoutId);
    const contentLength = res.headers.get('content-length');
    if (contentLength) {
      const htmlBytes = parseInt(contentLength);
      return Math.max(htmlBytes * 10, 102400);
    }
    const blob = await res.blob();
    return Math.max(blob.size * 10, 102400);
  } catch {
    return 2048000;
  }
}

async function checkWebsite(inputUrl) {
  let url = inputUrl.trim();
  if (!url.startsWith('http')) url = 'https://' + url;

  let domain;
  try {
    domain = new URL(url).hostname.replace('www.', '');
  } catch {
    throw new Error('Please enter a valid website URL');
  }

  showSection('loading');
  startLoadingMessages();

  try {
    const bytes = await estimatePageSize(url);
    const carbon = calculateCarbonFromBytes(bytes);
    const rating = getRating(carbon.co2Grams);
    const tips = getTips(carbon.pageSizeKB, carbon.co2Grams);

    displayResult({ domain, url, carbon, rating, tips, isGreen: null, hostedBy: null });
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  }
}
```

## Dark Eco Theme

### Colors
- Background: `#050f05`
- Card background: `rgba(255,255,255,0.04)`
- Card border: `rgba(0,230,118,0.15)`
- Accent green: `#00e676`
- Text primary: `#e8f5e9`
- Text secondary: `#81c784`

### Fonts (Google Fonts)
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');
```

### Animated Background
- 20 small dots (3-6px), random positions, slow float up animation
- Very subtle opacity (0.1 to 0.3) — not distracting
