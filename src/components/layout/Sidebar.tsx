import { NavLink } from 'react-router'
import { Home, Search, PlusCircle, MessageCircle, User, Settings, Heart, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const { user, profile } = useAuthStore()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-colors no-underline ${
      isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'
    }`

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white h-screen sticky top-0 p-4">
      <div className="flex items-center gap-2 px-4 py-3 mb-4">
        <span className="text-3xl">🤝</span>
        <span className="text-2xl font-bold text-emerald-600">Ayudalia</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <NavLink to="/" className={linkClass} end>
          <Home size={22} /> Inicio
        </NavLink>
        <NavLink to="/explore" className={linkClass}>
          <Search size={22} /> Explorar
        </NavLink>
        <NavLink to="/campaigns" className={linkClass}>
          <Heart size={22} /> Campañas
        </NavLink>
        {user && (
          <>
            <NavLink to="/create" className={linkClass}>
              <PlusCircle size={22} /> Publicar
            </NavLink>
            <NavLink to="/messages" className={linkClass}>
              <div className="relative">
                <MessageCircle size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              Mensajes
            </NavLink>
            <NavLink to={`/profile/${user.id}`} className={linkClass}>
              <User size={22} /> Perfil
            </NavLink>
            <NavLink to="/settings" className={linkClass}>
              <Settings size={22} /> Ajustes
            </NavLink>
            {profile?.is_admin && (
              <NavLink to="/admin" className={linkClass}>
                <ShieldCheck size={22} /> Admin
              </NavLink>
            )}
          </>
        )}
      </nav>

      {user && profile ? (
        <div className="border-t border-gray-200 pt-3 mt-3 px-4">
          <div className="flex items-center gap-2">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                {profile.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{profile.full_name}</p>
              <p className="text-xs text-gray-500 truncate">@{profile.username}</p>
            </div>
          </div>
        </div>
      ) : (
        <NavLink
          to="/auth"
          className="mt-3 bg-emerald-500 text-white py-2.5 rounded-xl text-center font-medium hover:bg-emerald-600 no-underline"
        >
          Iniciar sesión
        </NavLink>
      )}
    </aside>
  )
}
