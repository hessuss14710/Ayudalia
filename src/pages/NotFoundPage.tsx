import { Link } from 'react-router'
import { ArrowLeft, Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="text-7xl">🔍</span>
        <h1 className="text-6xl font-bold text-gray-200 mt-4">404</h1>
        <h2 className="text-xl font-bold text-gray-900 mt-2">Página no encontrada</h2>
        <p className="text-gray-500 mt-2 text-sm">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm"
          >
            <ArrowLeft size={18} /> Volver
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 no-underline text-sm"
          >
            <Home size={18} /> Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
