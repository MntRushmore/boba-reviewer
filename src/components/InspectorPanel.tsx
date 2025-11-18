'use client'

import { useState } from 'react'
import { Submission } from '@/app/page'
import PreviewFrame from './PreviewFrame'
import CodeViewer from './CodeViewer'

interface InspectorPanelProps {
  submission: Submission | null
  onStatusUpdate: (id: string, status: string, reason: string) => void
  onNext: () => void
}

export default function InspectorPanel({ submission, onStatusUpdate, onNext }: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [feedback, setFeedback] = useState('')

  if (!submission) {
    return <div className="flex-1 flex items-center justify-center text-mutedText">Select a submission to review</div>
  }

  const handleApprove = () => {
    const confirmed = window.confirm('Are you sure you want to approve this submission?')
    if (!confirmed) return

    onStatusUpdate(submission.id, 'Approved', feedback || 'Approved')
    setFeedback('')
  }

  const handleReject = () => {
    if (!feedback.trim()) {
      alert('Please provide specific feedback for rejection')
      return
    }
    onStatusUpdate(submission.id, 'Rejected', feedback)
    setFeedback('')
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden bg-white/20">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-text">{submission.name}</h2>
          <p className="text-sm text-mutedText font-medium">{submission.eventCode}</p>
        </div>

        <div className="flex gap-1 bg-white border-2 border-border rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              activeTab === 'preview' ? 'bg-accent text-white shadow-sm' : 'text-text hover:bg-gray-50'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              activeTab === 'code' ? 'bg-accent text-white shadow-sm' : 'text-text hover:bg-gray-50'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border-2 border-border rounded-xl p-4 mb-4 overflow-hidden shadow-md">
        {activeTab === 'preview' ? <PreviewFrame url={submission.playableUrl} /> : <CodeViewer repoUrl={submission.codeUrl} />}
      </div>

      <div className="space-y-3">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add your review feedback here..."
          className="w-full h-24 p-4 border-2 border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none shadow-sm text-sm"
        />

        <div className="flex gap-3">
          <button onClick={handleApprove} className="btn-primary flex-1">
            Approve
          </button>
          <button onClick={handleReject} className="btn-secondary flex-1">
            Reject
          </button>
          <button onClick={onNext} className="btn-secondary px-6">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}