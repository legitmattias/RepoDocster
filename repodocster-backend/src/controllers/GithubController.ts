import { Request, Response, NextFunction } from 'express'
import BackendConfig from '../config/BackendConfig.js'
import { fetchGithubDocument } from '../services/githubService.js'
import { RepoReadmeProcessor, ChangelogProcessor } from '@kikinit/mddoc-toolkit'
import HttpError from '../utils/HttpError.js'

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
    console.log('getGithubDocument invoked!')

    const { owner, repo, filepath } = req.params
    const { bypassProcessor, methods } = req.query
    console.log('Received params:', owner, repo, filepath)

    try {
      // Fetch the document from GitHub.
      const document = await fetchGithubDocument(
        this.config,
        owner,
        repo,
        filepath
      )

      // Return raw document if bypassProcessor is true.
      if (bypassProcessor === 'true') {
        console.log('Bypassing processor, returning raw document')
        res.status(200).json({ content: document })
        return
      }

      const selectedMethods = Array.isArray(methods) ? methods : [methods]
      console.log('Selected methods:', selectedMethods)

      let processedContent = ''

      // Handle README.md processing.
      if (filepath.toLowerCase() === 'readme.md') {
        console.log('Processing README.md...')
        const processor = new RepoReadmeProcessor(document, false)

        if (selectedMethods.includes('extractInstallation')) {
          const installationSections = processor.installationInstructions
          if (installationSections.length > 0) {
            console.log('Extracting installation instructions...')
            installationSections.forEach((section) => {
              // Combine title and body for proper markdown structure.
              processedContent += `## ${section.title}\n\n${section.body}\n\n`
            })
          }
        }

        if (selectedMethods.includes('extractUsage')) {
          const usageSections = processor.usageExamples
          if (usageSections.length > 0) {
            console.log('Extracting usage examples...')
            usageSections.forEach((section) => {
              // Combine title and body for proper markdown structure.
              processedContent += `## ${section.title}\n\n${section.body}\n\n`
            })
          }
        }

        console.log('Processed content:', processedContent)
        res.status(200).json({ content: processedContent })
        return
      }

      // Handle CHANGELOG.md processing.
      if (filepath.toLowerCase() === 'changelog.md') {
        console.log('Processing CHANGELOG.md...')
        const processor = new ChangelogProcessor(document, false)

        if (selectedMethods.includes('extractUnreleased')) {
          const unreleasedSections = processor.unreleasedChanges
          if (unreleasedSections.length > 0) {
            console.log('Extracting unreleased changes...')
            unreleasedSections.forEach((section) => {
              processedContent += `## ${section.title}\n\n${section.body}\n\n`
            })
          }
        }

        if (selectedMethods.includes('extractAdded')) {
          const addedSections = processor.addedFeatures
          if (addedSections.length > 0) {
            console.log('Extracting added features...')
            addedSections.forEach((section) => {
              processedContent += `## ${section.title}\n\n${section.body}\n\n`
            })
          }
        }

        console.log('Processed content:', processedContent)
        res.status(200).json({ content: processedContent })
        return
      }

      // If no valid filepath match, throw 404.
      console.log('File not found, throwing 404 error...')
      next(new HttpError('File not found', 404))
    } catch (error) {
      console.error('Error caught in controller:', error)
      next(error)
    }
  }
}

export default GithubController
