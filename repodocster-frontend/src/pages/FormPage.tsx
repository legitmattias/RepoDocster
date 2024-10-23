import React, { useState } from 'react'
import FrontendConfig from '../config/FrontendConfig'

interface FormPageProps {
  config: FrontendConfig
}

const FormPage: React.FC<FormPageProps> = ({ config }) => {
  const [url, setUrl] = useState<string>('')  // Holds the full GitHub link.
  const [content, setContent] = useState<string>('')  // Holds fetched document content.
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Handle form submission to fetch the document.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Backend expects the owner, repo, and filepath.
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/[^/]+\/(.+)/)
    if (!match) {
      setError('Invalid GitHub URL format. Please ensure it follows the correct structure.')
      setLoading(false)
      return
    }

    const owner = match[1]
    const repo = match[2]
    const filepath = match[3]

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
    <div>
      <h1>Fetch Markdown Document</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">GitHub Markdown File URL:</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste the full GitHub link"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Document'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {content && (
        <div>
          <h2>Document Content</h2>
          <pre>{content}</pre>
        </div>
      )}
    </div>
  )
}

export default FormPage
