import type { NextApiRequest, NextApiResponse } from 'next'
import { getSubmissions } from '@/lib/airtable'
import type { Submission } from '@/app/page'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { view } = req.query
    const records = await getSubmissions(view as string)

    const submissions: Submission[] = records.map((record) => ({
      id: record.id,
      name: record.fields.Name || 'Untitled',
      codeUrl: record.fields['Code URL'] || '',
      playableUrl: record.fields['Playable URL'] || '',
      status: record.fields.Status || 'Pending',
      decisionReason: record.fields['Decision Reason (text)'],
      eventCode: record.fields['Event Code'] || 'Unknown',
      screenshot: record.fields.Screenshot,
      birthdate: record.fields.Birthdate,
    }))

    res.status(200).json({ submissions })
  } catch (error) {
    console.error('Error fetching submissions from Airtable:', error)
    res.status(500).json({ error: 'Failed to fetch submissions from Airtable' })
  }
}
