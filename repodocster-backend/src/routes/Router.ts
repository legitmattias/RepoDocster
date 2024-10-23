import express, { Request, Response, NextFunction, Router } from 'express'
import GithubController from '../controllers/GithubController.js'
import Config from '../config/BackendConfig.js'

class AppRouter {
  private router: Router
  private githubController: GithubController

  constructor(config: Config) {
    this.router = express.Router()
    this.githubController = new GithubController(config)
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET route for retrieving GitHub documents.
    this.router.get(
      '/api/github-docs/:owner/:repo/:filepath',
      (req: Request, res: Response, next: NextFunction) => {
        this.githubController.getGithubDocument(req, res, next)
      }
    )

    // Catch-all for undefined routes.
    this.router.use('*', (req: Request, res: Response, next: NextFunction) => {
      const error = new Error(`Not Found: ${req.originalUrl}`)
      next(error)
    })
  }

  public getRouter(): Router {
    return this.router
  }
}

export default AppRouter
