import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { TrendingUp, Flame, Users, Heart, Newspaper, RefreshCw } from 'lucide-react'
import { usePosts } from '@/hooks/usePosts'
import { useCampaigns } from '@/hooks/useCampaigns'
import { CATEGORIES } from '@/lib/constants'

interface NewsItem {
  id: string
  category: string
  title: string
  subtitle: string
  url?: string
}

const CURATED_NEWS: NewsItem[] = [
  {
    id: 'n1',
    category: 'Solidaridad',
    title: 'Crece la red de voluntarios en España',
    subtitle: 'Más de 50.000 nuevos voluntarios se suman a iniciativas sociales este trimestre',
  },
  {
    id: 'n2',
    category: 'Salud Mental',
    title: 'Aumentan los recursos de apoyo psicológico gratuito',
    subtitle: 'Nuevas líneas de atención y programas comunitarios disponibles',
  },
  {
    id: 'n3',
    category: 'Vivienda',
    title: 'Nuevas ayudas al alquiler para familias vulnerables',
    subtitle: 'El gobierno amplía el bono social de vivienda',
  },
  {
    id: 'n4',
    category: 'Empleo',
    title: 'Programas de inserción laboral alcanzan récord',
    subtitle: 'Miles de personas encuentran empleo a través de plataformas solidarias',
  },
  {
    id: 'n5',
    category: 'Educación',
    title: 'Becas y ayudas educativas: guía actualizada',
    subtitle: 'Todo lo que necesitas saber sobre las convocatorias abiertas',
  },
  {
    id: 'n6',
    category: 'Alimentación',
    title: 'Los bancos de alimentos necesitan más donaciones',
    subtitle: 'La demanda crece un 15% respecto al año anterior',
  },
]

export function TrendingSidebar() {
  const { posts } = usePosts()
  const { campaigns } = useCampaigns()
  const [newsRotation, setNewsRotation] = useState(0)

  // Rotate news every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNewsRotation((prev) => (prev + 1) % 3)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Get trending categories based on post count
  const categoryStats = CATEGORIES.map((cat) => ({
    ...cat,
    count: posts.filter((p) => p.category_id === cat.id).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Get top campaigns
  const topCampaigns = [...campaigns]
    .sort((a, b) => b.donors_count - a.donors_count)
    .slice(0, 3)

  // Get most liked posts
  const popularPosts = [...posts]
    .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
    .slice(0, 3)

  // Select which news to show based on rotation
  const visibleNews = CURATED_NEWS.slice(newsRotation * 2, newsRotation * 2 + 3)
  const fallbackNews = visibleNews.length < 3 ? CURATED_NEWS.slice(0, 3) : visibleNews

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 overflow-y-auto border-l border-gray-200 bg-white p-4 gap-4">
      {/* Search placeholder */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar en Ayudalia"
          className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 border border-transparent focus:border-emerald-300 focus:bg-white focus:outline-none transition-colors"
          readOnly
          onClick={() => window.location.href = '/explore'}
        />
      </div>

      {/* Noticias de actualidad */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Newspaper size={18} className="text-emerald-500" />
            Actualidad
          </h3>
          <RefreshCw
            size={14}
            className="text-gray-400 cursor-pointer hover:text-emerald-500 transition-colors"
            onClick={() => setNewsRotation((prev) => (prev + 1) % 3)}
          />
        </div>
        {fallbackNews.map((news) => (
          <div
            key={news.id}
            className="px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <p className="text-xs text-gray-500 font-medium">{news.category}</p>
            <p className="text-sm font-bold text-gray-900 leading-snug mt-0.5">{news.title}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{news.subtitle}</p>
          </div>
        ))}
        <div className="px-4 py-3">
          <Link to="/explore" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium no-underline">
            Mostrar más
          </Link>
        </div>
      </div>

      {/* Tendencias en la comunidad */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden">
        <h3 className="text-lg font-bold text-gray-900 px-4 pt-3 pb-2 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-500" />
          Tendencias
        </h3>
        {categoryStats.length > 0 ? (
          categoryStats.map((cat, index) => (
            <div
              key={cat.id}
              className="px-4 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">Tendencia #{index + 1}</p>
                  <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.count} publicaciones</p>
                </div>
                {index === 0 && <Flame size={16} className="text-orange-400 mt-1" />}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-sm text-gray-500">
            Las tendencias aparecerán cuando haya más actividad
          </div>
        )}
      </div>

      {/* Campañas populares */}
      {topCampaigns.length > 0 && (
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 px-4 pt-3 pb-2 flex items-center gap-2">
            <Heart size={18} className="text-rose-500" />
            Campañas destacadas
          </h3>
          {topCampaigns.map((campaign) => {
            const progress = campaign.goal_amount > 0
              ? Math.min((Number(campaign.raised_amount) / Number(campaign.goal_amount)) * 100, 100)
              : 0
            return (
              <Link
                key={campaign.id}
                to={`/campaigns/${campaign.id}`}
                className="block px-4 py-3 hover:bg-gray-100 transition-colors no-underline border-b border-gray-100 last:border-b-0"
              >
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{campaign.title}</p>
                <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-emerald-600 font-medium">
                    {Number(campaign.raised_amount).toLocaleString('es-ES')}€
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Users size={12} /> {campaign.donors_count} donantes
                  </span>
                </div>
              </Link>
            )
          })}
          <div className="px-4 py-3">
            <Link to="/campaigns" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium no-underline">
              Ver todas las campañas
            </Link>
          </div>
        </div>
      )}

      {/* Posts populares */}
      {popularPosts.length > 0 && (
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 px-4 pt-3 pb-2 flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            Publicaciones populares
          </h3>
          {popularPosts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="block px-4 py-3 hover:bg-gray-100 transition-colors no-underline border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 line-clamp-2">{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      post.post_type === 'oferta'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {post.post_type === 'oferta' ? 'Oferta' : 'Solicitud'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Heart size={12} /> {post.likes_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <div className="px-4 py-3">
            <Link to="/explore" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium no-underline">
              Explorar más
            </Link>
          </div>
        </div>
      )}

      {/* Footer links */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
          <Link to="/about" className="hover:text-gray-600 no-underline text-gray-400">Sobre nosotros</Link>
          <Link to="/privacy" className="hover:text-gray-600 no-underline text-gray-400">Privacidad</Link>
          <Link to="/terms" className="hover:text-gray-600 no-underline text-gray-400">Términos</Link>
          <Link to="/contact" className="hover:text-gray-600 no-underline text-gray-400">Contacto</Link>
        </div>
        <p className="text-xs text-gray-300 mt-2">© 2026 Ayudalia</p>
      </div>
    </aside>
  )
}
