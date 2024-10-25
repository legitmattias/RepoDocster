import React, { useState } from 'react'
import './FormPage.css'
import FrontendConfig from '../config/FrontendConfig'
import PathToggle from '../components/PathToggle'
import FullPathInput from '../components/FullPathInput'
import OwnerRepoInput from '../components/OwnerRepoInput'
import FileSelect from '../components/FileSelect'
import ProcessorOptions from '../components/ProcessorOptions'
import OutputContent from '../components/OutputContent'
import LoadingErrorDisplay from '../components/LoadingErrorDisplay'

interface FormPageProps {
  config: FrontendConfig
}

const FormPage: React.FC<FormPageProps> = ({ config }) => {
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
        <PathToggle
          useFullPath={useFullPath}
          onToggle={() => setUseFullPath(!useFullPath)}
        />

        {useFullPath ? (
          <FullPathInput fullPath={fullPath} onFullPathChange={setFullPath} />
        ) : (
          <OwnerRepoInput
            owner={owner}
            repo={repo}
            onOwnerChange={setOwner}
            onRepoChange={setRepo}
          />
        )}

        {/* File selection */}
        <FileSelect filepath={filepath} onFilepathChange={setFilepath} />

        {/* Processor options */}
        <ProcessorOptions
          bypassProcessor={bypassProcessor}
          selectedMethods={selectedMethods}
          onToggleBypass={() => setBypassProcessor(!bypassProcessor)}
          onMethodChange={toggleMethod}
          methods={determineMethodOptions(filepath)}
        />

        {/* Submit button */}
        <button type="submit">Fetch Document</button>
      </form>

      {/* Display loading, error, and content */}
      <LoadingErrorDisplay loading={loading} error={error} />
      <OutputContent content={content} />
    </div>
  )
}

export default FormPage
