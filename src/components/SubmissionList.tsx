'use client'

import SubmissionCard from './SubmissionCard'
import { Submission } from '@/app/page'

interface SubmissionListProps {
  submissions: Submission[]
  selectedId?: string
  onSelect: (submission: Submission) => void
  loading: boolean
}

export default function SubmissionList({ submissions, selectedId, onSelect, loading }: SubmissionListProps) {
  if (loading) {
    return (
      <div className="w-[440px] border-r-2 border-border p-6 overflow-y-auto bg-white/30">
        <div className="text-center text-mutedText py-12">
          <div className="animate-spin w-8 h-8 border-3 border-border border-t-accent rounded-full mx-auto mb-3"></div>
          <p className="font-medium">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="w-[440px] border-r-2 border-border p-6 overflow-y-auto bg-white/30">
        <div className="text-center text-mutedText py-12">
          <p className="font-medium">No submissions found</p>
          <p className="text-xs mt-1">Check your filter settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[440px] border-r-2 border-border p-6 overflow-y-auto bg-white/30">
      <h2 className="text-xl font-bold mb-5 text-text">
        Submissions <span className="text-mutedText font-normal text-base">({submissions.length})</span>
      </h2>
      <div className="space-y-3">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            isSelected={submission.id === selectedId}
            onSelect={() => onSelect(submission)}
          />
        ))}
      </div>
    </div>
  )
}