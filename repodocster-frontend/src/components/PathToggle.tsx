import React from 'react'
import './PathToggle.css'

interface PathToggleProps {
  useFullPath: boolean
  onToggle: () => void
}

const PathToggle: React.FC<PathToggleProps> = ({ useFullPath, onToggle }) => (
  <div className="path-toggle">
    <button type="button" onClick={onToggle}>
      {useFullPath ? 'Switch to Owner/Repo' : 'Switch to Full Path'}
    </button>
  </div>
)

export default PathToggle

