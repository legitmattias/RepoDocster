import React, { useState } from 'react'
import './App.css'
import FrontendConfig from './config/FrontendConfig'

// Initialize FrontendConfig.
const config = new FrontendConfig(process.env.REACT_APP_BACKEND_API_URL || '')

function App() {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [filepath, setFilepath] = useState('')
  const [content, setContent] = useState('') // Holds the fetched document content.
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle form submission to fetch the document.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const apiUrl = config.getGithubRoute(owner, repo, filepath)
    console.log('Requesting URL:', apiUrl)

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch document')
      }
      const data = await response.json()
      setContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>RepoDocster</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="owner">Owner:</label>
            <input
              id="owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Enter GitHub owner"
              required
            />
          </div>
          <div>
            <label htmlFor="repo">Repository:</label>
            <input
              id="repo" 
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="Enter GitHub repository"
              required
            />
          </div>
          <div>
            <label htmlFor="filepath">Filepath:</label>
            <input
              id="filepath"
              type="text"
              value={filepath}
              onChange={(e) => setFilepath(e.target.value)}
              placeholder="Enter file path (e.g., README.md)"
              required
            />
          </div>
          <button type="submit">Fetch Document</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {content && (
          <div>
            <h2>Document Content</h2>
            <pre>{content}</pre>
          </div>
        )}
      </header>
    </div>
  )
}

export default App
