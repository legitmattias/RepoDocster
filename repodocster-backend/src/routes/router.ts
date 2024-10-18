import express from 'express'
import { Request, Response, NextFunction } from 'express'
import http from 'node:http'
import { getGitHubDocument } from '../controllers/githubController.js'

export const router = express.Router()

router.get('/api/github-docs/:owner/:repo/:filepath', getGitHubDocument)

// Catch-all for undefined routes.
router.use('*', (req: Request, res: Response, next: NextFunction) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  next(error)
})
