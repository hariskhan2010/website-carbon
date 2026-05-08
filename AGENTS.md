# 🌍 Website Carbon Calculator — Pure Frontend (Vercel) OpenCode Prompt Plan

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

---

## APIs Used (All Free, All Support CORS)

| API | Purpose | URL |
|---|---|---|
| Website Carbon API | CO₂ data + page size | ~~https://api.websitecarbon.com/site?url=DOMAIN~~ (deprecated July 2025, no CORS) |
| Green Web Foundation | Green hosting check | ~~https://api.thegreenwebfoundation.org/api/v3/greencheck/DOMAIN~~ (no CORS)

**Note:** Both APIs do NOT support CORS. The app now calculates everything 100% client-side using the Sustainable Web Design formula: `CO₂ (g) = (bytes / 1,073,741,824) × 0.812 × 494`. No backend or external API calls needed!

---

## Project Structure

```
website-carbon-calculator/
├── index.html        # Everything in one file (HTML + CSS + JS)
└── vercel.json       # Vercel config (optional, just for clean URLs)
```

That's it — only 2 files!

---

## Prompt for OpenCode

> Paste this entire prompt into OpenCode:

---

```
Build a 100% frontend Website Carbon Calculator. No backend. No server. Just one HTML file deployed on Vercel.

## Project Structure

website-carbon-calculator/
├── index.html        # All HTML + CSS + JS in one file
└── vercel.json       # Vercel config

---

## vercel.json

{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}

---

## index.html — Complete App

Build the entire app in a single HTML file with inline CSS and JS.

---

### APIs to call (both support CORS — call directly from browser):

1. Website Carbon API:
   URL: https://api.websitecarbon.com/site?url=DOMAIN
   Returns: { "url": "...", "green": true/false, "bytes": 123456, "cleanerThan": 0.72, "statistics": { "adjustedBytes": 123456, "energy": 0.000123, "co2": { "grid": { "grams": 0.456, "litres": 0.253 } } } }

2. Green Web Foundation API:
   URL: https://api.thegreenwebfoundation.org/api/v3/greencheck/DOMAIN
   Returns: { "green": true/false, "hosted_by": "...", "hosted_by_website": "..." }

---

### Carbon Calculation (use API data + fallback formula):

function calculateCarbon(apiData) {
  // Use API co2 data if available
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

function getRating(co2Grams) {
  if (co2Grams <= 0.095) return { grade: 'A+', color: '#00c853', bg: 'rgba(0,200,83,0.15)' };
  if (co2Grams <= 0.186) return { grade: 'A',  color: '#64dd17', bg: 'rgba(100,221,23,0.15)' };
  if (co2Grams <= 0.341) return { grade: 'B',  color: '#aeea00', bg: 'rgba(174,234,0,0.15)' };
  if (co2Grams <= 0.493) return { grade: 'C',  color: '#ffd600', bg: 'rgba(255,214,0,0.15)' };
  if (co2Grams <= 0.656) return { grade: 'D',  color: '#ff6d00', bg: 'rgba(255,109,0,0.15)' };
  if (co2Grams <= 0.846) return { grade: 'E',  color: '#dd2c00', bg: 'rgba(221,44,0,0.15)' };
  return                         { grade: 'F',  color: '#b71c1c', bg: 'rgba(183,28,28,0.15)' };
}

function getTips(pageSizeKB, co2Grams) {
  const tips = [];
  if (pageSizeKB > 1000) tips.push("🖼️ Compress images — they make up ~60% of page weight");
  if (pageSizeKB > 500)  tips.push("⚡ Enable GZIP/Brotli compression on your server");
  if (pageSizeKB > 300)  tips.push("📦 Minify CSS, JavaScript and HTML files");
  if (co2Grams > 0.3)    tips.push("🌱 Switch to a green hosting provider using renewable energy");
  tips.push("🔄 Use browser caching to reduce repeat visit impact");
  tips.push("🎬 Lazy load images and videos below the fold");
  tips.push("🌍 Use a dark color scheme — saves energy on OLED screens");
  return tips.slice(0, 5);
}

---

### Main fetch function:

async function checkWebsite(inputUrl) {
  // Clean and validate URL
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
    // Call both APIs in parallel
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

---

### Design — Dark Eco Theme:

Colors:
- Background: #050f05
- Card background: rgba(255,255,255,0.04)
- Card border: rgba(0,230,118,0.15)
- Accent green: #00e676
- Text primary: #e8f5e9
- Text secondary: #81c784

Fonts: Import from Google Fonts:
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');

Animated background: subtle floating particles using CSS keyframes
- 20 small dots (3-6px), random positions, slow float up animation
- Very subtle opacity (0.1 to 0.3) so not distracting

---

### Page Layout:

#### 1. HEADER
- Slowly spinning 🌍 emoji (CSS animation: spin 10s linear infinite)
- "Website Carbon Calculator" — large Space Grotesk bold with green gradient
- Subtitle: "Discover how much CO₂ your website produces per visit"
- Stat pill: "🌐 The internet produces 4% of global CO₂ emissions"

#### 2. SEARCH CARD (glassmorphism)
- URL input field: large, rounded, dark background
  placeholder: "Enter any website — e.g. google.com or youtube.com"
  type="url", autocomplete="url"
- "🌱 Calculate Carbon" button — full width on mobile, green accent
- Below: "Free • No signup • Works on any website"

#### 3. POPULAR SITES (shown on load, hidden when result shows)
Title: "Try these popular sites:"
Clickable pill buttons: google.com · youtube.com · facebook.com · amazon.com · wikipedia.org · twitter.com
Clicking a pill fills the input and auto-runs the check

#### 4. LOADING STATE (hidden by default)
- Large CSS spinner (green, animated)
- Rotating messages (change every 2s):
  "🔍 Fetching website data..."
  "📏 Measuring page size..."
  "⚡ Calculating energy usage..."
  "🌱 Checking green hosting..."
  "📊 Generating your report..."

#### 5. RESULT SECTION (hidden by default)

A. RATING HERO
- Domain name shown: "Results for example.com"
- Giant grade letter centered (A+, A, B ... F)
- Color + glow matching rating color
- Subtext: "This site is cleaner than X% of websites tested"
- Green hosting badge below:
  If green: 🟢 "Powered by Green Energy (hosted by X)"
  If not:   🔴 "Not on Green Hosting"
  If null:  ⚪ "Hosting data unavailable"

B. STATS GRID (2 cols mobile, 4 cols desktop)
Each card: large number + unit + label + icon
- 💨 [X.XXXg] CO₂ per visit
- 📦 [X,XXX KB] Page size  
- ⚡ [X.XXXXkWh] Energy per visit
- 🌳 [X.XX] Trees needed/year

All numbers count up with animation when shown (0 → final value, 1.2s duration)

C. YEARLY IMPACT (at 10,000 monthly visitors)
Card with:
- 📅 [X.XX kg] CO₂ per year
- 🚗 Equivalent to driving [X] km (1kg CO2 = ~6km driving)
- 🌳 [X] trees needed to offset

D. COMPARISON BAR
"How does it compare to other websites?"
- Animated progress bar filling from 0% to cleanerThanPercent%
- Label: "Cleaner than [X]% of websites"
- Color matches rating

E. IMPROVEMENT TIPS
"💡 How to reduce this site's carbon footprint"
5 tip cards, each with left green border, icon + text

F. ACTION BUTTONS ROW
- "📤 Share Result" — copies text to clipboard
  Text: "I checked [domain] — it got a [GRADE] carbon rating! [X]g CO₂ per visit. Check your site free at [YOUR_VERCEL_URL] 🌍"
- "🔄 Check Another Site" — resets to search
- After share: button shows "✅ Copied to clipboard!"

#### 6. ERROR STATE (hidden by default)
- ⚠️ icon, red/orange card
- Error message
- "Try Again" button

#### 7. FOOTER
- "🌱 Helping make the web greener"
- "Data from Website Carbon API & Green Web Foundation"
- "Deploy your own copy free on Vercel"

---

### JavaScript helper functions:

// Animate number counting up
function animateValue(element, start, end, duration, decimals=2) {
  const range = end - start;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    element.textContent = (start + range * eased).toFixed(decimals);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Animate progress bar
function animateBar(barEl, targetPercent, delay=300) {
  setTimeout(() => {
    barEl.style.transition = 'width 1.5s ease';
    barEl.style.width = targetPercent + '%';
  }, delay);
}

// Show/hide sections
function showSection(name) {
  ['loading', 'result', 'error', 'popular'].forEach(s => {
    document.getElementById(s + '-section').style.display = 
      s === name ? 'block' : 'none';
  });
}

// Rotate loading messages
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

---

## Deploy on Vercel (2 minutes)

Option A — Drag and Drop:
1. Go to vercel.com
2. Drag the project folder → Done! Get a free .vercel.app URL

Option B — GitHub:
1. Push to GitHub
2. Import on vercel.com → auto deploys on every push

---

## Final Checklist:
- [ ] Only 2 files: index.html + vercel.json
- [ ] Both API calls in parallel using Promise.allSettled
- [ ] URL auto-prefixed with https:// if missing
- [ ] Domain extracted correctly for Green Web Foundation API
- [ ] Carbon calculation uses API data with fallback formula
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
```

---

## Why Pure Frontend is Perfect Here ✅

| Concern | Status |
|---|---|
| CORS issues | ✅ No API calls — 100% client-side calculation |
| Speed | ✅ Instant — all calculation in browser |
| Cost | ✅ Free forever on Vercel |
| Complexity | ✅ Just 1 HTML file |
| Maintenance | ✅ Nothing to maintain |

---

## After OpenCode Generates Code

```bash
# Test locally:
# Just open index.html in Chrome — no server needed!
# Or run: npx serve . and open localhost:3000

# Deploy to Vercel:
# Option 1: Drag folder to vercel.com/new
# Option 2: vercel deploy (if Vercel CLI installed)
```
