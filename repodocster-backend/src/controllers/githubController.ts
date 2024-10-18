import { Request, Response, NextFunction } from 'express'
import { fetchGitHubDocument } from '../services/githubService.js'

/**
 * Controller to fetch a document from a GitHub repository.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export const getGitHubDocument = async (req: Request, res: Response, next: NextFunction) => {
  const { owner, repo, filepath } = req.params

  console.log('Received request for GitHub document:', { owner, repo, filepath })

  try {
    // Fetch the document using the GitHub service.
    const content = await fetchGitHubDocument(owner, repo, filepath)
    console.log('Fetched content:', content)
    res.status(200).json({ content })
  } catch (error) {
    console.error('Error fetching document:', error)
    next(error)
  }
}
