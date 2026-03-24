import { useEffect, useState, lazy, Suspense } from 'react'
import { usePosts } from '@/hooks/usePosts'
import { useGeolocation } from '@/hooks/useGeolocation'
import { PostCard } from '@/components/feed/PostCard'
import { CategoryFilter } from '@/components/categories/CategoryFilter'
import { DISTANCE_OPTIONS } from '@/lib/constants'
import { useFeedStore } from '@/stores/feedStore'
import { MapPin, Map } from 'lucide-react'
import { PostSkeleton } from '@/components/ui/Skeleton'
import { useNavigate } from 'react-router'

const PostMap = lazy(() => import('@/components/map/PostMap').then(m => ({ default: m.PostMap })))

export function ExplorePage() {
  const { posts, loading, fetchPosts, toggleLike } = usePosts()
  const { latitude, longitude, requestLocation, error: geoError } = useGeolocation()
  const { filter, setFilter } = useFeedStore()
  const navigate = useNavigate()
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div>
      {/* Search / Location bar */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={requestLocation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              latitude ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MapPin size={16} />
            {latitude ? 'Ubicación activa' : 'Activar ubicación'}
          </button>

          {latitude && (
            <select
              value={filter.radius}
              onChange={(e) => setFilter({ radius: Number(e.target.value) })}
              className="border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {DISTANCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowMap(!showMap)}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              showMap ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Map size={16} />
            Mapa
          </button>
        </div>

        {geoError && (
          <p className="text-xs text-amber-600">No se pudo obtener tu ubicación: {geoError}</p>
        )}
      </div>

      <CategoryFilter />

      {/* Map */}
      {showMap && (
        <Suspense fallback={
          <div className="h-80 bg-gray-100 flex items-center justify-center border-b border-gray-200">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <PostMap
            posts={posts}
            userLat={latitude}
            userLng={longitude}
          />
        </Suspense>
      )}

      {/* Posts */}
      {loading ? (
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4].map((i) => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 px-4">
          <span className="text-4xl">🔍</span>
          <h2 className="text-lg font-semibold text-gray-900 mt-3">No se encontraron resultados</h2>
          <p className="text-gray-500 text-sm mt-1">Prueba a cambiar los filtros o el radio de búsqueda</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={toggleLike}
            onContact={() => navigate(`/messages`)}
          />
        ))
      )}
    </div>
  )
}
