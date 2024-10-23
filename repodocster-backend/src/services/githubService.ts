import axios from 'axios'
import BackendConfig from '../config/BackendConfig'

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

    const response = await axios.get(
      url,
      {
        headers: {
          Accept: config.getGithubApiAcceptHeader(),
          Authorization: `Bearer ${config.getGithubToken()}`,
        },
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500 // Default to 500 if no status

      let errorMessage = 'Error fetching the document from GitHub'
      if (statusCode === 401) {
        errorMessage = 'Unauthorized: Please check your GitHub token.'
      } else if (statusCode === 404) {
        errorMessage = 'File not found: The specified document does not exist.'
      }

      // Throw an error with status code and message
      const customError = new Error(errorMessage)
      customError.status = statusCode
      throw customError
    } else {
      console.error('Error during GitHub API request:', error)
      const genericError = new Error('An unexpected error occurred')
      genericError.status = 500
      throw genericError
    }
  }
}
