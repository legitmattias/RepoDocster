import express from 'express'
import { Request, Response, NextFunction } from 'express'
import { getGithubDocument } from '../controllers/githubController.js'
import Config from '../config/BackendConfig.js'

export const router = (config: Config) => {
  const router = express.Router()

  router.get('/api/github-docs/:owner/:repo/:filepath', (req: Request, res: Response) => {
    getGithubDocument(req, res, config)
    })

  // Catch-all for undefined routes.
  router.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found: ${req.originalUrl}`)
    next(error)
  })

  return router
}
