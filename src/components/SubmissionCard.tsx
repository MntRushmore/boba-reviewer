'use client'

import { Submission } from '@/app/page'

interface SubmissionCardProps {
  submission: Submission
  isSelected: boolean
  onSelect: () => void
}

export default function SubmissionCard({ submission, isSelected, onSelect }: SubmissionCardProps) {
  const statusStyles = {
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Approved: 'bg-green-50 text-green-700 border-green-200',
    'Changes Requested': 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <div
      onClick={onSelect}
      className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected ? 'ring-2 ring-accent border-accent shadow-lg' : 'border-border'
      }`}
    >
      <div>
        <h3 className="font-semibold text-base mb-1 truncate text-text">{submission.name}</h3>
        <p className="text-xs text-mutedText mb-2.5 font-medium">{submission.eventCode}</p>

        <div className={`status-badge border ${statusStyles[submission.status]} mb-3`}>
          {submission.status}
        </div>

        <div className="flex gap-3">
          <a
            href={submission.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:text-accentHover font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            View Code
          </a>
          <span className="text-border">•</span>
          <a
            href={submission.playableUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:text-accentHover font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Live Demo
          </a>
        </div>
      </div>
    </div>
  )
}