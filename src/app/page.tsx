
  import Sidebar from '@/components/Sidebar'
  import SubmissionList from '@/components/SubmissionList'
  import InspectorPanel from '@/components/InspectorPanel'

  console.log('Sidebar:', Sidebar)
  console.log('SubmissionList:', SubmissionList)
  console.log('InspectorPanel:', InspectorPanel)

  export interface Submission {
    id: string
    name: string
    codeUrl: string
    playableUrl: string
    status: 'Pending' | 'Approved' | 'Changes Requested'
    decisionReason?: string
    birthdate?: string
    screenshot?: string
    eventCode: string
  }

  export default function Home() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      fetchSubmissions()
    }, [filter])

    const fetchSubmissions = async () => {
      setLoading(true)
      try {
        const statusParam = filter === 'pending' ? 'Pending' : filter === 'completed' ? 'Approved,Changes Requested' : ''
        const res = await fetch(`/api/submissions?status=${statusParam}`)
        const data = await res.json()
        setSubmissions(data.submissions || [])
      
        if (data.submissions && data.submissions.length > 0 && !selectedSubmission) {
          setSelectedSubmission(data.submissions[0])
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    const handleStatusUpdate = async (id: string, status: string, reason: string) => {
      try {
        const res = await fetch('/api/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status, reason }),
        })
      
        if (res.ok) {
          await fetchSubmissions()
          handleNext()
        }
      } catch (error) {
        console.error('Failed to update status:', error)
      }
    }

    const handleNext = () => {
      if (!selectedSubmission) return
      const currentIndex = submissions.findIndex(s => s.id === selectedSubmission.id)
      const nextIndex = (currentIndex + 1) % submissions.length
      setSelectedSubmission(submissions[nextIndex])
    }

    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'n' || e.key === 'N') {
          handleNext()
        }
      }
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }, [selectedSubmission, submissions])

    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar currentFilter={filter} onFilterChange={setFilter} />
      
        <div className="flex-1 flex overflow-hidden">
          <SubmissionList
            submissions={submissions}
            selectedId={selectedSubmission?.id}
            onSelect={setSelectedSubmission}
            loading={loading}
          />
        
          <InspectorPanel
            submission={selectedSubmission}
            onStatusUpdate={handleStatusUpdate}
            onNext={handleNext}
          />
        </div>
      </div>
    )
  }