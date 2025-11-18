import type { NextApiRequest, NextApiResponse } from 'next'
import { updateSubmission } from '@/lib/airtable'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id, status, reason } = req.body
    console.log('Update request received:', { id, status, reason })

    if (!id || !status) {
      console.error('Missing required fields:', { id, status })
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const record = await updateSubmission(id, status, reason || '')
    console.log('Successfully updated submission:', record)

    res.status(200).json({ success: true, record })
  } catch (error: any) {
    console.error('Error updating submission:', error)
    res.status(500).json({
      error: 'Failed to update submission',
      details: error.message || error.toString()
    })
  }
}