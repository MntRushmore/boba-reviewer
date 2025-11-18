'use client'

import { useState } from 'react'

interface SidebarProps {
  currentView: 'workshop' | 'individual'
  onViewChange: (view: 'workshop' | 'individual') => void
  user?: any
  stats?: {
    reviewedToday: number
    totalPending: number
    totalApproved: number
    totalRejected: number
  }
}

export default function Sidebar({ currentView, onViewChange, user, stats }: SidebarProps) {
  const [showMenu, setShowMenu] = useState(false)

  const navItems = [
    { id: 'workshop', label: 'Workshop Under Review' },
    { id: 'individual', label: 'Individual Under Review' },
  ]

  const getUserInitials = () => {
    if (!user) return 'R'
    const displayName = user.displayName || user.primaryEmail || 'Reviewer'
    return displayName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserName = () => {
    if (!user) return 'Reviewer'
    return user.displayName || user.primaryEmail || 'Reviewer'
  }

  const handleSignOut = async () => {
    try {
      await user?.signOut()
      window.location.href = 'https://boba-reviewer-green.hackclub.dev/handler/sign-in?after_auth_return_to=%2Fhandler%2Fsign-up'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="w-[280px] bg-sidebar border-r-2 border-border p-6 flex flex-col h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text tracking-tight">Boba Drops</h1>
        <p className="text-sm text-mutedText mt-1 font-medium">Submission Reviewer</p>
      </div>

      <nav className="space-y-1.5 mb-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as any)}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              currentView === item.id
                ? 'bg-accent text-white shadow-md'
                : 'text-text hover:bg-white hover:shadow-sm'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Statistics Dashboard */}
      {stats && (
        <div className="bg-white border-2 border-border rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-mutedText uppercase tracking-wide mb-3">Your Stats</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text">Reviewed Today</span>
              <span className="text-sm font-bold text-accent">{stats.reviewedToday}</span>
            </div>
            <div className="h-px bg-border"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text">Pending</span>
              <span className="text-sm font-semibold text-yellow-700">{stats.totalPending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text">Approved</span>
              <span className="text-sm font-semibold text-green-700">{stats.totalApproved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text">Rejected</span>
              <span className="text-sm font-semibold text-red-700">{stats.totalRejected}</span>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to push account to bottom */}
      <div className="flex-1"></div>

      <div className="relative mt-4">
        <div
          className="bg-white border-2 border-border rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text truncate">{getUserName()}</p>
              <p className="text-xs text-mutedText">Active Session</p>
            </div>
          </div>
        </div>

        {showMenu && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border-2 border-border rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 text-sm font-medium text-text hover:bg-sidebar transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
