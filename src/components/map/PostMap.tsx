import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Post } from '@/types'

// Fix default marker icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const offerIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#10B981;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">🤲</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

const requestIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#3B82F6;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">🆘</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

interface PostMapProps {
  posts: Post[]
  userLat?: number | null
  userLng?: number | null
  height?: string
}

export function PostMap({ posts, userLat, userLng, height = 'h-80' }: PostMapProps) {
  const geoPosts = posts.filter((p) => p.latitude && p.longitude)

  const center: [number, number] = userLat && userLng
    ? [userLat, userLng]
    : geoPosts.length > 0
      ? [geoPosts[0].latitude!, geoPosts[0].longitude!]
      : [40.4168, -3.7038] // Madrid default

  if (geoPosts.length === 0 && !userLat) {
    return (
      <div className={`${height} bg-gray-100 flex items-center justify-center text-gray-500 text-sm border-b border-gray-200`}>
        <div className="text-center">
          <span className="text-3xl">📍</span>
          <p className="mt-2">No hay publicaciones con ubicación</p>
          <p className="text-xs text-gray-400 mt-1">Las publicaciones con ubicación aparecerán aquí</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${height} border-b border-gray-200`}>
      <MapContainer
        center={center}
        zoom={userLat ? 12 : 6}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoPosts.map((post) => (
          <Marker
            key={post.id}
            position={[post.latitude!, post.longitude!]}
            icon={post.post_type === 'oferta' ? offerIcon : requestIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  post.post_type === 'oferta' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {post.post_type === 'oferta' ? 'Ofrece ayuda' : 'Necesita ayuda'}
                </span>
                <h3 className="font-bold text-sm mt-1.5 text-gray-900">{post.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.body}</p>
                {post.location_name && (
                  <p className="text-xs text-gray-400 mt-1">📍 {post.location_name}</p>
                )}
                <Link
                  to={`/post/${post.id}`}
                  className="inline-block mt-2 text-xs font-semibold text-emerald-600 hover:underline"
                >
                  Ver publicación →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLat && userLng && (
          <Marker
            position={[userLat, userLng]}
            icon={new L.DivIcon({
              className: '',
              html: '<div style="background:#EF4444;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          >
            <Popup>
              <p className="text-sm font-medium">Tu ubicación</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
