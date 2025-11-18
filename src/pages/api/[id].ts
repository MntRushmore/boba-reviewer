import type { NextApiRequest, NextApiResponse } from 'next'
import { getSubmission } from '@/lib/airtable'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    const submission = await getSubmission(id as string)
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }
    
    res.status(200).json(submission)
  } catch (error) {
    console.error('Error fetching submission:', error)
    res.status(500).json({ error: 'Failed to fetch submission' })
  }
}