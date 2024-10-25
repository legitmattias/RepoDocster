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
      placeholder="Full GitHub URL"
      required
    />
  </div>
)

export default FullPathInput
