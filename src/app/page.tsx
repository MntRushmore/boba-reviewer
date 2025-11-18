'use client'

import Sidebar from '@/components/Sidebar'
import SubmissionList from '@/components/SubmissionList'
import InspectorPanel from '@/components/InspectorPanel'
import { useState, useEffect } from 'react'
import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'

export interface Submission {
  id: string
  name: string
  codeUrl: string
  playableUrl: string
  status: 'Pending' | 'Approved' | 'Rejected'
  decisionReason?: string
  birthdate?: string
  screenshot?: string
  eventCode: string
}

export default function Home() {
  const user = useUser()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [currentView, setCurrentView] = useState<'workshop' | 'individual'>('workshop')
  const [loading, setLoading] = useState(true)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!user) {
      const signInUrl = 'https://boba-reviewer-green.hackclub.dev/handler/sign-in?after_auth_return_to=%2Fhandler%2Fsign-up'
      window.location.href = signInUrl
    }
  }, [user, router])

  useEffect(() => {
    fetchSubmissions()
  }, [currentView])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const viewName = currentView === 'workshop' ? 'Workshop Under Review' : 'Individual Under Review'
      const res = await fetch(`/api/submission/submissions?view=${encodeURIComponent(viewName)}`)
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
      console.log('Updating submission:', { id, status, reason })

      const res = await fetch('/api/submission/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, reason }),
      })

      const data = await res.json()
      console.log('Update response:', data)

      if (res.ok) {
        console.log('Status updated successfully, refreshing submissions...')
        await fetchSubmissions()
        handleNext()
      } else {
        console.error('Failed to update status:', data)
        alert(`Failed to update status: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status. Please check the console for details.')
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

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9ECD8]">
        <div className="text-center">
          <div className="text-xl font-medium text-[#3A2E1F]">Checking authentication...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
      />

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