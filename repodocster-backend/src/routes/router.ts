import express, { Request, Response, NextFunction } from 'express'
import GithubController from '../controllers/githubController'
import Config from '../config/BackendConfig'

export const router = (config: Config) => {
  const router = express.Router()

  const githubController = new GithubController(config)

  // GET route for retrieving Github documents.
  router.get('/api/github-docs/:owner/:repo/:filepath', (req: Request, res: Response, next: NextFunction) => {
    githubController.getGithubDocument(req, res, next)
  })

  // Catch-all for undefined routes.
  router.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found: ${req.originalUrl}`)
    next(error)
  })

  return router
}
