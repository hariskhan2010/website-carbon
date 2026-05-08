function scoreColor(score) {
  if (score >= 70) return '#4ade80'
  if (score >= 40) return '#fbbf24'
  return '#f87171'
}

function scoreLabel(score) {
  if (score >= 70) return 'Good'
  if (score >= 40) return 'Needs Improvement'
  return 'Poor'
}

export default function ScoreCard({ title, score }) {
  const color = scoreColor(score)
  return (
    <div className="score-card">
      <div className="score-card-header">
        <h3 className="score-card-title">{title}</h3>
        <span className="score-card-badge" style={{ backgroundColor: color }}>
          {scoreLabel(score)}
        </span>
      </div>
      <div className="score-card-bar">
        <div
          className="score-card-fill"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="score-card-value" style={{ color }}>{score}/100</span>
    </div>
  )
}
