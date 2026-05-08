import { useState } from 'react'

export default function UrlInput({ onAnalyze, loading }) {
  const [input, setInput] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    onAnalyze(url)
  }

  return (
    <form className="url-input" onSubmit={handleSubmit}>
      <div className="url-input-wrapper">
        <span className="url-prefix">https://</span>
        <input
          type="text"
          className="url-field"
          placeholder="example.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
      </div>
      <button type="submit" className="btn-analyze" disabled={loading || !input.trim()}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  )
}
