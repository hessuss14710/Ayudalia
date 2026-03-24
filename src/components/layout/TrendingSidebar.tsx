import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { TrendingUp, Flame, Users, Heart, Newspaper, RefreshCw, Search, MessageCircle, Repeat2, BarChart3, Clock } from 'lucide-react'
import { usePosts } from '@/hooks/usePosts'
import { useCampaigns } from '@/hooks/useCampaigns'
import { CATEGORIES } from '@/lib/constants'

interface NewsItem {
  id: string
  category: string
  title: string
  subtitle: string
  timeAgo: string
  source: string
  comments?: number
}

const CURATED_NEWS: NewsItem[] = [
  {
    id: 'n1',
    category: 'Solidaridad',
    title: 'Crece la red de voluntarios en España: más de 50.000 nuevos este trimestre',
    subtitle: 'Organizaciones sociales reportan un aumento sin precedentes en la participación ciudadana',
    timeAgo: 'Hace 2h',
    source: 'Ayudalia Noticias',
    comments: 234,
  },
  {
    id: 'n2',
    category: 'Salud Mental',
    title: 'El Gobierno amplía la red de atención psicológica gratuita en centros de salud',
    subtitle: 'Nuevas líneas de atención 24h y programas comunitarios ya disponibles en todas las CCAA',
    timeAgo: 'Hace 3h',
    source: 'Bienestar Social',
    comments: 189,
  },
  {
    id: 'n3',
    category: 'Vivienda',
    title: 'Nuevas ayudas al alquiler: hasta 600€/mes para familias vulnerables',
    subtitle: 'Se amplía el bono social de vivienda y se eliminan requisitos burocráticos',
    timeAgo: 'Hace 4h',
    source: 'Política Social',
    comments: 456,
  },
  {
    id: 'n4',
    category: 'Empleo',
    title: 'Programas de inserción laboral alcanzan récord: 15.000 empleos en marzo',
    subtitle: 'Las plataformas solidarias se consolidan como puente entre empresas y personas en riesgo de exclusión',
    timeAgo: 'Hace 5h',
    source: 'Empleo y Sociedad',
    comments: 312,
  },
  {
    id: 'n5',
    category: 'Educación',
    title: 'Convocatoria abierta: 20.000 becas para formación profesional',
    subtitle: 'Plazo hasta el 15 de abril para solicitar ayudas de hasta 3.000€ anuales',
    timeAgo: 'Hace 6h',
    source: 'Educación Hoy',
    comments: 178,
  },
  {
    id: 'n6',
    category: 'Alimentación',
    title: 'Los bancos de alimentos lanzan campaña de emergencia: la demanda sube un 15%',
    subtitle: 'Se necesitan 2 millones de kilos de alimentos para cubrir la demanda del próximo trimestre',
    timeAgo: 'Hace 7h',
    source: 'Solidaridad',
    comments: 523,
  },
  {
    id: 'n7',
    category: 'Tecnología Social',
    title: 'Apps solidarias: cómo la tecnología está transformando la ayuda social en España',
    subtitle: 'Plataformas como Ayudalia conectan a miles de personas cada día',
    timeAgo: 'Hace 8h',
    source: 'Tech & Social',
    comments: 145,
  },
  {
    id: 'n8',
    category: 'Voluntariado',
    title: 'España, líder europeo en voluntariado juvenil por tercer año consecutivo',
    subtitle: 'Más de 200.000 jóvenes participan activamente en programas de ayuda comunitaria',
    timeAgo: 'Hace 10h',
    source: 'Europa Social',
    comments: 267,
  },
]

