import React from 'react'
import './FileSelect.css'

interface FileSelectProps {
  filepath: string
  onFilepathChange: (value: string) => void
}

const FileSelect: React.FC<FileSelectProps> = ({ filepath, onFilepathChange }) => (
  <div className="file-select">
    <label htmlFor="file-select">Select File Context:</label>
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
)

export default FileSelect
