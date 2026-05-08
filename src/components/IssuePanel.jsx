export default function IssuePanel({ issues, quickWins }) {
  return (
    <div className="issue-panel">
      <div className="issue-column">
        <h3 className="issue-column-title critical">
          <span className="issue-icon">!</span>
          Top Issues
        </h3>
        {(!issues || issues.length === 0) ? (
          <p className="issue-empty">No critical issues found</p>
        ) : (
          <ul className="issue-list">
            {issues.map((item, i) => (
              <li key={i} className="issue-item critical">{item}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="issue-column">
        <h3 className="issue-column-title win">
          <span className="issue-icon">+</span>
          Quick Wins
        </h3>
        {(!quickWins || quickWins.length === 0) ? (
          <p className="issue-empty">No quick wins identified</p>
        ) : (
          <ul className="issue-list">
            {quickWins.map((item, i) => (
              <li key={i} className="issue-item win">{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
