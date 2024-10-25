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
      const document = await fetchGithubDocument(this.config, owner, repo, filepath)

      if (bypassProcessor === 'true') {
        console.log('Bypassing processor, returning raw document')
        res.status(200).json({ content: document })
        return
      }

      // Ensure `methods` is treated as an array of strings.
      const selectedMethods = this.parseMethods(methods)
      console.log('Parsed methods:', selectedMethods)

      const processorInstance = this.getProcessorInstance(filepath, document)
      if (!processorInstance) {
        next(new HttpError('File not found', 404))
        return
      }

      const processedContent = this.processSelectedMethods(processorInstance, selectedMethods)
      if (!processedContent) {
        throw new HttpError(`No content extracted for methods: ${selectedMethods.join(', ')}`, 400)
      }

      console.log('Processed content:', processedContent)
      res.status(200).json({ content: processedContent })
    } catch (error) {
      console.error('Error caught in controller:', error)
      next(error instanceof HttpError ? error : new HttpError('Internal server error', 500))
    }
  }

  // Parses methods query parameter into an array of method names.
  private parseMethods(methods: string | string[] | undefined): string[] {
    if (!methods) return []
    if (typeof methods === 'string') {
      return methods.split(',').map((method) => method.trim())
    }
    return methods.flatMap((method) => method.split(',').map((m) => m.trim()))
  }

  // Determines the appropriate processor based on the file path.
  private getProcessorInstance(filepath: string, document: string): RepoReadmeProcessor | ChangelogProcessor | null {
    const isReadme = filepath.toLowerCase() === 'readme.md'
    if (isReadme) {
      return new RepoReadmeProcessor(document, false)
    } else if (filepath.toLowerCase() === 'changelog.md') {
      return new ChangelogProcessor(document, false)
    }
    return null
  }

  // Processes content using the selected methods and returns concatenated output.
  private processSelectedMethods(
    processor: RepoReadmeProcessor | ChangelogProcessor,
    selectedMethods: string[]
  ): string {
    const methodMap = this.getMethodMap(processor)
    let content = ''

    selectedMethods.forEach((method) => {
      const sections = methodMap[method]
      if (sections && sections.length > 0) {
        console.log(`Extracting ${method}...`)
        sections.forEach((section) => {
          content += `## ${section.title}\n\n${section.body}\n\n`
        })
      } else {
        console.log(`Method ${method} not supported for this processor.`)
      }
    })

    return content
  }

  // Maps method names to section extraction methods on the processors.
  private getMethodMap(processor: RepoReadmeProcessor | ChangelogProcessor): Record<string, { title: string; body: string }[]> {
    if (processor instanceof RepoReadmeProcessor) {
      return {
        extractInstallation: processor.installationInstructions,
        extractUsage: processor.usageExamples,
        extractApi: processor.api,
        extractDpendencies: processor.dependencies,
        extractLicenseInfo: processor.licenseInfo
      }
    } else if (processor instanceof ChangelogProcessor) {
      return {
        extractUnreleased: processor.unreleasedChanges,
        extractAdded: processor.addedFeatures,
        extractChangedFeature: processor.changedFeatures
      }
    }
    return {}
  }
}

export default GithubController
