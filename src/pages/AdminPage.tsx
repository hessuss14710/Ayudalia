import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft, ShieldCheck, AlertTriangle, Check, X } from 'lucide-react'
import type { Campaign } from '@/types'

export function AdminPage() {
  const navigate = useNavigate()
  const profile = useAuthStore((s) => s.profile)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile && !profile.is_admin) {
      navigate('/')
      return
    }
    fetchCriticalCampaigns()
  }, [profile])

  async function fetchCriticalCampaigns() {
    setLoading(true)
    const { data } = await supabase
      .from('campaigns')
      .select('*, author:profiles!campaigns_author_id_fkey(*)')
      .eq('urgency', 'critica')
      .eq('status', 'activa')
      .order('created_at', { ascending: false })
    if (data) setCampaigns(data as Campaign[])
    setLoading(false)
  }

  async function toggleApproval(campaignId: string, approved: boolean) {
    await supabase
      .from('campaigns')
      .update({ emergency_approved: approved })
      .eq('id', campaignId)
    setCampaigns((prev) =>
      prev.map((c) => c.id === campaignId ? { ...c, emergency_approved: approved } : c)
    )
  }

  if (!profile?.is_admin) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">No tienes permisos de administrador.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="sticky top-14 md:top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <ShieldCheck size={20} className="text-emerald-600" />
        <h1 className="font-semibold text-gray-900">Panel de Administración</h1>
      </div>

      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <h2 className="font-bold text-red-800">Emergencias pendientes de aprobación</h2>
          </div>
          <p className="text-sm text-red-700">
            Solo aprueba emergencias con peligro de muerte inminente. La barra roja se mostrará a todos los usuarios.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl">✅</span>
            <p className="text-gray-500 mt-3">No hay campañas críticas activas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={`border rounded-xl p-4 ${
                  campaign.emergency_approved
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        CRÍTICA
                      </span>
                      {campaign.emergency_approved && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          APROBADA
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Por: {campaign.author?.full_name ?? 'Desconocido'} · {new Date(campaign.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {campaign.emergency_approved ? (
                      <button
                        onClick={() => toggleApproval(campaign.id, false)}
                        className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600"
                      >
                        <X size={16} /> Revocar
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleApproval(campaign.id, true)}
                        className="flex items-center gap-1.5 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600"
                      >
                        <Check size={16} /> Aprobar emergencia
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
