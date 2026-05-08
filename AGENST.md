# SEO Analyzer — Project Plan

## Overview

A web-based AI-powered SEO analyzer that accepts a URL and returns a detailed audit across 7 key SEO factors, with scores, insights, and actionable recommendations.

---

## Goals

- Allow users to enter any website URL
- Analyze the site across all major SEO dimensions
- Display a visual score (0–100) per category
- Highlight top issues and quick wins
- Powered by Claude AI (claude-sonnet-4-20250514)

---

## SEO Factors Covered

| Factor | What's Analyzed |
|---|---|
| Meta Tags | Title, description, keywords presence & quality |
| Headings | H1–H6 structure and hierarchy |
| Keyword Density | Usage, frequency, and placement |
| Performance | Load time, Core Web Vitals, speed tips |
| Readability | Flesch score, content quality |
| Backlinks | Domain authority, link-building suggestions |
| Open Graph / Social | OG tags, Twitter Card, social preview |

---

## Features

- **Overall SEO score** (0–100) with progress bar
- **Per-category scores** displayed in a grid
- **Top Issues** panel — critical problems to fix
- **Quick Wins** panel — easy improvements
- **Detailed section cards** with analysis + recommendations
- **Color-coded ratings**: Good (green), Needs Improvement (amber), Poor (red)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (or plain HTML/CSS/JS) |
| AI Engine | Anthropic Claude API (`/v1/messages`) |
| Model | `claude-sonnet-4-20250514` |
| Styling | CSS Variables / Tailwind |
| Hosting | Vercel / Netlify / any static host |

---

## Architecture

```
User enters URL
      ↓
Frontend sends prompt to Claude API
      ↓
Claude returns structured JSON audit
      ↓
UI parses and renders score cards,
issues, wins, and recommendations
```

---

## Phases

### Phase 1 — MVP (Current)
- [x] URL input UI
- [x] Claude API integration
- [x] JSON-structured SEO audit
- [x] Score grid + color coding
- [x] Top issues & quick wins
- [x] Per-section detail cards with recommendations

### Phase 2 — Live Page Fetching
- [ ] Backend proxy server (Node.js / Python)
- [ ] Fetch real HTML from target URL
- [ ] Parse actual meta tags, headings, OG tags
- [ ] Pass real page content to Claude for deeper analysis

### Phase 3 — Enhanced Features
- [ ] Export report as PDF
- [ ] Save and compare audits over time
- [ ] Competitor URL comparison
- [ ] Keyword suggestions via search API
- [ ] Page speed integration (Google PageSpeed API)
- [ ] Sitemap & robots.txt checker

### Phase 4 — Polish & Scale
- [ ] User accounts & history
- [ ] Bulk URL analysis
- [ ] White-label / embed option
- [ ] Email report delivery

---

## API Notes

- Endpoint: `https://api.anthropic.com/v1/messages`
- Model: `claude-sonnet-4-20250514`
- Max tokens: `1000`
- Response format: strict JSON (no markdown wrapping)
- Error handling: try/catch with user-friendly messages

---

## Folder Structure (Suggested)

```
seo-analyzer/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── UrlInput.jsx
│   │   ├── ScoreCard.jsx
│   │   ├── SectionDetail.jsx
│   │   └── IssuePanel.jsx
│   ├── utils/
│   │   └── analyzeUrl.js   ← Claude API call
│   └── styles/
│       └── main.css
├── plan.md
├── README.md
└── package.json
```

---

## Known Limitations

- Current version uses AI inference (no live page fetch)
- Scores are estimated based on URL and best practices
- Requires backend proxy for real HTML parsing (Phase 2)

---

## Future Integrations

- Google Search Console API
- Google PageSpeed Insights API
- Ahrefs / SEMrush API (backlinks)
- Screaming Frog-style crawler

---

*Last updated: May 2026*
