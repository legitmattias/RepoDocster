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
  const [useFullPath, setUseFullPath] = useState(false)
  const [bypassProcessor, setBypassProcessor] = useState(false)
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Determine method options based on filepath
  const determineMethodOptions = (path: string) => {
    return path.toLowerCase() === 'readme.md'
      ? ['extractInstallation', 'extractUsage']
      : ['extractUnreleased', 'extractAdded']
  }

  // Toggle selection of methods.
  const toggleMethod = (method: string) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    )
  }

  // Handle form submission to fetch document.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let apiUrl = ''

    if (useFullPath) {
      // Extract owner, repo, and filepath from the full URL.
      const match = fullPath.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/[^/]+\/(.+)/)
      if (!match || match.length !== 4) {
        setError('Invalid GitHub URL format. Please ensure it follows the correct structure.')
        setLoading(false)
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ownerFromPath, repoFromPath, filepathFromPath] = match

      apiUrl = config.getGithubRoute(ownerFromPath, repoFromPath, filepathFromPath)
      setFilepath(filepathFromPath)
    } else {
      apiUrl = config.getGithubRoute(owner, repo, filepath)
    }

    try {
      const query = new URLSearchParams({
        bypassProcessor: bypassProcessor.toString(),
        methods: selectedMethods.join(',')
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

  return (
    <div className="form-page">
      <h1>Fetch Markdown Document</h1>

      <form onSubmit={handleSubmit}>
        {/* Toggle between full path or owner/repo */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={useFullPath}
              onChange={() => setUseFullPath(!useFullPath)}
            />
            Use Full Path
          </label>
        </div>

        {useFullPath ? (
          <div>
            <label htmlFor="fullPath">GitHub Full Path:</label>
            <input
              id="fullPath"
              type="text"
              value={fullPath}
              onChange={(e) => setFullPath(e.target.value)}
              placeholder="Full GitHub URL"
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
              <input
                id="filepath"
                type="text"
                value={filepath}
                onChange={(e) => setFilepath(e.target.value)}
                placeholder="Filepath"
                required
              />
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
        {!bypassProcessor && (
          <div>
            <h3>Select Processing Methods:</h3>
            {determineMethodOptions(filepath).map((method) => (
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
