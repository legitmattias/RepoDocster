import { Request, Response, NextFunction } from 'express'
import http from 'node:http'
import BackendConfig from '../config/BackendConfig'
import { fetchGithubDocument } from '../services/githubService'

class GithubController {
  private config: BackendConfig

  constructor(config: BackendConfig) {
    this.config = config
  }

  // Method to handle the GitHub document fetching.
  async getGithubDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { owner, repo, filepath } = req.params

    try {
      const document = await fetchGithubDocument(
        this.config,
        owner,
        repo,
        filepath
      )
      res.status(200).json({ content: document })
    } catch (error) {
      const statusCode = (error as any)?.response?.status || 500
      const err = new Error(
        http.STATUS_CODES[statusCode] || 'Failed to fetch document'
      )
      err.status = statusCode
      next(err)
    }
  }
}

export default GithubController
