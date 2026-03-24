import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/hooks/useAuth'
import { PostCard } from '@/components/feed/PostCard'
import { MapPin, LogOut, Settings } from 'lucide-react'
import type { Profile, Post } from '@/types'

export function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const { signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const isOwn = currentUser?.id === id

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase
        .from('posts')
        .select('*, author:profiles!posts_author_id_fkey(*)')
        .eq('author_id', id)
        .order('created_at', { ascending: false })
        .limit(20),
    ]).then(([profileRes, postsRes]) => {
      if (profileRes.data) setProfile(profileRes.data as Profile)
      if (postsRes.data) setPosts(postsRes.data as Post[])
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return <div className="text-center py-12 text-gray-500">Perfil no encontrado</div>
  }

  const typeLabel = profile.profile_type === 'oferente' ? 'Oferente' : profile.profile_type === 'demandante' ? 'Demandante' : 'Oferente y Demandante'
  const typeColor = profile.profile_type === 'oferente' ? 'bg-emerald-100 text-emerald-700' : profile.profile_type === 'demandante' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'

  return (
    <div>
      {/* Profile header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-start gap-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold">
              {profile.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{profile.full_name}</h1>
            <p className="text-gray-500 text-sm">@{profile.username}</p>
            <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${typeColor}`}>
              {typeLabel}
            </span>
            {profile.location_name && (
              <p className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                <MapPin size={14} /> {profile.location_name}
              </p>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="text-gray-700 text-sm mt-4 whitespace-pre-wrap">{profile.bio}</p>
        )}

        <div className="flex items-center gap-3 mt-4">
          {isOwn ? (
            <>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Settings size={16} /> Editar perfil
              </button>
              <button
                onClick={async () => { await signOut(); navigate('/') }}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Salir
              </button>
            </>
          ) : currentUser ? (
            <button
              onClick={() => {
                navigate(`/messages`)
              }}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600"
            >
              Enviar mensaje
            </button>
          ) : null}
        </div>
      </div>

      {/* Posts */}
      <div className="mt-2">
        <h2 className="px-4 py-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Publicaciones ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">Sin publicaciones aún</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
