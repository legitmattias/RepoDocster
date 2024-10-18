import axios from 'axios'

const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

/**
 * Fetches a file from a GitHub repository using the GitHub API.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The repository name.
 * @param {string} filepath - The path to the file in the repository (e.g., README.md).
 * @returns {Promise<string>} - The raw content of the file.
 */
export const fetchGitHubDocument = async (
  owner: string,
  repo: string,
  filepath: string
): Promise<string> => {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${filepath}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    )
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
      throw new Error('An unexpected error occurred')
    }
  }
}
