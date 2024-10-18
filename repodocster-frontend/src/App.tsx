import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  // Fetch the backend API when the component mounts.
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/status`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching backend:', error))
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>RepoDocster</h1>
        <p>{message || 'Loading...'}</p>
      </header>
    </div>
  )
}

export default App
