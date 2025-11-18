import type { NextApiRequest, NextApiResponse } from 'next'
import { getSubmissions } from '@/lib/airtable'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { status } = req.query
    const submissions = await getSubmissions(status as string)
    
    res.status(200).json({ submissions })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    res.status(500).json({ error: 'Failed to fetch submissions' })
  }
}