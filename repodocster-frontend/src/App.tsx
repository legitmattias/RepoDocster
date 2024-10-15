import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to RepoDocster</h1>
        <p>Your tool to fetch and analyze GitHub repository documentation.</p>
      </header>
      <main className="app-main">
        <p>Start by entering a GitHub repository URL to analyze its README or Changelog.</p>
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 RepoDocster</p>
      </footer>
    </div>
  );
}

export default App;
