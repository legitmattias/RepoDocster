import { Request, Response, NextFunction } from 'express'
import BackendConfig from '../config/BackendConfig.js'
import { fetchGithubDocument } from '../services/githubService.js'
import HttpError from '../utils/HttpError.js'

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
      if (error instanceof HttpError) {
        next(error)
      } else {
        next(new HttpError('Internal Server Error', 500))
      }
    }
  }
}

export default GithubController
