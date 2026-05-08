# Page Layout — Full Sections Guide

## 1. HEADER
- Slowly spinning 🌍 emoji (CSS animation: spin 10s linear infinite)
- "Website Carbon Calculator" — large Space Grotesk bold with green gradient
- Subtitle: "Discover how much CO₂ your website produces per visit"
- Stat pill: "🌐 The internet produces 4% of global CO₂ emissions"

## 2. SEARCH CARD (glassmorphism)
- URL input field: large, rounded, dark background
  - placeholder: "Enter any website — e.g. google.com or youtube.com"
  - type="url", autocomplete="url"
- "🌱 Calculate Carbon" button — full width on mobile, green accent
- Below: "Free • No signup • Works on any website"

## 3. POPULAR SITES (shown on load, hidden when result shows)
- Title: "Try these popular sites:"
- Clickable pill buttons: google.com · youtube.com · facebook.com · amazon.com · wikipedia.org · twitter.com
- Clicking a pill fills the input and auto-runs the check

## 4. LOADING STATE (hidden by default)
- Large CSS spinner (green, animated)
- Rotating messages (change every 2s):
  - 🔍 Fetching website data...
  - 📏 Measuring page size...
  - ⚡ Calculating energy usage...
  - 🌱 Checking green hosting...
  - 📊 Generating your report...

## 5. RESULT SECTION (hidden by default)

### A. RATING HERO
- Domain name shown: "Results for example.com"
- Giant grade letter centered (A+, A, B ... F)
- Color + glow matching rating color
- Subtext: "This site is cleaner than X% of websites tested"
- Green hosting badge:
  - If green: 🟢 "Powered by Green Energy (hosted by X)"
  - If not:   🔴 "Not on Green Hosting"
  - If null:  ⚪ "Hosting data unavailable"

### B. STATS GRID (2 cols mobile, 4 cols desktop)
Each card: large number + unit + label + icon
- 💨 [X.XXXg] CO₂ per visit
- 📦 [X,XXX KB] Page size
- ⚡ [X.XXXXkWh] Energy per visit
- 🌳 [X.XX] Trees needed/year

Numbers count up with animation (0 → final value, 1.2s duration)

### C. YEARLY IMPACT (at 10,000 monthly visitors)
- 📅 [X.XX kg] CO₂ per year
- 🚗 Equivalent to driving [X] km (1kg CO2 = ~6km driving)
- 🌳 [X] trees needed to offset

### D. COMPARISON BAR
- Progress bar filling from 0% to cleanerThanPercent%
- Label: "Cleaner than [X]% of websites"
- Color matches rating

### E. IMPROVEMENT TIPS
- "💡 How to reduce this site's carbon footprint"
- 5 tip cards, each with left green border, icon + text

### F. ACTION BUTTONS ROW
- "📤 Share Result" — copies text to clipboard
- "🔄 Check Another Site" — resets to search
- After share: button shows "✅ Copied to clipboard!"

## 6. ERROR STATE (hidden by default)
- ⚠️ icon, red/orange card
- Error message
- "Try Again" button

## 7. FOOTER
- "🌱 Helping make the web greener"
- "Data from Website Carbon API & Green Web Foundation"
- "Deploy your own copy free on Vercel"
