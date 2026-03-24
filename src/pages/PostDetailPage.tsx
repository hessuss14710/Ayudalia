import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { usePosts } from '@/hooks/usePosts'
import { PostCard } from '@/components/feed/PostCard'
import { ArrowLeft, Send } from 'lucide-react'
import type { Post, Comment } from '@/types'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { toggleLike } = usePosts()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      supabase
        .from('posts')
        .select('*, author:profiles!posts_author_id_fkey(*)')
        .eq('id', id)
        .single(),
      supabase
        .from('comments')
        .select('*, author:profiles!comments_author_id_fkey(*)')
        .eq('post_id', id)
        .order('created_at', { ascending: true }),
    ]).then(([postRes, commentsRes]) => {
      if (postRes.data) setPost(postRes.data as Post)
      if (commentsRes.data) setComments(commentsRes.data as Comment[])
      setLoading(false)
    })
  }, [id])

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !id || !newComment.trim()) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({ post_id: id, author_id: user.id, body: newComment.trim() })
        .select('*, author:profiles!comments_author_id_fkey(*)')
        .single()
      if (error) throw error
      if (data) {
        setComments((prev) => [...prev, data as Comment])
        setNewComment('')
        // Update comment count
        await supabase.from('posts').update({ comments_count: comments.length + 1 }).eq('id', id)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return <div className="text-center py-12 text-gray-500">Publicación no encontrada</div>
  }

  return (
    <div>
      {/* Back button */}
      <div className="sticky top-14 md:top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-gray-900">Publicación</h1>
      </div>

      {/* Post */}
      <PostCard post={post} onLike={toggleLike} fullView />

      {/* Comments */}
      <div className="border-t border-gray-200">
        <h2 className="px-4 py-3 text-sm font-semibold text-gray-500">
          Comentarios ({comments.length})
        </h2>

        {comments.map((comment) => (
          <div key={comment.id} className="px-4 py-3 border-b border-gray-100 flex gap-3">
            <Link to={`/profile/${comment.author_id}`} className="shrink-0">
              {comment.author?.avatar_url ? (
                <img src={comment.author.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-semibold">
                  {comment.author?.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link to={`/profile/${comment.author_id}`} className="text-sm font-semibold text-gray-900 no-underline hover:underline">
                  {comment.author?.full_name ?? 'Usuario'}
                </Link>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString('es-ES')}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">{comment.body}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center py-6 text-gray-400 text-sm">Sin comentarios aún</p>
        )}
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleComment} className="sticky bottom-16 md:bottom-0 bg-white border-t border-gray-200 p-3 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500">
          <Link to="/auth" className="text-emerald-600 font-medium">Inicia sesión</Link> para comentar
        </div>
      )}
    </div>
  )
}
