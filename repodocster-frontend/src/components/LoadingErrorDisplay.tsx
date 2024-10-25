import React from 'react'
import './LoadingErrorDisplay.css'

interface LoadingErrorDisplayProps {
  loading: boolean
  error: string | null
}

const LoadingErrorDisplay: React.FC<LoadingErrorDisplayProps> = ({ loading, error }) => (
  <div className="loading-error-display">
    {loading && <p>Loading...</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}
  </div>
)

export default LoadingErrorDisplay
