import React, { useState } from 'react'
import FrontendConfig from '../config/FrontendConfig'
import GithubUrlValidator from '../utils/GithubUrlValidator'

interface FormPageProps {
  config: FrontendConfig
}

const FormPage: React.FC<FormPageProps> = ({ config }) => {
  const [urlOption, setUrlOption] = useState('')
  const [url, setUrl] = useState('') // For option 1.
  const [owner, setOwner] = useState('') // For option 2.
  const [repo, setRepo] = useState('') // For option 2.
  const [fileType, setFileType] = useState('README') // For option 2.
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Instantiate GithubUrlValidator.
  const githubUrlValidator = new GithubUrlValidator()

  const handleUrlOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlOption(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let apiUrl = ''

      if (urlOption === 'github-url') {

        // Validate Github URL.
        const result = githubUrlValidator.validate(url)
        if (!result) {
          setError('Invalid GitHub URL format. Please ensure it follows the correct structure.')
          setLoading(false)
          return
        }

        const { owner, repo, filepath } = result
        apiUrl = config.getGithubRoute(owner, repo, filepath)

      } else if (urlOption === 'owner-repo') {
        // Use the owner, repo, and file type selected.
        const filepath = fileType === 'README' ? 'README.md' : 'CHANGELOG.md'
        apiUrl = config.getGithubRoute(owner, repo, filepath)
      }

      console.log('Requesting URL:', apiUrl)

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
    <div className="form-page">
      <h1>RepoDocster - Fetch and process GitHub Readmes and Changelogs</h1>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Select Option:</legend>

          <div>
            <label>
              <input
                type="radio"
                name="urlOption"
                value="github-url"
                checked={urlOption === 'github-url'}
                onChange={handleUrlOptionChange}
              />
              Paste a full GitHub link
            </label>
          </div>

          {urlOption === 'github-url' && (
            <div>
              <label htmlFor="url">GitHub URL:</label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo/blob/main/README.md"
                required
              />
            </div>
          )}

          <div>
            <label>
              <input
                type="radio"
                name="urlOption"
                value="owner-repo"
                checked={urlOption === 'owner-repo'}
                onChange={handleUrlOptionChange}
              />
              Enter repository details
            </label>
          </div>

          {urlOption === 'owner-repo' && (
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
                <label htmlFor="fileType">File Type:</label>
                <select
                  id="fileType"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <option value="README">README</option>
                  <option value="CHANGELOG">CHANGELOG</option>
                </select>
              </div>
            </>
          )}
        </fieldset>

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
