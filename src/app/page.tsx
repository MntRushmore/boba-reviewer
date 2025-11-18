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
  const [reviewedToday, setReviewedToday] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [eventCodeFilter, setEventCodeFilter] = useState('')

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!user) {
      const signInUrl = process.env.NEXT_PUBLIC_SIGN_IN_URL || 'https://boba-reviewer-green.hackclub.dev/handler/sign-in?after_auth_return_to=%2Fhandler%2Fsign-up'
      window.location.href = signInUrl
    }
  }, [user, router])

  useEffect(() => {
    fetchSubmissions()
  }, [currentView])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const view1Name = process.env.NEXT_PUBLIC_VIEW_1_NAME || 'Workshop Under Review'
      const view2Name = process.env.NEXT_PUBLIC_VIEW_2_NAME || 'Individual Under Review'
      const viewName = currentView === 'workshop' ? view1Name : view2Name
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
        setReviewedToday(prev => prev + 1)
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

  // Calculate stats
  const stats = {
    reviewedToday,
    totalPending: submissions.filter(s => s.status === 'Pending').length,
    totalApproved: submissions.filter(s => s.status === 'Approved').length,
    totalRejected: submissions.filter(s => s.status === 'Rejected').length,
  }

  // Filter submissions based on search and event code
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = searchQuery === '' ||
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEventCode = eventCodeFilter === '' ||
      sub.eventCode === eventCodeFilter
    return matchesSearch && matchesEventCode
  })

  const handleNext = () => {
    if (!selectedSubmission) return
    const currentIndex = submissions.findIndex(s => s.id === selectedSubmission.id)
    const nextIndex = (currentIndex + 1) % submissions.length
    setSelectedSubmission(submissions[nextIndex])
  }

  // Enhanced keyboard shortcuts
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in an input/textarea
      if ((e.target as HTMLElement).tagName === 'TEXTAREA' ||
          (e.target as HTMLElement).tagName === 'INPUT') {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur()
        }
        return
      }

      switch(e.key.toLowerCase()) {
        case 'n':
        case 'arrowright':
          handleNext()
          break
        case 'arrowleft':
          handlePrevious()
          break
        case 'a':
          if (selectedSubmission) {
            const confirmed = window.confirm('Are you sure you want to approve this submission?')
            if (confirmed) {
              handleStatusUpdate(selectedSubmission.id, 'Approved', 'Approved')
            }
          }
          break
        case 'r':
          if (selectedSubmission) {
            const feedback = window.prompt('Please provide specific feedback for rejection:')
            if (feedback && feedback.trim()) {
              handleStatusUpdate(selectedSubmission.id, 'Rejected', feedback)
            }
          }
          break
        case '?':
          setShowKeyboardHelp(true)
          break
        case 'escape':
          setShowKeyboardHelp(false)
          break
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedSubmission, submissions])

  const handlePrevious = () => {
    if (!selectedSubmission) return
    const currentIndex = filteredSubmissions.findIndex(s => s.id === selectedSubmission.id)
    const prevIndex = currentIndex === 0 ? filteredSubmissions.length - 1 : currentIndex - 1
    setSelectedSubmission(filteredSubmissions[prevIndex])
  }

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

  // Get unique event codes for filter
  const eventCodes = Array.from(new Set(submissions.map(s => s.eventCode)))

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          user={user}
          stats={stats}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="bg-white border-b-2 border-border p-4 flex gap-3 items-center">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
            <select
              value={eventCodeFilter}
              onChange={(e) => setEventCodeFilter(e.target.value)}
              className="px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            >
              <option value="">All Events</option>
              {eventCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="px-4 py-2 bg-sidebar border-2 border-border rounded-lg hover:bg-white transition-colors text-sm font-medium"
              title="Keyboard Shortcuts"
            >
              ?
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
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
        </div>
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      {showKeyboardHelp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowKeyboardHelp(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 border-2 border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-text mb-4">Keyboard Shortcuts</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">Next Submission</span>
                <kbd className="px-2 py-1 bg-sidebar border border-border rounded text-xs font-mono">N</kbd>
                <kbd className="px-2 py-1 bg-sidebar border border-border rounded text-xs font-mono">→</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">Previous Submission</span>
                <kbd className="px-2 py-1 bg-sidebar border border-border rounded text-xs font-mono">←</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">Quick Approve</span>
                <kbd className="px-2 py-1 bg-sidebar border border-border rounded text-xs font-mono">A</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">Quick Reject</span>
                <kbd className="px-2 py-1 bg-sidebar border border-border rounded text-xs font-mono">R</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">Clear Input (ESC)</span>
                <kbd className="px-2 py-1 bg-sidebar border border-border rounded text-xs font-mono">ESC</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">Show This Help</span>
                <kbd className="px-2 py-1 bg-sidebar border border-border rounded text-xs font-mono">?</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowKeyboardHelp(false)}
              className="mt-6 w-full btn-primary"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  )
}