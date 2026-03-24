import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useFeedStore } from '@/stores/feedStore'
import { useAuthStore } from '@/stores/authStore'
import type { Post, PostType, Scope } from '@/types'

export function usePosts() {
  const { posts, loading, filter, setPosts, addPost, updatePost, removePost, setLoading } = useFeedStore()
  const user = useAuthStore((s) => s.user)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('posts')
        .select('*, author:profiles!posts_author_id_fkey(*)')
        .eq('status', 'activo')
        .order('created_at', { ascending: false })
        .limit(50)

      if (filter.category) {
        query = query.eq('category_id', filter.category)
      }
      if (filter.scope !== 'all') {
        query = query.eq('scope', filter.scope)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error fetching posts:', JSON.stringify(error))
        throw error
      }

      const postsData = (data ?? []) as Post[]

      if (user) {
        const { data: likes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postsData.map((p) => p.id))

        const likedIds = new Set(likes?.map((l) => l.post_id) ?? [])
        postsData.forEach((p) => {
          p.user_has_liked = likedIds.has(p.id)
        })
      }

      setPosts(postsData)
    } finally {
      setLoading(false)
    }
  }, [filter, user])

  async function createPost(data: {
    title: string
    body: string
    post_type: PostType
    category_id: number
    scope: Scope
    media_urls?: string[]
    location_name?: string
    latitude?: number
    longitude?: number
  }) {
    if (!user) throw new Error('Debes iniciar sesión')
    const { data: post, error } = await supabase
      .from('posts')
      .insert({ ...data, author_id: user.id, media_urls: data.media_urls ?? [] })
      .select('*, author:profiles!posts_author_id_fkey(*)')
      .single()
    if (error) {
      console.error('Error creating post:', JSON.stringify(error))
      throw error
    }
    if (post) addPost(post as Post)
    return post
  }

  async function toggleLike(postId: string) {
    if (!user) return
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    if (post.user_has_liked) {
      const { error } = await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', postId)
      if (error) { console.error('Error unlike:', error); return }
      updatePost(postId, { likes_count: Math.max(0, post.likes_count - 1), user_has_liked: false })
    } else {
      const { error } = await supabase.from('likes').insert({ user_id: user.id, post_id: postId })
      if (error) { console.error('Error like:', error); return }
      updatePost(postId, { likes_count: post.likes_count + 1, user_has_liked: true })
    }
  }

  async function deletePost(postId: string) {
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (error) throw error
    removePost(postId)
  }

  return { posts, loading, fetchPosts, createPost, toggleLike, deletePost }
}
