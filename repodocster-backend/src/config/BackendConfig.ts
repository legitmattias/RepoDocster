export default class BackendConfig {
  private port: number
  private githubToken: string
  private githubApiUrl: string
  private githubAcceptHeader: string

  constructor(port: number, githubToken: string, githubApiUrl: string, githubAcceptHeader: string) {
    this.port = port
    this.githubToken = githubToken
    this.githubApiUrl = githubApiUrl
    this.githubAcceptHeader = githubAcceptHeader
  }

  getPort(): number {
    return this.port
  }

  // Returns the GitHub API base URL.
  getBackendApiUrl(): string {
    return this.githubApiUrl
  }

  // Returns the GitHub token (for authentication).
  getGithubToken(): string {
    return this.githubToken
  }

  // Constructs the GitHub route for a specific repository and file.
  getGithubRoute(owner: string, repo: string, filepath: string): string {
    return `${this.githubApiUrl}/repos/${owner}/${repo}/contents/${filepath}`
  }

  // Returns the GitHub API accept header.
  getGithubApiAcceptHeader(): string {
    return this.githubAcceptHeader
  }
}
