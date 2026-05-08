import { useState } from 'react'
import Background3D from './components/Background3D'
import Header from './components/Header'
import UrlInput from './components/UrlInput'
import ScoreCard from './components/ScoreCard'
import IssuePanel from './components/IssuePanel'
import SectionDetail from './components/SectionDetail'
import { analyzeUrl } from './utils/analyzeUrl'

const CATEGORY_LABELS = {
  meta: 'Meta Tags',
  headings: 'Headings',
  keywords: 'Keyword Density',
  performance: 'Performance',
  readability: 'Readability',
  backlinks: 'Backlinks',
  social: 'Open Graph / Social',
}

export default function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  async function handleAnalyze(targetUrl) {
    setUrl(targetUrl)
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await analyzeUrl(targetUrl)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Background3D stats={results?.stats ? { ...results.stats, seoScore: results.overall } : null} />
      <Header />
      <main className="container">
        <UrlInput onAnalyze={handleAnalyze} loading={loading} />

        {error && (
          <div className="error-banner">
            <span className="error-icon">!</span>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Analyzing <strong>{url}</strong>...</p>
            <p className="loading-sub">Checking meta tags, headings, performance, and more</p>
          </div>
        )}

        {results && !loading && (
          <div className="results">
            <div className="overall-score-section">
              <h2>Overall SEO Score</h2>
              <div className="overall-score-ring">
                <svg viewBox="0 0 120 120" className="score-ring">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#2a2a2a" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke={scoreColor(results.overall)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(results.overall / 100) * 339.3} 339.3`}
                    transform="rotate(-90 60 60)"
                    className="score-ring-fill"
                  />
                </svg>
                <div className="score-ring-text">
                  <span className="score-number">{results.overall}</span>
                  <span className="score-label">/ 100</span>
                </div>
              </div>
            </div>

            <IssuePanel issues={results.issues} quickWins={results.quickWins} />

            <div className="score-grid">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <ScoreCard
                  key={key}
                  title={label}
                  score={results.categories[key]}
                />
              ))}
            </div>

            <div className="details-section">
              <h2>Detailed Analysis</h2>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <SectionDetail
                  key={key}
                  title={label}
                  score={results.categories[key]}
                  analysis={results.details?.[key]?.analysis}
                  recommendations={results.details?.[key]?.recommendations}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function scoreColor(score) {
  if (score >= 70) return '#4ade80'
  if (score >= 40) return '#fbbf24'
  return '#f87171'
}
