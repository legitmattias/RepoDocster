class FrontendConfig {
  private backendApiUrl: string

  constructor(backendApiUrl: string) {
    this.backendApiUrl = backendApiUrl
  }

  // Return the backend API URL.
  getBackendApiUrl(): string {
    return this.backendApiUrl
  }

  // Construct the GitHub route.
  getGithubRoute(owner: string, repo: string, filepath: string): string {
    return `${this.backendApiUrl}/api/github-docs/${owner}/${repo}/${filepath}`
  }
}

export default FrontendConfig
