import React, { useState } from 'react'

import FrontendConfig from '../config/FrontendConfig'

interface FormPageProps {
  config: FrontendConfig
}

function FormPage({ config }: FormPageProps) {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [filepath, setFilepath] = useState('')
  const [fullPath, setFullPath] = useState('')
  const [bypassProcessor, setBypassProcessor] = useState(false)
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useFullPath, setUseFullPath] = useState(false)

  // Available methods based on document type
  const methodOptions = filepath === 'README.md' 
    ? ['extractInstallation', 'extractUsage'] 
    : ['extractUnreleased', 'extractAdded']

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let apiUrl = ''
    if (useFullPath) {
      const match = fullPath.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/[^/]+\/(.+)/)
      if (!match) {
        setError('Invalid GitHub URL format. Please ensure it follows the correct structure.')
        setLoading(false)
        return
      }
      const [ownerFromPath, repoFromPath, filepathFromPath] = match
      apiUrl = config.getGithubRoute(ownerFromPath, repoFromPath, filepathFromPath)
    } else {
      apiUrl = config.getGithubRoute(owner, repo, filepath)
    }

    try {
      const query = new URLSearchParams({
        bypassProcessor: bypassProcessor.toString(),
        methods: selectedMethods.join(','),
      })

      const response = await fetch(`${apiUrl}?${query}`)
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

  const toggleMethod = (method: string) => {
    setSelectedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    )
  }

  return (
    <div className="form-page">
      <h1>Process GitHub Markdown Document</h1>

      {/* Switch between using full path or owner + repo + filepath */}
      <div>
        <label>
          <input
            type="radio"
            checked={!useFullPath}
            onChange={() => setUseFullPath(false)}
          />
          Enter Owner, Repo, and Filepath
        </label>
        <label>
          <input
            type="radio"
            checked={useFullPath}
            onChange={() => setUseFullPath(true)}
          />
          Paste Full GitHub URL
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Input based on the selected option */}
        {useFullPath ? (
          <div>
            <label htmlFor="fullPath">GitHub URL:</label>
            <input
              id="fullPath"
              type="text"
              value={fullPath}
              onChange={(e) => setFullPath(e.target.value)}
              placeholder="Paste full GitHub file URL"
              required
            />
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="owner">Owner:</label>
              <input
                id="owner"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="GitHub owner"
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
                placeholder="GitHub repository"
                required
              />
            </div>

            <div>
              <label htmlFor="filepath">Filepath (README.md or CHANGELOG.md):</label>
              <select
                id="filepath"
                value={filepath}
                onChange={(e) => setFilepath(e.target.value)}
                required
              >
                <option value="">Select Filepath</option>
                <option value="README.md">README.md</option>
                <option value="CHANGELOG.md">CHANGELOG.md</option>
              </select>
            </div>
          </>
        )}

        {/* Checkbox to bypass the processor */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={bypassProcessor}
              onChange={() => setBypassProcessor(!bypassProcessor)}
            />
            Bypass Processor
          </label>
        </div>

        {/* Checkboxes for processor methods */}
        {!bypassProcessor && filepath && (
          <div>
            <h3>Select Processing Methods:</h3>
            {methodOptions.map((method) => (
              <label key={method}>
                <input
                  type="checkbox"
                  value={method}
                  checked={selectedMethods.includes(method)}
                  onChange={() => toggleMethod(method)}
                />
                {method}
              </label>
            ))}
          </div>
        )}

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
    </div>
  )
}

export default FormPage
