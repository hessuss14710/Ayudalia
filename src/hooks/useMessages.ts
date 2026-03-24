import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Conversation, Message, Profile } from '@/types'

export function useMessages() {
  const user = useAuthStore((s) => s.user)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const typingTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null)

  // Init notification sound
  useEffect(() => {
    // Create a simple beep using AudioContext
    notificationSoundRef.current = null
  }, [])

  const playNotificationSound = useCallback(() => {
    try {
      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gain.gain.value = 0.3
      oscillator.start()
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      oscillator.stop(ctx.currentTime + 0.3)
    } catch {
      // Audio not available
    }
  }, [])

  const fetchConversations = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

      if (data) {
        const convos = data as Conversation[]
        const otherIds = convos.map((c) =>
          c.participant_1 === user.id ? c.participant_2 : c.participant_1
        )
        if (otherIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', otherIds)

          // Fetch last message for each conversation
          const { data: lastMessages } = await supabase
            .from('messages')
            .select('*')
            .in('conversation_id', convos.map((c) => c.id))
            .order('created_at', { ascending: false })

          convos.forEach((c) => {
            const otherId = c.participant_1 === user.id ? c.participant_2 : c.participant_1
            c.other_user = profiles?.find((p) => p.id === otherId)
            c.last_message = lastMessages?.find((m) => m.conversation_id === c.id) as Message | undefined
          })
        }
        setConversations(convos)
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchMessages = useCallback(async (conversationId: string) => {
    setActiveConversation(conversationId)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data as Message[])

    if (user) {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
    }
  }, [user])

  const uploadAttachment = useCallback(async (file: File): Promise<{ url: string; type: string; name: string }> => {
    if (!user) throw new Error('No autenticado')
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('chat-attachments').upload(path, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('chat-attachments').getPublicUrl(path)
    return { url: urlData.publicUrl, type: file.type, name: file.name }
  }, [user])

  const sendMessage = useCallback(async (
    conversationId: string,
    body: string,
    attachment?: { url: string; type: string; name: string }
  ) => {
    if (!user) return
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body: body || (attachment ? attachment.name : ''),
        attachment_url: attachment?.url ?? null,
        attachment_type: attachment?.type ?? null,
        attachment_name: attachment?.name ?? null,
      })
      .select()
      .single()
    if (error) throw error
    if (data) setMessages((prev) => [...prev, data as Message])

    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId)
  }, [user])

  const startConversation = useCallback(async (otherUserId: string) => {
    if (!user) throw new Error('Debes iniciar sesión')
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(
        `and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`
      )
      .single()

    if (existing) return existing.id as string

    const { data, error } = await supabase
      .from('conversations')
      .insert({ participant_1: user.id, participant_2: otherUserId })
      .select()
      .single()
    if (error) throw error
    return (data as Conversation).id
  }, [user])

  // Search users to start new conversations
  const searchUsers = useCallback(async (query: string) => {
    if (!user || query.length < 2) return []
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(10)
    return (data ?? []) as Profile[]
  }, [user])

  // Send typing indicator
  const sendTyping = useCallback((conversationId: string) => {
    if (!user || !conversationId) return
    const channel = supabase.channel(`typing:${conversationId}`)
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: user.id }
    })
  }, [user])

  // Realtime messages
  useEffect(() => {
    if (!activeConversation) return

    const channel = supabase
      .channel(`messages:${activeConversation}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConversation}`,
      }, (payload) => {
        const msg = payload.new as Message
        if (msg.sender_id !== user?.id) {
          setMessages((prev) => [...prev, msg])
          playNotificationSound()
          // Mark as read
          supabase.from('messages').update({ is_read: true }).eq('id', msg.id)
        }
      })
      .subscribe()

    // Typing channel
    const typingChannel = supabase
      .channel(`typing:${activeConversation}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const typingUserId = payload.payload?.user_id
        if (typingUserId && typingUserId !== user?.id) {
          setTypingUsers((prev) => new Set(prev).add(typingUserId))
          // Clear typing after 3 seconds
          if (typingTimeoutRef.current[typingUserId]) {
            clearTimeout(typingTimeoutRef.current[typingUserId])
          }
          typingTimeoutRef.current[typingUserId] = setTimeout(() => {
            setTypingUsers((prev) => {
              const next = new Set(prev)
              next.delete(typingUserId)
              return next
            })
          }, 3000)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(typingChannel)
    }
  }, [activeConversation, user, playNotificationSound])

  // Global realtime for new messages (notification sound when not in chat)
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('global-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const msg = payload.new as Message
        if (msg.sender_id !== user.id && msg.conversation_id !== activeConversation) {
          playNotificationSound()
          setUnreadCount((prev) => prev + 1)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, activeConversation, playNotificationSound])

  // Unread count
  useEffect(() => {
    if (!user) return
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id)
      setUnreadCount(count ?? 0)
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [user])

  return {
    conversations, messages, loading, unreadCount,
    activeConversation, setActiveConversation,
    typingUsers,
    fetchConversations, fetchMessages, sendMessage, uploadAttachment, startConversation,
    searchUsers, sendTyping, playNotificationSound
  }
}
