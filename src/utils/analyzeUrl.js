const MODEL = 'gemini-2.5-flash'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

function getApiKey() {
  let key = localStorage.getItem('gemini_api_key')
  if (!key) {
    key = prompt('Enter your Gemini API key:')
    if (key) {
      localStorage.setItem('gemini_api_key', key)
    }
  }
  return key
}

async function fetchPageContent(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const html = await res.text()
    return html.slice(0, 30000)
  } catch {
    return null
  }
}

const SYSTEM_PROMPT = `You are an SEO expert. Analyze the given URL (and page HTML if provided) and return ONLY valid JSON with this exact structure — no markdown, no code fences:

{
  "overall": <0-100>,
  "categories": {
    "meta": <0-100>,
    "headings": <0-100>,
    "keywords": <0-100>,
    "performance": <0-100>,
    "readability": <0-100>,
    "backlinks": <0-100>,
    "social": <0-100>
  },
  "issues": ["<critical issue>", ...],
  "quickWins": ["<quick win>", ...],
  "details": {
    "meta": { "analysis": "<paragraph>", "recommendations": ["<rec>", ...] },
    "headings": { "analysis": "<paragraph>", "recommendations": ["<rec>", ...] },
    "keywords": { "analysis": "<paragraph>", "recommendations": ["<rec>", ...] },
    "performance": { "analysis": "<paragraph>", "recommendations": ["<rec>", ...] },
    "readability": { "analysis": "<paragraph>", "recommendations": ["<rec>", ...] },
    "backlinks": { "analysis": "<paragraph>", "recommendations": ["<rec>", ...] },
    "social": { "analysis": "<paragraph>", "recommendations": ["<rec>", ...] }
  },
  "stats": {
    "keywords": <estimated count like 1200>,
    "backlinks": <estimated count like 247>,
    "loadTime": <estimated seconds like 0.9>,
    "pagespeed": <estimated 0-100>
  }
}

SCORING RULES (be consistent, always apply these):
- meta: 70–100 if title and description tags exist with good keywords; 0–40 if missing
- headings: 70–100 if H1 present and heading hierarchy is logical; 0–40 if no H1
- keywords: 50–80 if content has relevant keyword usage; 0–40 if thin content
- performance: always score 40–70 since you're guessing without real data (unless HTML reveals otherwise)
- readability: 60–90 if content is clear; 0–40 if very short or gibberish
- backlinks: always score 30–60 since you're guessing without real backlink data
- social: 40–80 if OG/Twitter tags found; 0–30 if none detected

STATS ESTIMATION:
- keywords: estimate keyword count based on content length and niche
- backlinks: estimate based on domain authority signals
- loadTime: estimate 0.5–3.0 based on performance score (lower score = higher time)
- pagespeed: estimate 0–100 based on performance score

Provide real, specific, actionable analysis. Score generously but honestly.`

export async function analyzeUrl(url) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('API key is required. Enter it when prompted.')
  }

  const html = await fetchPageContent(url)

  let userPrompt = `Analyze the SEO of this URL: ${url}`
  if (html) {
    userPrompt += `\n\nHere is the page HTML content:\n\n${html}`
  }

  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0,
        topP: 1,
        response_mime_type: 'application/json',
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    if (res.status === 400 && body.includes('API_KEY_INVALID')) {
      localStorage.removeItem('gemini_api_key')
      throw new Error('Invalid API key. Please try again.')
    }
    throw new Error(`API error (${res.status}): ${body}`)
  }

  const json = await res.json()
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Empty response from API.')
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Failed to parse API response.')
  }
}
