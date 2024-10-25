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
    const bypassProcessor = req.query.bypassProcessor as string | undefined
    const methods = req.query.methods as string | string[] | undefined
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

      // Ensure `methods` is treated as an array of strings.
      const selectedMethods = typeof methods === 'string'
        ? methods.split(',')
        : Array.isArray(methods)
        ? methods
        : []

      console.log('Selected methods:', selectedMethods)

      let processedContent = ''

      // Processor and method logic for README.md files.
      if (filepath.toLowerCase() === 'readme.md') {
        console.log('Processing README.md...')
        const processor = new RepoReadmeProcessor(document, false)

        if (selectedMethods.includes('extractInstallation')) {
          const installationSections = processor.installationInstructions
          if (installationSections.length > 0) {
            console.log('Extracting installation instructions...')
            installationSections.forEach((section) => {
              processedContent += `## ${section.title}\n\n${section.body}\n\n`
            })
          }
        }

        if (selectedMethods.includes('extractUsage')) {
          const usageSections = processor.usageExamples
          if (usageSections.length > 0) {
            console.log('Extracting usage examples...')
            usageSections.forEach((section) => {
              processedContent += `## ${section.title}\n\n${section.body}\n\n`
            })
          }
        }

        console.log('Processed content:', processedContent)
        res.status(200).json({ content: processedContent })
        return
      }

      // Processor and method logic for CHANGELOG.md files.
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

      // Handle unsupported file path with a 404 error.
      console.log('File not found, throwing 404 error...')
      next(new HttpError('File not found', 404))
    } catch (error) {
      console.error('Error caught in controller:', error)
      next(error)
    }
  }
}

export default GithubController
