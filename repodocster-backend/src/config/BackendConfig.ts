export default class BackendConfig {
  private port: number
  private githubToken: string
  private githubApiUrl: string
  private githubAcceptHeader: string

  constructor() {
    this.port = Number(process.env.PORT) || 4000
    this.githubToken = process.env.GITHUB_TOKEN || ''
    this.githubApiUrl = process.env.GITHUB_API_URL || 'https://api.github.com'
    this.githubAcceptHeader = process.env.GITHUB_ACCEPT_HEADER || 'application/vnd.github.v3.raw'
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
