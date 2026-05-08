import { useState } from 'react'

function scoreColor(score) {
  if (score >= 70) return '#4ade80'
  if (score >= 40) return '#fbbf24'
  return '#f87171'
}

export default function SectionDetail({ title, score, analysis, recommendations }) {
  const [open, setOpen] = useState(false)
  const color = scoreColor(score)

  return (
    <div className={`section-detail ${open ? 'open' : ''}`}>
      <button className="section-detail-header" onClick={() => setOpen(!open)}>
        <div className="section-detail-left">
          <span className="section-detail-score" style={{ color }}>{score}</span>
          <h3>{title}</h3>
        </div>
        <span className="section-detail-chevron">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="section-detail-body">
          {analysis && (
            <div className="section-detail-block">
              <h4>Analysis</h4>
              <p>{analysis}</p>
            </div>
          )}
          {recommendations && recommendations.length > 0 && (
            <div className="section-detail-block">
              <h4>Recommendations</h4>
              <ul>
                {recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
