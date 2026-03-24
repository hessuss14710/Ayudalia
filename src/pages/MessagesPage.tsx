import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useMessages } from '@/hooks/useMessages'
import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft, Send, Search, Plus, Check, CheckCheck, Paperclip, X, FileText, Download } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import type { Profile } from '@/types'

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'ahora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

export function MessagesPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const {
    conversations, messages, loading, typingUsers,
    fetchConversations, fetchMessages, sendMessage, uploadAttachment,
    searchUsers, sendTyping, startConversation,
  } = useMessages()
  const toast = useToast((s) => s.add)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Profile[]>([])
  const [searching, setSearching] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    fetchConversations()
  }, [user])

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId)
    }
  }, [conversationId])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Search users
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    const timer = setTimeout(async () => {
      const results = await searchUsers(searchQuery)
      setSearchResults(results)
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchUsers])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!conversationId || (!newMessage.trim() && !pendingFile)) return
    setSending(true)
    try {
      let attachment: { url: string; type: string; name: string } | undefined
      if (pendingFile) {
        attachment = await uploadAttachment(pendingFile)
      }
      await sendMessage(conversationId, newMessage.trim(), attachment)
      setNewMessage('')
      setPendingFile(null)
      setPendingPreview(null)
    } finally {
      setSending(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast('El archivo no puede superar los 10 MB', 'warning')
      return
    }
    setPendingFile(file)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setPendingPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPendingPreview(null)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function clearPendingFile() {
    setPendingFile(null)
    setPendingPreview(null)
  }

  function handleTyping(value: string) {
    setNewMessage(value)
    if (conversationId) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      sendTyping(conversationId)
      typingTimeoutRef.current = setTimeout(() => {}, 3000)
    }
  }

  async function handleStartChat(otherUserId: string) {
    try {
      const convId = await startConversation(otherUserId)
      setShowNewChat(false)
      setSearchQuery('')
      navigate(`/messages/${convId}`)
    } catch (err) {
      console.error(err)
    }
  }

  // ============= CHAT VIEW =============
  if (conversationId) {
    const convo = conversations.find((c) => c.id === conversationId)
    const isTyping = typingUsers.size > 0

    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem-4rem)] md:h-[calc(100vh-1rem)]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => navigate('/messages')} className="text-gray-700 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <Link to={`/profile/${convo?.other_user?.id}`} className="flex items-center gap-3 no-underline flex-1 min-w-0">
            {convo?.other_user?.avatar_url ? (
              <img src={convo.other_user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                {convo?.other_user?.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {convo?.other_user?.full_name ?? 'Usuario'}
              </p>
              {isTyping ? (
                <p className="text-xs text-emerald-500 font-medium">Escribiendo...</p>
              ) : (
                <p className="text-xs text-gray-400">@{convo?.other_user?.username}</p>
              )}
            </div>
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl">👋</span>
              <p className="text-gray-400 text-sm mt-3">Envía el primer mensaje</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isOwn = msg.sender_id === user?.id
            const showTime = i === 0 ||
              new Date(msg.created_at).getTime() - new Date(messages[i - 1].created_at).getTime() > 300000

            return (
              <div key={msg.id}>
                {showTime && (
                  <p className="text-center text-xs text-gray-400 py-2">
                    {new Date(msg.created_at).toLocaleString('es-ES', {
                      hour: '2-digit', minute: '2-digit',
                      day: 'numeric', month: 'short',
                    })}
                  </p>
                )}
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-sm shadow-sm ${
                      isOwn
                        ? 'bg-emerald-500 text-white rounded-2xl rounded-br-md'
                        : 'bg-white text-gray-900 rounded-2xl rounded-bl-md border border-gray-100'
                    }`}
                  >
                    {msg.attachment_url && msg.attachment_type?.startsWith('image/') && (
                      <img
                        src={msg.attachment_url}
                        alt={msg.attachment_name ?? 'imagen'}
                        className="max-w-full rounded-lg mb-1 cursor-pointer"
                        onClick={() => window.open(msg.attachment_url!, '_blank')}
                      />
                    )}
                    {msg.attachment_url && !msg.attachment_type?.startsWith('image/') && (
                      <a
                        href={msg.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded-lg mb-1 ${
                          isOwn ? 'bg-emerald-600/30' : 'bg-gray-100'
                        }`}
                      >
                        <FileText size={20} />
                        <span className="text-xs truncate flex-1">{msg.attachment_name ?? 'Archivo'}</span>
                        <Download size={16} />
                      </a>
                    )}
                    {msg.body && <p className="whitespace-pre-wrap break-words">{msg.body}</p>}
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      isOwn ? 'text-emerald-200' : 'text-gray-400'
                    }`}>
                      <span className="text-xs">
                        {new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isOwn && (
                        msg.is_read
                          ? <CheckCheck size={14} className="text-emerald-200" />
                          : <Check size={14} className="text-emerald-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment preview */}
        {pendingFile && (
          <div className="bg-white border-t border-gray-200 px-3 pt-2 flex items-center gap-2">
            {pendingPreview ? (
              <img src={pendingPreview} alt="" className="w-16 h-16 rounded-lg object-cover" />
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <FileText size={18} className="text-gray-500" />
                <span className="text-xs text-gray-700 truncate max-w-[200px]">{pendingFile.name}</span>
              </div>
            )}
            <button onClick={clearPendingFile} className="text-gray-400 hover:text-red-500">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-3 flex gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-emerald-500 p-2.5 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white border border-transparent focus:border-emerald-300"
          />
          <button
            type="submit"
            disabled={(!newMessage.trim() && !pendingFile) || sending}
            className="bg-emerald-500 text-white p-2.5 rounded-full hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    )
  }

  // ============= NEW CHAT MODAL =============
  if (showNewChat) {
    return (
      <div>
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => { setShowNewChat(false); setSearchQuery('') }} className="text-gray-700">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Nuevo mensaje</h1>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o usuario..."
              autoFocus
              className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {searching && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {searchResults.length > 0 && (
          <div>
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">Resultados</p>
            {searchResults.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleStartChat(profile.id)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left"
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                    {profile.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{profile.full_name}</p>
                  <p className="text-xs text-gray-500">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{profile.bio}</p>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  profile.profile_type === 'oferente'
                    ? 'bg-emerald-100 text-emerald-700'
                    : profile.profile_type === 'demandante'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {profile.profile_type === 'oferente' ? 'Ayudante' : profile.profile_type === 'demandante' ? 'Solicita' : 'Ambos'}
                </span>
              </button>
            ))}
          </div>
        )}

        {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">No se encontraron usuarios</p>
        )}

        {searchQuery.length < 2 && (
          <p className="text-center py-8 text-gray-400 text-sm">Escribe al menos 2 caracteres para buscar</p>
        )}
      </div>
    )
  }

  // ============= CONVERSATIONS LIST =============
  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-lg text-gray-900">Mensajes</h1>
        <button
          onClick={() => setShowNewChat(true)}
          className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
          title="Nuevo mensaje"
        >
          <Plus size={18} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-12 px-4">
          <span className="text-5xl">💬</span>
          <h2 className="text-lg font-semibold text-gray-900 mt-4">Sin mensajes</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
            Contacta con alguien desde una publicación o busca un usuario para empezar a chatear
          </p>
          <button
            onClick={() => setShowNewChat(true)}
            className="mt-4 bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-600"
          >
            Iniciar conversación
          </button>
        </div>
      ) : (
        <div>
          {conversations.map((convo) => {
            const lastMsg = convo.last_message
            const isUnread = lastMsg && !lastMsg.is_read && lastMsg.sender_id !== user?.id

            return (
              <button
                key={convo.id}
                onClick={() => navigate(`/messages/${convo.id}`)}
                className={`w-full px-4 py-3 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50 text-left transition-colors ${
                  isUnread ? 'bg-emerald-50/50' : ''
                }`}
              >
                <div className="relative">
                  {convo.other_user?.avatar_url ? (
                    <img src={convo.other_user.avatar_url} alt="" className="w-13 h-13 rounded-full object-cover" />
                  ) : (
                    <div className="w-13 h-13 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg" style={{ width: 52, height: 52 }}>
                      {convo.other_user?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  {isUnread && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>
                      {convo.other_user?.full_name ?? 'Usuario'}
                    </p>
                    <span className={`text-xs shrink-0 ml-2 ${isUnread ? 'text-emerald-600 font-semibold' : 'text-gray-400'}`}>
                      {timeAgo(convo.last_message_at)}
                    </span>
                  </div>
                  {lastMsg ? (
                    <p className={`text-sm mt-0.5 truncate ${isUnread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      {lastMsg.sender_id === user?.id && (
                        <span className="text-gray-400">Tú: </span>
                      )}
                      {lastMsg.attachment_url ? (lastMsg.attachment_type?.startsWith('image/') ? '📷 Foto' : '📎 Archivo') : lastMsg.body}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-0.5">Sin mensajes aún</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
