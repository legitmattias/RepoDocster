class Config {
  static getBackendApiUrl() {
    return process.env.REACT_APP_BACKEND_API_URL
  }

  static getGitHubRoute(owner: string, repo: string, filepath: string) {
    return `${this.getBackendApiUrl()}/api/github-docs/${owner}/${repo}/${filepath}`
  }
}

export default Config
