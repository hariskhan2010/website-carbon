# Main Fetch Function & Dark Eco Theme

## Data Flow

The `/site` endpoint was deprecated July 2025. The new approach:

1. **Estimate page size** — Try fetching the target URL directly from browser (CORS-permitting sites). If blocked, fall back to ~2MB average.
2. **Green hosting check** — Call Green Web Foundation API.
3. **Calculate CO₂** — Call `https://api.websitecarbon.com/data?bytes=XXX&green=0/1`.

## Main Fetch Function

```javascript
async function estimatePageSize(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { method: 'GET', mode: 'cors', signal: controller.signal });
    clearTimeout(timeoutId);
    const contentLength = res.headers.get('content-length');
    if (contentLength) {
      return Math.max(parseInt(contentLength) * 10, 102400);
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
    const [bytes, greenRes] = await Promise.all([
      estimatePageSize(url),
      fetch(`https://api.thegreenwebfoundation.org/api/v3/greencheck/${domain}`).catch(() => null)
    ]);

    const greenData = greenRes?.ok ? await greenRes.json() : null;
    const isGreen = greenData?.green ?? null;
    const hostedBy = greenData?.hosted_by || null;
    const green = isGreen === true ? 1 : 0;

    const carbonRes = await fetch(`https://api.websitecarbon.com/data?bytes=${bytes}&green=${green}`);
    if (!carbonRes.ok) {
      throw new Error('Could not analyze this website. Please try again.');
    }

    const carbonData = await carbonRes.json();
    const carbon = calculateCarbon(carbonData);
    const rating = getRating(carbon.co2Grams);
    const tips = getTips(carbon.pageSizeKB, carbon.co2Grams);

    displayResult({ domain, url, carbon, rating, tips, isGreen, hostedBy });
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  }
}
```

### API Response Shapes

**Website Carbon API (`/data` endpoint):**
```json
{
  "bytes": 12345678,
  "green": true,
  "gco2e": 1.05,
  "rating": "F",
  "cleanerThan": 0.07,
  "statistics": {
    "adjustedBytes": 9320986.89,
    "energy": 0.0026,
    "co2": {
      "grid": { "grams": 1.286, "litres": 0.715 },
      "renewable": { "grams": 1.05, "litres": 0.584 }
    }
  }
}
```

**Green Web Foundation API:**
```json
{ "green": true/false, "hosted_by": "...", "hosted_by_website": "..." }
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
