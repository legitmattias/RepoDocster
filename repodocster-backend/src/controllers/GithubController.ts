import { Request, Response, NextFunction } from 'express'
import BackendConfig from '../config/BackendConfig'
import { fetchGithubDocument } from '../services/githubService'
import { RepoReadmeProcessor, ChangelogProcessor }from '@kikinit/mddoc-toolkit'
import HttpError from '../utils/HttpError'

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
    const { bypassProcessor, methods } = req.query

    try {
      // Fetch the document from GitHub.
      const document = await fetchGithubDocument(
        this.config,
        owner,
        repo,
        filepath
      )

      // Check if user wants to bypass the processor.
      if (bypassProcessor === 'true') {
        res.status(200).json({ content: document })
      }

      const selectedMethods = Array.isArray(methods) ? methods : [methods]

      // Process README.md using RepoReadmeProcessor.
      if (filepath.toLowerCase() === 'readme.md') {
        const processor = new RepoReadmeProcessor(document)
        let processedContent = ''

        // Check and apply selected methods.
        if (selectedMethods.includes('extractInstallation')) {
          processedContent += processor.installationInstructions
        }
        if (selectedMethods.includes('extractUsage')) {
          processedContent += processor.usageExamples
        }

        res.status(200).json({ content: processedContent })
        return
      }

      // Process CHANGELOG.md using ChangelogProcessor.
      if (filepath.toLowerCase() === 'changelog.md') {
        const processor = new ChangelogProcessor(document)
        let processedContent = ''

        // Check and apply selected methods.
        if (selectedMethods.includes('extractUnreleased')) {
          processedContent += processor.unreleasedChanges
        }
        if (selectedMethods.includes('extractAdded')) {
          processedContent += processor.addedFeatures
        }

        res.status(200).json({ content: processedContent })
        return
      }

      // If no valid filepath, throw a 404 error.
      throw new HttpError('File not found', 404)
    } catch (error) {
      next(error)
    }
  }
}

export default GithubController
