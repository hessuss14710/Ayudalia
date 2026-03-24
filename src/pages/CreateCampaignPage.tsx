import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/constants'
import { Image, X } from 'lucide-react'

export function CreateCampaignPage() {
  const navigate = useNavigate()
  const { createCampaign } = useCampaigns()
  const user = useAuthStore((s) => s.user)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState(1)
  const [goalAmount, setGoalAmount] = useState('')
  const [locationName, setLocationName] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [endDate, setEndDate] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    navigate('/auth')
    return null
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let imageUrl: string | undefined
      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `campaigns/${user!.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('media').upload(path, imageFile)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(path)
        imageUrl = urlData.publicUrl
      }

      await createCampaign({
        title,
        description,
        category_id: categoryId,
        goal_amount: parseFloat(goalAmount),
        image_url: imageUrl,
        location_name: locationName || undefined,
        urgency,
        end_date: endDate || undefined,
      })
      navigate('/campaigns')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la campaña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Crear campaña solidaria</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image */}
        <div>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="" className="w-full h-48 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null) }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
              <Image size={32} className="text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Añadir imagen de portada</span>
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título de la campaña</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Ayuda para María con su tratamiento médico"
            maxLength={120}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            placeholder="Explica la situación, por qué se necesita ayuda y cómo se usarán los fondos..."
            maxLength={5000}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/5000</p>
        </div>

        {/* Category */}
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

        {/* Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta económica (€)</label>
          <input
            type="number"
            required
            min="1"
            step="1"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: 5000"
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de urgencia</label>
          <div className="flex gap-2">
            {[
              { value: 'normal', label: 'Normal', style: 'bg-gray-100 text-gray-700' },
              { value: 'urgente', label: 'Urgente', style: 'bg-amber-100 text-amber-700' },
              { value: 'critica', label: 'Crítica', style: 'bg-red-100 text-red-700' },
            ].map((u) => (
              <button
                key={u.value}
                type="button"
                onClick={() => setUrgency(u.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  urgency === u.value ? u.style + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-50 text-gray-500'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación (opcional)</label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Madrid, España"
          />
        </div>

        {/* End date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite (opcional)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear campaña'}
        </button>
      </form>
    </div>
  )
}
