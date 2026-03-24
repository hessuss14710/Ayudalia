import { useState } from 'react'
import { Link } from 'react-router'
import { AlertTriangle, X } from 'lucide-react'
import type { Campaign } from '@/types'

export function EmergencyBar({ campaigns }: { campaigns: Campaign[] }) {
  const [dismissed, setDismissed] = useState(false)
  const urgent = campaigns.find((c) => c.urgency === 'critica' && c.status === 'activa' && c.emergency_approved)

  if (!urgent || dismissed) return null

  return (
    <div className="bg-red-600 text-white px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <AlertTriangle size={18} className="shrink-0 animate-pulse" />
        <span className="text-sm font-semibold truncate">EMERGENCIA:</span>
        <Link
          to={`/campaign/${urgent.id}`}
          className="text-sm text-white underline truncate hover:text-red-100"
        >
          {urgent.title}
        </Link>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Link
          to={`/campaign/${urgent.id}`}
          className="bg-white text-red-600 px-4 py-1 rounded-full text-xs font-bold hover:bg-red-50 no-underline"
        >
          DONAR AHORA
        </Link>
        <button onClick={() => setDismissed(true)} className="text-red-200 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
