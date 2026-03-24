import { Link, NavLink } from 'react-router'
import { MessageCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export function Header({ unreadCount = 0 }: { unreadCount?: number }) {
  const { user, profile } = useAuthStore()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1.5 rounded-full no-underline transition-colors ${
      isActive ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-100'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
      <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
        <span className="text-2xl">🤝</span>
        <span className="text-xl font-bold text-emerald-600">Ayudalia</span>
      </Link>

      {/* Nav links - visible en tablets */}
      <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
        <NavLink to="/" className={linkClass} end>Inicio</NavLink>
        <NavLink to="/explore" className={linkClass}>Explorar</NavLink>
        <NavLink to="/campaigns" className={linkClass}>Campañas</NavLink>
        {user && <NavLink to="/create" className={linkClass}>Publicar</NavLink>}
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        {user ? (
          <>
            <Link to="/messages" className="relative text-gray-600 hover:text-emerald-600">
              <MessageCircle size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link to={`/profile/${profile?.id}`} className="flex items-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                  {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </Link>
          </>
        ) : (
          <Link
            to="/auth"
            className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-emerald-600 no-underline"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}
