'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import SubmissionList from '@/components/SubmissionList'
import InspectorPanel from '@/components/InspectorPanel'

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
  const [currentView, setCurrentView] = useState<'workshop' | 'individual'>('workshop')
  const [loading, setLoading] = useState(true)

  const viewNameMap = {
    workshop: 'Workshop Under Review',
    individual: 'Individual Under Review',
  }

  useEffect(() => {
    fetchSubmissions()
  }, [currentView])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const viewName = viewNameMap[currentView]
      const res = await fetch(`/api/submission/submissions?view=${encodeURIComponent(viewName)}`)
      const data = await res.json()
      setSubmissions(data.submissions || [])

      // Auto-select the first pending submission
      const firstPending = data.submissions?.find((s: Submission) => s.status === 'Pending')
      if (firstPending) {
        setSelectedSubmission(firstPending)
      } else if (data.submissions?.length > 0) {
        setSelectedSubmission(data.submissions[0])
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string, reason: string) => {
    try {
      const res = await fetch('/api/submission/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, decisionReason: reason }),
      })

      if (res.ok) {
        // Update local state
        setSubmissions(prev =>
          prev.map(s => (s.id === id ? { ...s, status: status as any, decisionReason: reason } : s))
        )

        // Move to next pending submission
        handleNext()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update submission status')
    }
  }

  const handleNext = () => {
    const currentIndex = submissions.findIndex(s => s.id === selectedSubmission?.id)
    const nextPending = submissions
      .slice(currentIndex + 1)
      .find(s => s.status === 'Pending')

    if (nextPending) {
      setSelectedSubmission(nextPending)
    } else {
      // Wrap around to first pending
      const firstPending = submissions.find(s => s.status === 'Pending')
      setSelectedSubmission(firstPending || null)
    }
  }

  // No filtering needed - view selection is done at API level
  const filteredSubmissions = submissions

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
    <div className="flex h-screen">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <SubmissionList
        submissions={filteredSubmissions}
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
  )
}
