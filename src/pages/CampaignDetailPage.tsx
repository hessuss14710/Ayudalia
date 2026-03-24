import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useAuthStore } from '@/stores/authStore'
import { CATEGORIES } from '@/lib/constants'
import { ArrowLeft, MapPin, Clock, AlertTriangle, Heart, Share2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import type { Campaign, Donation } from '@/types'

function daysLeft(endDate: string | null): string | null {
  if (!endDate) return null
  const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Finalizada'
  if (days === 0) return 'Último día'
  return `${days} días restantes`
}

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { fetchCampaign, fetchDonations } = useCampaigns()
  const toast = useToast((s) => s.add)

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [showDonateForm, setShowDonateForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [donating, setDonating] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([fetchCampaign(id), fetchDonations(id)]).then(([c, d]) => {
      if (c) setCampaign(c)
      setDonations(d)
      setLoading(false)
    })
  }, [id])

  // Check if returning from successful Stripe payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('donated') === 'true' && id) {
      setSuccess('¡Gracias por tu donación! El pago se ha procesado correctamente.')
      // Clean URL
      window.history.replaceState({}, '', `/campaign/${id}`)
      // Refresh data
      Promise.all([fetchCampaign(id), fetchDonations(id)]).then(([c, d]) => {
        if (c) setCampaign(c)
        setDonations(d)
      })
    }
  }, [id])

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault()
    if (!id || !amount || !campaign) return
    setDonating(true)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: id,
          campaignTitle: campaign.title,
          amount: parseFloat(amount),
          donorId: user?.id || null,
          message: message || '',
          isAnonymous: anonymous,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Error al procesar el pago')
      }
    } catch (err) {
      console.error(err)
      setDonating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!campaign) {
    return <div className="text-center py-12 text-gray-500">Campaña no encontrada</div>
  }

  const category = CATEGORIES.find((c) => c.id === campaign.category_id)
  const progress = campaign.goal_amount > 0
    ? Math.min(100, (Number(campaign.raised_amount) / Number(campaign.goal_amount)) * 100)
    : 0
  const remaining = daysLeft(campaign.end_date)

  return (
    <div>
      {/* Header */}
      <div className="sticky top-14 md:top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-gray-900 truncate">Campaña</h1>
        <button
          onClick={() => {
            const url = `${window.location.origin}/campaign/${campaign.id}`
            if (navigator.share) {
              navigator.share({ title: campaign.title, text: campaign.description.slice(0, 100), url })
            } else {
              navigator.clipboard.writeText(url)
              toast('Enlace copiado')
            }
          }}
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Image */}
      {campaign.image_url ? (
        <img src={campaign.image_url} alt="" className="w-full max-h-96 object-contain bg-gray-100" />
      ) : (
        <div
          className="w-full h-56 flex items-center justify-center"
          style={{ backgroundColor: (category?.color ?? '#10B981') + '15' }}
        >
          <span className="text-6xl">🤝</span>
        </div>
      )}

      <div className="p-4">
        {/* Urgency */}
        {campaign.urgency !== 'normal' && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${
            campaign.urgency === 'critica' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <AlertTriangle size={12} />
            {campaign.urgency === 'critica' ? 'Situación crítica' : 'Urgente'}
          </span>
        )}

        {/* Category */}
        {category && (
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: category.color + '20', color: category.color }}
          >
            {category.name}
          </span>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mt-3">{campaign.title}</h2>

        {/* Author */}
        <Link to={`/profile/${campaign.author_id}`} className="flex items-center gap-2 mt-3 no-underline">
          {campaign.author?.avatar_url ? (
            <img src={campaign.author.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
              {campaign.author?.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">{campaign.author?.full_name}</span>
        </Link>

        {/* Progress */}
        <div className="mt-4 bg-gray-50 rounded-xl p-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all"
              style={{
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? '#10B981' : category?.color ?? '#10B981',
              }}
            />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-900">
              {Number(campaign.raised_amount).toLocaleString('es-ES')} €
            </span>
            <span className="text-gray-500">
              {' '}recaudados de {Number(campaign.goal_amount).toLocaleString('es-ES')} €
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span><strong className="text-gray-700">{campaign.donors_count}</strong> donaciones</span>
            {remaining && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> {remaining}
              </span>
            )}
            {campaign.location_name && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {campaign.location_name}
              </span>
            )}
          </div>
        </div>

        {/* Donate button */}
        {user && campaign.status === 'activa' && (
          <button
            onClick={() => setShowDonateForm(!showDonateForm)}
            className="w-full mt-4 bg-emerald-500 text-white py-3 rounded-xl font-semibold text-base hover:bg-emerald-600 flex items-center justify-center gap-2"
          >
            <Heart size={20} /> Donar ahora
          </button>
        )}

        {!user && (
          <Link
            to="/auth"
            className="block w-full mt-4 bg-emerald-500 text-white py-3 rounded-xl font-semibold text-base text-center no-underline hover:bg-emerald-600"
          >
            Inicia sesión para donar
          </Link>
        )}

        {success && (
          <div className="mt-3 bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm font-medium text-center">
            {success}
          </div>
        )}

        {/* Donate form */}
        {showDonateForm && (
          <form onSubmit={handleDonate} className="mt-4 bg-gray-50 rounded-xl p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad (€)</label>
              <div className="flex gap-2 mb-2">
                {[5, 10, 25, 50, 100].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(String(v))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      amount === String(v) ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    {v} €
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Otra cantidad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje (opcional)</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ánimo, mucha fuerza..."
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="accent-emerald-500"
              />
              Donar de forma anónima
            </label>

            <button
              type="submit"
              disabled={donating || !amount}
              className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50"
            >
              {donating ? 'Procesando...' : `Donar ${amount ? amount + ' €' : ''}`}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Pago seguro procesado por Stripe. Tu información bancaria nunca se almacena en Ayudalia.
            </p>
          </form>
        )}

        {/* Description */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{campaign.description}</p>
        </div>

        {/* Donations list */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Donaciones ({donations.length})
          </h3>
          {donations.length === 0 ? (
            <p className="text-gray-400 text-sm">Sé el primero en donar</p>
          ) : (
            <div className="space-y-3">
              {donations.map((d) => (
                <div key={d.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  {d.is_anonymous ? (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">?</div>
                  ) : d.donor?.avatar_url ? (
                    <img src={d.donor.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-semibold">
                      {d.donor?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {d.is_anonymous ? 'Anónimo' : d.donor?.full_name ?? 'Usuario'}
                      </span>
                      <span className="text-sm font-bold text-emerald-600">{Number(d.amount).toLocaleString('es-ES')} €</span>
                    </div>
                    {d.message && <p className="text-sm text-gray-500 mt-0.5">{d.message}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(d.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
