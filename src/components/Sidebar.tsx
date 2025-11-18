'use client'

interface SidebarProps {
  currentView: 'workshop' | 'individual'
  onViewChange: (view: 'workshop' | 'individual') => void
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'workshop', label: 'Workshop Under Review' },
    { id: 'individual', label: 'Individual Under Review' },
  ]

  return (
    <div className="w-[280px] bg-sidebar border-r-2 border-border p-6 flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-text tracking-tight">Boba Drops</h1>
        <p className="text-sm text-mutedText mt-1 font-medium">Submission Reviewer</p>
      </div>

      <nav className="flex-1 space-y-1.5">
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

      <div className="bg-white border-2 border-border rounded-xl p-4 mt-auto shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
            R
          </div>
          <div>
            <p className="font-semibold text-sm text-text">Reviewer</p>
            <p className="text-xs text-mutedText">Active Session</p>
          </div>
        </div>
      </div>
    </div>
  )
}
