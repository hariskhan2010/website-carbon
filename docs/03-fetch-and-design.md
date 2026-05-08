# Main Fetch Function & Dark Eco Theme

## Main Fetch Function

```javascript
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
    const [carbonRes, greenRes] = await Promise.allSettled([
      fetch(`https://api.websitecarbon.com/site?url=${encodeURIComponent(url)}`),
      fetch(`https://api.thegreenwebfoundation.org/api/v3/greencheck/${domain}`)
    ]);

    if (carbonRes.status === 'rejected' || !carbonRes.value.ok) {
      throw new Error('Could not analyze this website. Make sure the URL is correct and the site is live.');
    }

    const carbonData = await carbonRes.value.json();
    const greenData = greenRes.status === 'fulfilled' && greenRes.value.ok 
                      ? await greenRes.value.json() 
                      : null;

    const carbon = calculateCarbon(carbonData);
    const rating = getRating(carbon.co2Grams);
    const tips = getTips(carbon.pageSizeKB, carbon.co2Grams);
    const isGreen = greenData?.green ?? carbonData?.green ?? null;
    const hostedBy = greenData?.hosted_by || null;

    displayResult({ domain, url, carbon, rating, tips, isGreen, hostedBy });
    showSection('result');

  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  }
}
```

### API Response Shapes

**Website Carbon API:**
```
{ "url": "...", "green": true/false, "bytes": 123456, "cleanerThan": 0.72,
  "statistics": { "adjustedBytes": 123456, "energy": 0.000123,
    "co2": { "grid": { "grams": 0.456, "litres": 0.253 } } } }
```

**Green Web Foundation API:**
```
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
