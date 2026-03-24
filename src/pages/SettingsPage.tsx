import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useGeolocation } from '@/hooks/useGeolocation'
import { supabase } from '@/lib/supabase'
import { PROFILE_TYPES } from '@/lib/constants'
import { ArrowLeft, Camera } from 'lucide-react'
import type { ProfileType } from '@/types'

export function SettingsPage() {
  const navigate = useNavigate()
  const { updateProfile } = useAuth()
  const { profile, user } = useAuthStore()
  const { latitude, longitude, requestLocation } = useGeolocation()

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [username, setUsername] = useState(profile?.username ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [profileType, setProfileType] = useState<ProfileType>(profile?.profile_type ?? 'ambos')
  const [locationName, setLocationName] = useState(profile?.location_name ?? '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    const ext = file.name.split('.').pop()
    const path = `avatars/${user.id}.${ext}`
    await supabase.storage.from('media').upload(path, file, { upsert: true })
    const { data } = supabase.storage.from('media').getPublicUrl(path)
    await updateProfile({ avatar_url: data.publicUrl })
    setMessage('Avatar actualizado')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await updateProfile({
        full_name: fullName,
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        bio: bio || null,
        profile_type: profileType,
        location_name: locationName || null,
        ...(latitude && longitude ? { latitude, longitude } : {}),
      })
      setMessage('Perfil actualizado correctamente')
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Editar perfil</h1>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <label className="relative cursor-pointer">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-3xl font-bold">
              {fullName?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-1.5">
            <Camera size={16} />
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
        </label>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            placeholder="Cuéntanos sobre ti..."
            maxLength={300}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de perfil</label>
          <div className="space-y-2">
            {PROFILE_TYPES.map((pt) => (
              <label
                key={pt.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer ${
                  profileType === pt.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="profileType"
                  value={pt.value}
                  checked={profileType === pt.value}
                  onChange={(e) => setProfileType(e.target.value as ProfileType)}
                  className="accent-emerald-500"
                />
                <span className="text-sm font-medium">{pt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej: Madrid, España"
            />
            <button
              type="button"
              onClick={requestLocation}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              📍 GPS
            </button>
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-emerald-600'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
