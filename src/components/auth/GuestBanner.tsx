import { useState } from 'react'
import { Link } from 'react-router'
import { X } from 'lucide-react'

export function GuestBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between">
      <p className="text-sm text-emerald-800">
        <span className="font-medium">Bienvenido a Ayudalia.</span>{' '}
        <Link to="/auth" className="underline text-emerald-700 font-medium">
          Regístrate
        </Link>{' '}
        para publicar, comentar y conectar con otros.
      </p>
      <button onClick={() => setVisible(false)} className="text-emerald-600 hover:text-emerald-800 p-1">
        <X size={16} />
      </button>
    </div>
  )
}