export function TrendingSidebar() {
  const { posts } = usePosts()
  const { campaigns } = useCampaigns()
  const [newsPage, setNewsPage] = useState(0)
  const newsPerPage = 4
  const totalPages = Math.ceil(CURATED_NEWS.length / newsPerPage)

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsPage((prev) => (prev + 1) % totalPages)
    }, 45000)
    return () => clearInterval(interval)
  }, [totalPages])

  const categoryStats = CATEGORIES.map((cat) => ({
    ...cat,
    count: posts.filter((p) => p.category_id === cat.id).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const topCampaigns = [...campaigns]
    .sort((a, b) => b.donors_count - a.donors_count)
    .slice(0, 3)

  const popularPosts = [...posts]
    .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
    .slice(0, 4)

  const visibleNews = CURATED_NEWS.slice(newsPage * newsPerPage, newsPage * newsPerPage + newsPerPage)

  return (
    <aside className="hidden lg:flex flex-col w-[350px] shrink-0 h-screen sticky top-0 overflow-y-auto border-l border-gray-200 bg-white">
      {/* Search */}
      <div className="p-3 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en Ayudalia"
            className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 border border-transparent focus:border-emerald-400 focus:bg-white focus:outline-none transition-all"
            readOnly
            onClick={() => window.location.href = '/explore'}
          />
        </div>
      </div>

      {/* Qué está pasando - Estilo X */}
      <div className="bg-gray-50 mx-3 rounded-2xl overflow-hidden mb-3">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <h3 className="text-xl font-extrabold text-gray-900">Qué está pasando</h3>
          <RefreshCw
            size={16}
            className="text-gray-400 cursor-pointer hover:text-emerald-500 transition-colors"
            onClick={() => setNewsPage((prev) => (prev + 1) % totalPages)}
          />
        </div>

        {visibleNews.map((news, i) => (
          <div
            key={news.id}
            className="px-4 py-3 hover:bg-gray-100/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="font-medium text-emerald-600">{news.category}</span>
              <span>·</span>
              <Clock size={12} />
              <span>{news.timeAgo}</span>
            </div>
            <p className="text-[15px] font-bold text-gray-900 leading-snug mt-1">{news.title}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{news.subtitle}</p>
            <div className="flex items-center gap-4 mt-2 text-gray-400">
              <span className="flex items-center gap-1 text-xs hover:text-emerald-500 transition-colors">
                <MessageCircle size={14} /> {news.comments}
              </span>
              <span className="flex items-center gap-1 text-xs hover:text-emerald-500 transition-colors">
                <Repeat2 size={14} /> Compartir
              </span>
              <span className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors">
                <Heart size={14} />
              </span>
              <span className="flex items-center gap-1 text-xs hover:text-emerald-500 transition-colors">
                <BarChart3 size={14} />
              </span>
            </div>
            {i < visibleNews.length - 1 && <div className="border-b border-gray-100 mt-3" />}
          </div>
        ))}

        <div className="px-4 py-3">
          <button
            onClick={() => setNewsPage((prev) => (prev + 1) % totalPages)}
            className="text-sm text-emerald-500 hover:text-emerald-600 font-medium"
          >
            Mostrar más
          </button>
        </div>
      </div>

      {/* Tendencias */}
      <div className="bg-gray-50 mx-3 rounded-2xl overflow-hidden mb-3">
        <h3 className="text-xl font-extrabold text-gray-900 px-4 pt-3 pb-1">Tendencias</h3>
        {categoryStats.length > 0 ? (
          categoryStats.map((cat, index) => (
            <div
              key={cat.id}
              className="px-4 py-2.5 hover:bg-gray-100/80 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">Tendencia en Ayudalia</p>
                  <p className="text-[15px] font-bold text-gray-900 mt-0.5">#{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.count} publicaciones</p>
                </div>
                {index === 0 && <Flame size={18} className="text-orange-400 mt-1" />}
              </div>
            </div>
          ))
        ) : (
          <>
            {['#AyudaEconómica', '#Empleo', '#Compañía', '#SaludMental', '#Vivienda'].map((tag, i) => (
              <div key={tag} className="px-4 py-2.5 hover:bg-gray-100/80 transition-colors cursor-pointer">
                <p className="text-xs text-gray-500">Tendencia #{i + 1} en Ayudalia</p>
                <p className="text-[15px] font-bold text-gray-900 mt-0.5">{tag}</p>
                <p className="text-xs text-gray-500 mt-0.5">Tema de interés social</p>
              </div>
            ))}
          </>
        )}
        <div className="px-4 py-3">
          <Link to="/explore" className="text-sm text-emerald-500 hover:text-emerald-600 font-medium no-underline">
            Mostrar más
          </Link>
        </div>
      </div>

      {/* Campañas populares */}
      {topCampaigns.length > 0 && (
        <div className="bg-gray-50 mx-3 rounded-2xl overflow-hidden mb-3">
          <h3 className="text-xl font-extrabold text-gray-900 px-4 pt-3 pb-1 flex items-center gap-2">
            <Heart size={20} className="text-rose-500" />
            Campañas activas
          </h3>
          {topCampaigns.map((campaign) => {
            const progress = campaign.goal_amount > 0
              ? Math.min((Number(campaign.raised_amount) / Number(campaign.goal_amount)) * 100, 100)
              : 0
            return (
              <Link
                key={campaign.id}
                to={`/campaigns/${campaign.id}`}
                className="block px-4 py-3 hover:bg-gray-100/80 transition-colors no-underline"
              >
                <p className="text-[15px] font-bold text-gray-900 line-clamp-2">{campaign.title}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm text-emerald-600 font-bold">
                    {Number(campaign.raised_amount).toLocaleString('es-ES')}€
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Users size={13} /> {campaign.donors_count} donantes
                  </span>
                </div>
              </Link>
            )
          })}
          <div className="px-4 py-3">
            <Link to="/campaigns" className="text-sm text-emerald-500 hover:text-emerald-600 font-medium no-underline">
              Ver todas
            </Link>
          </div>
        </div>
      )}

      {/* Publicaciones populares - estilo X timeline */}
      {popularPosts.length > 0 && (
        <div className="bg-gray-50 mx-3 rounded-2xl overflow-hidden mb-3">
          <h3 className="text-xl font-extrabold text-gray-900 px-4 pt-3 pb-1 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Popular ahora
          </h3>
          {popularPosts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="block px-4 py-3 hover:bg-gray-100/80 transition-colors no-underline"
            >
              <div className="flex items-center gap-2 mb-1">
                {post.profiles?.avatar_url ? (
                  <img src={post.profiles.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                    {post.profiles?.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <span className="text-xs text-gray-500 font-medium truncate">
                  {post.profiles?.full_name ?? 'Usuario'}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  post.post_type === 'oferta'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {post.post_type === 'oferta' ? 'Ofrece' : 'Necesita'}
                </span>
              </div>
              <p className="text-[15px] font-bold text-gray-900 line-clamp-2 leading-snug">{post.title}</p>
              {post.body && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.body}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-gray-400">
                <span className="flex items-center gap-1 text-xs">
                  <MessageCircle size={13} /> {post.comments_count || 0}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Heart size={13} className={post.likes_count ? 'text-red-400' : ''} /> {post.likes_count || 0}
                </span>
              </div>
            </Link>
          ))}
          <div className="px-4 py-3">
            <Link to="/explore" className="text-sm text-emerald-500 hover:text-emerald-600 font-medium no-underline">
              Explorar más
            </Link>
          </div>
        </div>
      )}

      {/* Footer links estilo X */}
      <div className="px-6 py-4 mt-auto">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400">
          <Link to="/about" className="hover:underline no-underline text-gray-400">Sobre nosotros</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:underline no-underline text-gray-400">Privacidad</Link>
          <span>·</span>
          <Link to="/terms" className="hover:underline no-underline text-gray-400">Términos</Link>
          <span>·</span>
          <Link to="/contact" className="hover:underline no-underline text-gray-400">Contacto</Link>
        </div>
        <p className="text-xs text-gray-300 mt-1">© 2026 Ayudalia</p>
      </div>
    </aside>
  )
}
