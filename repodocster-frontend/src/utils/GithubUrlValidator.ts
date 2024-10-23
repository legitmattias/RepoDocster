class GithubUrlValidator {
  validate(url: string): { owner: string; repo: string; filepath: string } | null {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/[^/]+\/(.+)/)
    if (!match) {
      return null // Invalid format.
    }

    const [, owner, repo, filepath] = match
    return { owner, repo, filepath }
  }
}

export default GithubUrlValidator
