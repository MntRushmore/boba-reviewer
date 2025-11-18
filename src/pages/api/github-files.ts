import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchGitHubRepoFiles } from '@/lib/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { repoUrl } = req.query

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({ error: 'Missing repoUrl parameter' })
  }

  try {
    const files = await fetchGitHubRepoFiles(repoUrl)
    res.status(200).json({ files })
  } catch (error) {
    console.error('Error fetching GitHub files:', error)
    res.status(500).json({ error: 'Failed to fetch repository files' })
  }
}
