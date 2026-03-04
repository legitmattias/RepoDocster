import axios from 'axios'
import BackendConfig from '../config/BackendConfig.js'
import HttpError from '../utils/HttpError.js'

/**
 * Fetches a file from a GitHub repository using the GitHub API.
 *
 * @param {BackendConfig} config - The configuration object with GitHub details.
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The repository name.
 * @param {string} filepath - The path to the file in the repository (e.g., README.md).
 * @returns {Promise<string>} - The raw content of the file.
 */
export const fetchGithubDocument = async (
  config: BackendConfig,
  owner: string,
  repo: string,
  filepath: string
): Promise<string> => {
  try {
    const url = config.getGithubRoute(owner, repo, filepath)
    console.log('Fetching from GitHub API:', url)

    const response = await axios.get<string>(url, {
      headers: {
        Accept: config.getGithubApiAcceptHeader(),
        Authorization: `Bearer ${config.getGithubToken()}`,
      },
    })

    return response.data
  } catch (error) {
    console.error(
      'An error occurred while fetching data:',
      error instanceof Error ? error.message : error
    )
    throw new HttpError(
      'An unexpected error occurred while fetching the document',
      500
    )
  }
}
