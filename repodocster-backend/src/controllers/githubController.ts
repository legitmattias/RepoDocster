import { Request, Response } from 'express'
import Config from '../config/BackendConfig'
import { fetchGithubDocument } from '../services/githubService'

/**
 * Controller to fetch a document from a GitHub repository.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @param {Config} config - The configuration object. 
 */
export const getGithubDocument = async (req: Request, res: Response, config: Config) => {
  const { owner, repo, filepath } = req.params

  console.log('Received request for GitHub document:', { owner, repo, filepath })

  try {
    const document = await fetchGithubDocument(config, owner, repo, filepath)
    res.status(200).json({ content: document })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch document from GitHub' })
  }
}

