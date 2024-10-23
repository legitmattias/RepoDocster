import { Request, Response } from 'express'
import Config from '../config/BackendConfig'
import { fetchGithubDocument } from '../services/githubService'

class GithubController {
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  async getGithubDocument(req: Request, res: Response): Promise<void> {
    const { owner, repo, filepath } = req.params

    try {
      const document = await fetchGithubDocument(this.config, owner, repo, filepath)
      res.status(200).json({ content: document })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to fetch document from GitHub' })
    }
  }
}

export default GithubController
