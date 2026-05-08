# JavaScript Helpers, Deploy & Final Checklist

## JavaScript Helper Functions

### Number Count-Up Animation
```javascript
function animateValue(element, start, end, duration, decimals=2) {
  const range = end - start;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = (start + range * eased).toFixed(decimals);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
```

### Progress Bar Animation
```javascript
function animateBar(barEl, targetPercent, delay=300) {
  setTimeout(() => {
    barEl.style.transition = 'width 1.5s ease';
    barEl.style.width = targetPercent + '%';
  }, delay);
}
```

### Section Toggle
```javascript
function showSection(name) {
  ['loading', 'result', 'error', 'popular'].forEach(s => {
    document.getElementById(s + '-section').style.display = 
      s === name ? 'block' : 'none';
  });
}
```

### Loading Messages
```javascript
let loadingInterval;
function startLoadingMessages() {
  const messages = [
    "🔍 Fetching website data...",
    "📏 Measuring page size...",
    "⚡ Calculating energy usage...",
    "🌱 Checking green hosting...",
    "📊 Generating your report..."
  ];
  let i = 0;
  const el = document.getElementById('loading-message');
  el.textContent = messages[0];
  loadingInterval = setInterval(() => {
    i = (i + 1) % messages.length;
    el.textContent = messages[i];
  }, 2000);
}
```

## Deploy on Vercel (2 minutes)

**Option A — Drag and Drop:**
1. Go to vercel.com
2. Drag the project folder → Done! Get a free .vercel.app URL

**Option B — GitHub:**
1. Push to GitHub
2. Import on vercel.com → auto deploys on every push

## Final Checklist

- [ ] Only 2 files: index.html + vercel.json
- [ ] URL auto-prefixed with https:// if missing
- [ ] Page size estimated via fetch (with 2MB fallback)
- [ ] Carbon calculation uses client-side formula (no API calls)
- [ ] Cleaner-than percentile estimated from CO₂ ranges
- [ ] Rating A+ to F with correct colors and glow
- [ ] All stat numbers animate counting up on display
- [ ] Progress bar animates smoothly
- [ ] Loading messages rotate every 2 seconds
- [ ] Popular sites clickable and auto-run check
- [ ] Share button copies formatted text to clipboard
- [ ] Mobile responsive at 375px
- [ ] Floating particle background (subtle)
- [ ] Error messages are friendly
- [ ] "Check Another Site" button resets everything cleanly

## Local Testing

```bash
# Just open index.html in Chrome — no server needed!
# Or run: npx serve . and open localhost:3000

# Deploy to Vercel:
# Option 1: Drag folder to vercel.com/new
# Option 2: vercel deploy (if Vercel CLI installed)
```
