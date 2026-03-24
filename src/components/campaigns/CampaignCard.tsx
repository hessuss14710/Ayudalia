import { Link } from 'react-router'
import { MapPin, Clock, AlertTriangle } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import type { Campaign } from '@/types'

function daysLeft(endDate: string | null): string | null {
  if (!endDate) return null
  const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Finalizada'
  if (days === 0) return 'Último día'
  return `${days} días restantes`
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const category = CATEGORIES.find((c) => c.id === campaign.category_id)
  const progress = campaign.goal_amount > 0
    ? Math.min(100, (Number(campaign.raised_amount) / Number(campaign.goal_amount)) * 100)
    : 0
  const remaining = daysLeft(campaign.end_date)

  return (
    <Link
      to={`/campaign/${campaign.id}`}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow no-underline"
    >
      {/* Image */}
      {campaign.image_url ? (
        <img src={campaign.image_url} alt="" loading="lazy" className="w-full h-48 object-contain bg-gray-100" />
      ) : (
        <div
          className="w-full h-48 flex items-center justify-center"
          style={{ backgroundColor: (category?.color ?? '#10B981') + '15' }}
        >
          <span className="text-5xl">🤝</span>
        </div>
      )}

      <div className="p-4">
        {/* Urgency badge */}
        {campaign.urgency !== 'normal' && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${
            campaign.urgency === 'critica'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            <AlertTriangle size={12} />
            {campaign.urgency === 'critica' ? 'Crítica' : 'Urgente'}
          </span>
        )}

        {/* Category */}
        {category && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: category.color + '20', color: category.color }}
          >
            {category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mt-2 text-base line-clamp-2">{campaign.title}</h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{campaign.description}</p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? '#10B981' : category?.color ?? '#10B981',
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className="text-base font-bold text-gray-900">
                {Number(campaign.raised_amount).toLocaleString('es-ES')} €
              </span>
              <span className="text-sm text-gray-500">
                {' '}recaudados de {Number(campaign.goal_amount).toLocaleString('es-ES')} €
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span className="font-medium">{campaign.donors_count} donaciones</span>
            {remaining && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {remaining}
              </span>
            )}
          </div>
        </div>

        {/* Author & location */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {campaign.author?.avatar_url ? (
              <img src={campaign.author.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                {campaign.author?.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <span className="text-sm text-gray-700">{campaign.author?.full_name ?? 'Usuario'}</span>
          </div>
          {campaign.location_name && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={12} /> {campaign.location_name}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
