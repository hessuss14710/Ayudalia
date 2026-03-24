import { NavLink } from 'react-router'
import { Home, Search, PlusCircle, User, MessageCircle, Heart } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export function BottomNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const user = useAuthStore((s) => s.user)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-xs transition-all duration-200 active:scale-90 ${
      isActive ? 'text-emerald-600 font-semibold' : 'text-gray-400'
    }`

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex justify-around">
      <NavLink to="/" className={linkClass} end>
        <Home size={22} />
        <span>Inicio</span>
      </NavLink>
      <NavLink to="/explore" className={linkClass}>
        <Search size={22} />
        <span>Explorar</span>
      </NavLink>
      <NavLink to="/campaigns" className={linkClass}>
        <Heart size={22} />
        <span>Campañas</span>
      </NavLink>
      {user && (
        <NavLink to="/create" className={linkClass}>
          <PlusCircle size={22} />
          <span>Publicar</span>
        </NavLink>
      )}
      {user && (
        <NavLink to="/messages" className={linkClass}>
          <div className="relative">
            <MessageCircle size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span>Mensajes</span>
        </NavLink>
      )}
      <NavLink to={user ? `/profile/${user.id}` : '/auth'} className={linkClass}>
        <User size={22} />
        <span>{user ? 'Perfil' : 'Entrar'}</span>
      </NavLink>
    </nav>
  )
}
