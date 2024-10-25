import React from 'react'
import './OutputContent.css'

interface OutputContentProps {
  content: string
}

const OutputContent: React.FC<OutputContentProps> = ({ content }) => (
  <div className="output-content">
    {content && (
      <div>
        <h2>Document Content</h2>
        <pre>{content}</pre>
      </div>
    )}
  </div>
)

export default OutputContent
