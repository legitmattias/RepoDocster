import axios from 'axios'
import Config from '../config/BackendConfig'

/**
 * Fetches a file from a GitHub repository using the GitHub API.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The repository name.
 * @param {string} filepath - The path to the file in the repository (e.g., README.md).
 * @param {Config} config - The config Object.
 * @returns {Promise<string>} - The raw content of the file.
 */
export const fetchGithubDocument = async (
  config: Config,
  owner: string,
  repo: string,
  filepath: string
): Promise<string> => {
  try {
    const url = `${config.getGithubRoute(owner, repo, filepath)}`
    console.log('Fetching from GitHub API:', url)

    const response = await axios.get(
      url,
      {
      headers: {
        Accept: config.getGithubApiAcceptHeader(),
        Authorization: `Bearer ${config.getGithubToken()}`,
      },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios-specific error.
      throw new Error(
        error.response?.data?.message ||
          'Error fetching the document from GitHub'
      )
    } else {
      // Handle non-axios errors.
      console.error('Error during GitHub API request:', error)
      throw new Error('An unexpected error occurred')
    }
  }
}
