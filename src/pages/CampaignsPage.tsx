import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useCampaigns } from '@/hooks/useCampaigns'
import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { CATEGORIES } from '@/lib/constants'
import { useAuthStore } from '@/stores/authStore'
import { Plus, TrendingUp, AlertTriangle, Clock } from 'lucide-react'

export function CampaignsPage() {
  const { campaigns, loading, fetchCampaigns } = useCampaigns()
  const user = useAuthStore((s) => s.user)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'urgent' | 'popular'>('recent')

  useEffect(() => {
    fetchCampaigns(selectedCategory ?? undefined)
  }, [selectedCategory, fetchCampaigns])

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (sortBy === 'urgent') {
      const urgencyOrder = { critica: 0, urgente: 1, normal: 2 }
      return (urgencyOrder[a.urgency] ?? 2) - (urgencyOrder[b.urgency] ?? 2)
    }
    if (sortBy === 'popular') {
      return b.donors_count - a.donors_count
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  // Stats
  const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.raised_amount), 0)
  const totalDonors = campaigns.reduce((sum, c) => sum + c.donors_count, 0)
  const activeCampaigns = campaigns.length

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6">
        <h1 className="text-2xl font-bold">Campañas solidarias</h1>
        <p className="text-emerald-100 text-sm mt-1">
          Dona, comparte o crea tu propia campaña para ayudar a quien lo necesita
        </p>
        <div className="flex gap-4 mt-4">
          <div>
            <p className="text-2xl font-bold">{totalRaised.toLocaleString('es-ES')} €</p>
            <p className="text-xs text-emerald-200">Recaudados</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalDonors}</p>
            <p className="text-xs text-emerald-200">Donaciones</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{activeCampaigns}</p>
            <p className="text-xs text-emerald-200">Campañas activas</p>
          </div>
        </div>
        {user && (
          <Link
            to="/campaigns/create"
            className="inline-flex items-center gap-2 mt-4 bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-50 no-underline"
          >
            <Plus size={18} /> Crear campaña
          </Link>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 py-3 px-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium ${
            selectedCategory === null ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Todas
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium ${
              selectedCategory === cat.id ? 'text-white' : 'bg-gray-100 text-gray-700'
            }`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color } : undefined}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2 px-4 py-2 bg-white">
        <button
          onClick={() => setSortBy('recent')}
          className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${
            sortBy === 'recent' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Clock size={14} /> Recientes
        </button>
        <button
          onClick={() => setSortBy('urgent')}
          className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${
            sortBy === 'urgent' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <AlertTriangle size={14} /> Urgentes
        </button>
        <button
          onClick={() => setSortBy('popular')}
          className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${
            sortBy === 'popular' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <TrendingUp size={14} /> Populares
        </button>
      </div>

      {/* Campaigns grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sortedCampaigns.length === 0 ? (
        <div className="text-center py-12 px-4">
          <span className="text-4xl">💚</span>
          <h2 className="text-lg font-semibold text-gray-900 mt-3">Aún no hay campañas</h2>
          <p className="text-gray-500 text-sm mt-1">Sé el primero en crear una campaña solidaria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6">
          {sortedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  )
}
