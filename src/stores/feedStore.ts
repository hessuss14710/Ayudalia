import { create } from 'zustand'
import type { Post } from '@/types'

interface FeedState {
  posts: Post[]
  loading: boolean
  filter: {
    category: number | null
    scope: 'local' | 'global' | 'all'
    radius: number
  }
  setPosts: (posts: Post[]) => void
  addPost: (post: Post) => void
  updatePost: (id: string, updates: Partial<Post>) => void
  removePost: (id: string) => void
  setLoading: (loading: boolean) => void
  setFilter: (filter: Partial<FeedState['filter']>) => void
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  loading: false,
  filter: {
    category: null,
    scope: 'all',
    radius: 50,
  },
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (id, updates) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removePost: (id) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
  setLoading: (loading) => set({ loading }),
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
}))
