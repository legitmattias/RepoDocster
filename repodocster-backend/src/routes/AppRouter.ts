import express, { Request, Response, NextFunction, Router } from 'express'
import GithubController from '../controllers/GithubController.js'
import Config from '../config/BackendConfig.js'
import HttpError from '../utils/HttpError.js'

class AppRouter {
  private router: Router
  private githubController: GithubController

  constructor(config: Config) {
    this.router = express.Router()
    this.githubController = new GithubController(config)
    this.initializeRoutes()
  }

  // Initialize all routes.
  private initializeRoutes(): void {
    this.router.get('/api/github-docs/:owner/:repo/:filepath', this.getGithubDocumentHandler.bind(this))

    // Catch-all for undefined routes.
    this.router.use('*', this.handleUndefinedRoutes.bind(this))
  }

  // Route handler for fetching GitHub documents.
  private getGithubDocumentHandler(req: Request, res: Response, next: NextFunction): void {
    this.githubController.getGithubDocument(req, res, next).catch(next)
  }

  // Handle undefined routes.
  private handleUndefinedRoutes(req: Request, res: Response, next: NextFunction): void {
    // Use HttpError for a 404 error.
    const error = new HttpError(`Not Found: ${req.originalUrl}`, 404)
    next(error)
  }

  // Get the initialized router.
  public getRouter(): Router {
    return this.router
  }
}

export default AppRouter
