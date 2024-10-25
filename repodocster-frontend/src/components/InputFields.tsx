import React from 'react'
import './InputFields.css'

interface InputFieldsProps {
  useFullPath: boolean
  owner: string
  repo: string
  fullPath: string
  filepath: string
  onOwnerChange: (value: string) => void
  onRepoChange: (value: string) => void
  onFullPathChange: (value: string) => void
  onFilepathChange: (value: string) => void
}

const InputFields: React.FC<InputFieldsProps> = ({
  useFullPath,
  owner,
  repo,
  fullPath,
  filepath,
  onOwnerChange,
  onRepoChange,
  onFullPathChange,
  onFilepathChange,
}) => (
  <div>
    {useFullPath ? (
      <div className="input-field">
        <label htmlFor="fullPath">GitHub Full Path:</label>
        <input
          id="fullPath"
          type="text"
          value={fullPath}
          onChange={(e) => onFullPathChange(e.target.value)}
          placeholder="Full GitHub URL"
          required
        />
      </div>
    ) : (
      <>
        <div className="input-field">
          <label htmlFor="owner">Owner:</label>
          <input
            id="owner"
            type="text"
            value={owner}
            onChange={(e) => onOwnerChange(e.target.value)}
            placeholder="GitHub owner"
            required
          />
        </div>

        <div className="input-field">
          <label htmlFor="repo">Repository:</label>
          <input
            id="repo"
            type="text"
            value={repo}
            onChange={(e) => onRepoChange(e.target.value)}
            placeholder="GitHub repository"
            required
          />
        </div>

        <div className="input-field">
          <label htmlFor="filepath">Select File Context:</label>
          <select
            id="file-select"
            value={filepath}
            onChange={(e) => onFilepathChange(e.target.value)}
            required
          >
            <option value="">--Select a context--</option>
            <option value="README.md">README</option>
            <option value="CHANGELOG.md">CHANGELOG</option>
          </select>
        </div>
      </>
    )}
  </div>
)

export default InputFields
