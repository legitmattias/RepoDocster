import { Request, Response } from 'express'
import axios from 'axios'

const GITHUB_API_URL = process.env.GITHUB_TOKEN
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
// Controller to fetch a document.
export const getGitHubDocument = async (req: Request, res: Response) => {
  const { owner, repo, filepath } = req.params

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

    const content = response.data
    res.status(200).json({ content })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch document from GitHub' })
  }
}
