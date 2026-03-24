import { useState } from 'react'
import { useNavigate } from 'react-router'
import { usePosts } from '@/hooks/usePosts'
import { useGeolocation } from '@/hooks/useGeolocation'
import { CATEGORIES } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { MapPin, Image, X, Video, FileText } from 'lucide-react'
import type { PostType, Scope } from '@/types'

export function CreatePostPage() {
  const navigate = useNavigate()
  const { createPost } = usePosts()
  const { latitude, longitude, requestLocation } = useGeolocation()
  const user = useAuthStore((s) => s.user)

  const [postType, setPostType] = useState<PostType>('oferta')
  const [categoryId, setCategoryId] = useState(1)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [scope, setScope] = useState<Scope>('local')
  const [locationName, setLocationName] = useState('')
  const [addLocation, setAddLocation] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    navigate('/auth')
    return null
  }

  function handleMediaSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setMediaFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setMediaPreviews((prev) => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeMedia(index: number) {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const mediaUrls: string[] = []
      for (const file of mediaFiles) {
        const ext = file.name.split('.').pop()
        const path = `posts/${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage.from('media').upload(path, file)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(path)
        mediaUrls.push(urlData.publicUrl)
      }

      await createPost({
        title,
        body,
        post_type: postType,
        category_id: categoryId,
        scope,
        media_urls: mediaUrls,
        ...(addLocation && latitude && longitude
          ? { location_name: locationName || 'Mi ubicación', latitude, longitude }
          : {}),
      })

      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al publicar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Nueva publicación</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPostType('oferta')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              postType === 'oferta'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ofrezco ayuda
          </button>
          <button
            type="button"
            onClick={() => setPostType('solicitud')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              postType === 'solicitud'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Necesito ayuda
          </button>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Describe brevemente tu oferta o necesidad"
            maxLength={100}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            placeholder="Explica con más detalle..."
            maxLength={2000}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{body.length}/2000</p>
        </div>

        {/* Media */}
        <div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-emerald-600">
              <Image size={18} />
              Fotos
              <input type="file" accept="image/*" multiple onChange={handleMediaSelect} className="hidden" />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-emerald-600">
              <Video size={18} />
              Vídeos
              <input type="file" accept="video/*" multiple onChange={handleMediaSelect} className="hidden" />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-emerald-600">
              <FileText size={18} />
              Documentos
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" multiple onChange={handleMediaSelect} className="hidden" />
            </label>
          </div>
          {mediaPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {mediaPreviews.map((preview, i) => (
                <div key={i} className="relative">
                  <img src={preview} alt="" className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={addLocation}
              onChange={(e) => {
                setAddLocation(e.target.checked)
                if (e.target.checked) requestLocation()
              }}
              className="accent-emerald-500"
            />
            <MapPin size={16} className="text-gray-500" />
            <span className="text-gray-700 font-medium">Añadir ubicación</span>
          </label>
          {addLocation && (
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Nombre del lugar (ej: Madrid, Centro)"
            />
          )}
        </div>

        {/* Scope */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alcance</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setScope('local')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                scope === 'local' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Local
            </button>
            <button
              type="button"
              onClick={() => setScope('global')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                scope === 'global' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Global
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  )
}
