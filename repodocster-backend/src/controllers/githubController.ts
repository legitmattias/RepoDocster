import { Request, Response, NextFunction } from 'express'
import { fetchGitHubDocument } from '../services/githubService'

/**
 * Controller to fetch a document from a GitHub repository.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export const getGitHubDocument = async (req: Request, res: Response, next: NextFunction) => {
  const { owner, repo, filepath } = req.params

  try {
    // Fetch the document using the GitHub service.
    const content = await fetchGitHubDocument(owner, repo, filepath)
    res.status(200).json({ content })
  } catch (error) {
    console.error(error)
    next(error)
  }
}
