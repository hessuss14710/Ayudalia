import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Profile } from '@/types'

export function useAuth() {
  const { user, profile, loading, setUser, setProfile, setLoading, isGuest } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data as Profile)
  }

  async function signUp(email: string, password: string, metadata?: { full_name?: string; username?: string; profile_type?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: metadata ? { data: metadata } : undefined,
    })
    if (error) throw error
    return data
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) return
    // Wait for trigger to create profile if it doesn't exist yet
    let retries = 5
    while (retries > 0) {
      const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).single()
      if (existing) break
      await new Promise((r) => setTimeout(r, 500))
      retries--
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (error) throw error
    if (data) setProfile(data as Profile)
    return data
  }

  return { user, profile, loading, isGuest: isGuest(), signUp, signIn, signOut, updateProfile, fetchProfile }
}
