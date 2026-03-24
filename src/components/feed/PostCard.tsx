import { Link } from 'react-router'
import { Heart, MessageCircle, MapPin, Share2, FileText } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { useToast } from '@/components/ui/Toast'
import type { Post } from '@/types'
import { useAuthStore } from '@/stores/authStore'

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'ahora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `hace ${days}d`
  return new Date(date).toLocaleDateString('es-ES')
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|avi)$/i.test(url)
}

function isDocument(url: string): boolean {
  return /\.(pdf|doc|docx|xls|xlsx|txt)$/i.test(url)
}

function getFileName(url: string): string {
  return url.split('/').pop()?.split('?')[0] ?? 'documento'
}

interface PostCardProps {
  post: Post
  onLike?: (id: string) => void
  onContact?: (authorId: string) => void
  fullView?: boolean
}

export function PostCard({ post, onLike, onContact, fullView = false }: PostCardProps) {
  const user = useAuthStore((s) => s.user)
  const toast = useToast((s) => s.add)
  const category = CATEGORIES.find((c) => c.id === post.category_id)
  const author = post.author

  const images = post.media_urls.filter((u) => !isVideo(u) && !isDocument(u))
  const videos = post.media_urls.filter(isVideo)
  const docs = post.media_urls.filter(isDocument)

  return (
    <article className="p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <Link to={`/profile/${post.author_id}`} className="shrink-0">
          {author?.avatar_url ? (
            <img src={author.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              {author?.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/profile/${post.author_id}`} className="font-semibold text-gray-900 text-sm no-underline hover:underline">
              {author?.full_name ?? 'Usuario'}
            </Link>
            {author?.profile_type && (
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                author.profile_type === 'oferente'
                  ? 'bg-emerald-50 text-emerald-600'
                  : author.profile_type === 'demandante'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-purple-50 text-purple-600'
              }`}>
                {author.profile_type === 'oferente' ? 'Ayudante' : author.profile_type === 'demandante' ? 'Solicita' : 'Ambos'}
              </span>
            )}
            <span className="text-gray-400 text-xs">· {timeAgo(post.created_at)}</span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                post.post_type === 'oferta'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {post.post_type === 'oferta' ? '🤲 Ofrece ayuda' : '🆘 Necesita ayuda'}
            </span>
            {category && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: category.color + '20', color: category.color }}
              >
                {category.name}
              </span>
            )}
          </div>

          {/* Content */}
          <Link to={`/post/${post.id}`} className="no-underline block mt-2">
            <h3 className="font-bold text-gray-900 text-base leading-snug">{post.title}</h3>
            <p className={`text-gray-600 text-sm mt-1.5 whitespace-pre-wrap leading-relaxed ${fullView ? '' : 'line-clamp-3'}`}>
              {post.body}
            </p>
          </Link>

          {/* Images */}
          {images.length > 0 && (
            <Link to={`/post/${post.id}`} className="block mt-3">
              {images.length === 1 ? (
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={images[0]}
                    alt=""
                    loading="lazy"
                    className="w-full max-h-96 object-contain bg-gray-100 rounded-xl"
                  />
                </div>
              ) : (
                <div className={`grid gap-1 rounded-xl overflow-hidden ${
                  images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'
                }`}>
                  {images.slice(0, 4).map((url, i) => (
                    <div key={i} className={`relative ${images.length === 3 && i === 0 ? 'row-span-2' : ''}`}>
                      <img
                        src={url}
                        alt=""
                        loading="lazy"
                        className="w-full h-40 md:h-52 object-cover"
                      />
                      {i === 3 && images.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold">
                          +{images.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Link>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div className="mt-3 space-y-2">
              {videos.map((url, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-black">
                  <video
                    src={url}
                    controls
                    className="w-full max-h-80"
                    preload="metadata"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Documents */}
          {docs.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {docs.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline"
                >
                  <FileText size={18} className="text-gray-400 shrink-0" />
                  <span className="truncate">{getFileName(url)}</span>
                </a>
              ))}
            </div>
          )}

          {/* Location */}
          {post.location_name && (
            <div className="flex items-center gap-1 mt-2 text-gray-400 text-xs">
              <MapPin size={12} />
              <span>{post.location_name}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => onLike?.(post.id)}
              disabled={!user}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all ${
                post.user_has_liked
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              } disabled:opacity-40 disabled:hover:bg-transparent`}
            >
              <Heart size={17} fill={post.user_has_liked ? 'currentColor' : 'none'} />
              {post.likes_count > 0 && <span>{post.likes_count}</span>}
            </button>

            <Link
              to={`/post/${post.id}`}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-full no-underline transition-all"
            >
              <MessageCircle size={17} />
              {post.comments_count > 0 && <span>{post.comments_count}</span>}
            </Link>

            <button
              onClick={() => {
                const url = `${window.location.origin}/post/${post.id}`
                if (navigator.share) {
                  navigator.share({ title: post.title, text: post.body.slice(0, 100), url })
                } else {
                  navigator.clipboard.writeText(url)
                  toast('Enlace copiado al portapapeles')
                }
              }}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-all"
            >
              <Share2 size={17} />
            </button>

            {user && post.author_id !== user.id && (
              <button
                onClick={() => onContact?.(post.author_id)}
                className={`ml-auto text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
                  post.post_type === 'solicitud'
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {post.post_type === 'solicitud' ? 'Quiero ayudar' : 'Me interesa'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
