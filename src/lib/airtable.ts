import Airtable from 'airtable'

const apiKey = process.env.AIRTABLE_API_KEY
const baseId = process.env.AIRTABLE_BASE_ID
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Websites'

if (!apiKey || !baseId) {
  throw new Error('Missing Airtable configuration in environment variables')
}

const base = new Airtable({ apiKey }).base(baseId)

export interface AirtableSubmission {
  id: string
  fields: {
    Name: string
    'Code URL': string
    'Playable URL': string
    Status: 'Pending' | 'Approved' | 'Changes Requested'
    'Decision Reason (text)'?: string
    'Event Code': string
    Screenshot?: string
    Birthdate?: string
  }
}

export async function getSubmissions(view?: string): Promise<AirtableSubmission[]> {
  const records: AirtableSubmission[] = []

  try {
    const selectOptions: any = {}
    if (view) {
      selectOptions.view = view
    }

    await base(tableName)
      .select(selectOptions)
      .eachPage((pageRecords, fetchNextPage) => {
        records.push(...(pageRecords as any))
        fetchNextPage()
      })

    console.log(`Successfully fetched ${records.length} records from Airtable ${view ? `(view: ${view})` : ''}`)
    return records
  } catch (error) {
    console.error('Airtable getSubmissions error:', error)
    throw error
  }
}

export async function updateSubmissionStatus(
  recordId: string,
  status: string,
  decisionReason: string
): Promise<void> {
  await base(tableName).update(recordId, {
    'Status': status,
    'Decision Reason (text)': decisionReason,
  })
}
