import Airtable from 'airtable'

const apiKey = process.env.AIRTABLE_API_KEY
const baseId = process.env.AIRTABLE_BASE_ID
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Websites'

// Mock data for development when Airtable isn't configured
const MOCK_DATA = [
  {
    id: 'rec1',
    name: 'Alice Johnson',
    codeUrl: 'https://github.com/hackclub/some-game',
    playableUrl: 'https://some-game.vercel.app',
    status: 'Pending',
    eventCode: 'SOM2024',
    screenshot: 'https://via.placeholder.com/300x200/7A4E2D/FFFFFF?text=Game+1',
    birthdate: '2000-05-15',
  },
  {
    id: 'rec2',
    name: 'Bob Smith',
    codeUrl: 'https://github.com/hackclub/cool-project',
    playableUrl: 'https://cool-project.vercel.app',
    status: 'Pending',
    eventCode: 'SOM2024',
    screenshot: 'https://via.placeholder.com/300x200/C7B398/3A2E1F?text=Project+2',
    birthdate: '1999-08-22',
  },
  {
    id: 'rec3',
    name: 'Carol Davis',
    codeUrl: 'https://github.com/hackclub/awesome-site',
    playableUrl: 'https://awesome-site.vercel.app',
    status: 'Approved',
    eventCode: 'SOM2024',
    screenshot: 'https://via.placeholder.com/300x200/F9ECD8/7A4E2D?text=Site+3',
    birthdate: '2001-03-10',
    decisionReason: 'Excellent work! Clean code and great UX.',
  },
  {
    id: 'rec4',
    name: 'David Lee',
    codeUrl: 'https://github.com/hackclub/fun-app',
    playableUrl: 'https://fun-app.vercel.app',
    status: 'Pending',
    eventCode: 'SOM2024',
    screenshot: 'https://via.placeholder.com/300x200/6B5A4B/F2E3C6?text=App+4',
    birthdate: '2002-01-20',
  },
  {
    id: 'rec5',
    name: 'Emma Wilson',
    codeUrl: 'https://github.com/hackclub/neat-tool',
    playableUrl: 'https://neat-tool.vercel.app',
    status: 'Changes Requested',
    eventCode: 'SOM2024',
    screenshot: 'https://via.placeholder.com/300x200/F2E3C6/3A2E1F?text=Tool+5',
    birthdate: '2000-11-05',
    decisionReason: 'Please add better error handling and improve accessibility.',
  },
]

let base: any = null

if (apiKey && baseId) {
  Airtable.configure({ apiKey })
  base = Airtable.base(baseId)
}

export async function getSubmissions(statusFilter?: string) {
  // Use mock data if Airtable not configured
  if (!base) {
    console.warn('Using mock data - Airtable not configured')
    if (statusFilter) {
      const statuses = statusFilter.split(',')
      return MOCK_DATA.filter(s => statuses.includes(s.status))
    }
    return MOCK_DATA
  }

  const records = await base(tableName)
    .select({
      filterByFormula: statusFilter ? `{Status} = "${statusFilter}"` : '',
      sort: [{ field: 'Created', direction: 'desc' }],
    })
    .all()

  return records.map((record: any) => ({
    id: record.id,
    name: record.get('Name'),
    codeUrl: record.get('Code URL'),
    playableUrl: record.get('Playable URL'),
    status: record.get('Status'),
    decisionReason: record.get('Decision Reason'),
    birthdate: record.get('Birthdate'),
    screenshot: record.get('Screenshot')?.[0]?.url,
    eventCode: record.get('Event Code'),
  }))
}

export async function getSubmission(id: string) {
  if (!base) {
    return MOCK_DATA.find(s => s.id === id)
  }

  const record = await base(tableName).find(id)
  return {
    id: record.id,
    name: record.get('Name'),
    codeUrl: record.get('Code URL'),
    playableUrl: record.get('Playable URL'),
    status: record.get('Status'),
    decisionReason: record.get('Decision Reason'),
    birthdate: record.get('Birthdate'),
    screenshot: record.get('Screenshot')?.[0]?.url,
    eventCode: record.get('Event Code'),
  }
}

export async function updateSubmission(id: string, status: string, reason: string) {
  if (!base) {
    console.warn('Mock mode - update not persisted')
    const submission = MOCK_DATA.find(s => s.id === id)
    if (submission) {
      submission.status = status as any
      submission.decisionReason = reason
    }
    return submission
  }

  const record = await base(tableName).update(id, {
    Status: status,
    'Decision Reason': reason,
  })

  return {
    id: record.id,
    name: record.get('Name'),
    status: record.get('Status'),
    decisionReason: record.get('Decision Reason'),
  }
}