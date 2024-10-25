import React from 'react'
import './FullPathInput.css'

interface FullPathInputProps {
  fullPath: string
  onFullPathChange: (value: string) => void
}

const FullPathInput: React.FC<FullPathInputProps> = ({ fullPath, onFullPathChange }) => (
  <div className="full-path-input">
    <label htmlFor="fullPath">GitHub Full Path:</label>
    <input
      id="fullPath"
      type="text"
      value={fullPath}
      onChange={(e) => onFullPathChange(e.target.value)}
      placeholder="https://github.com/username/repo/blob/branch/filename.md"
      required
    />
    <small className="helper-text">
      Enter the full URL to the file in your GitHub repository, including `blob` and branch name.
    </small>
  </div>
)

export default FullPathInput
