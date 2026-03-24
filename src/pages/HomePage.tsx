import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { usePosts } from '@/hooks/usePosts'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useMessages } from '@/hooks/useMessages'
import { PostCard } from '@/components/feed/PostCard'
import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { CategoryFilter } from '@/components/categories/CategoryFilter'
import { useFeedStore } from '@/stores/feedStore'
import { useAuthStore } from '@/stores/authStore'
import { CATEGORIES } from '@/lib/constants'
import { ImpactCounter } from '@/components/home/ImpactCounter'
import { HowToHelp } from '@/components/home/HowToHelp'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { TestimonialBanner } from '@/components/home/TestimonialBanner'
import { TrendingUp, ArrowRight, Heart, Users, Globe, Sparkles } from 'lucide-react'
import { PostSkeleton } from '@/components/ui/Skeleton'

export function HomePage() {
  const { posts, loading, fetchPosts, toggleLike } = usePosts()
  const { campaigns, fetchCampaigns } = useCampaigns()
  const { startConversation } = useMessages()
  const user = useAuthStore((s) => s.user)
  const filter = useFeedStore((s) => s.filter)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'feed' | 'ofertas' | 'solicitudes'>('feed')

  useEffect(() => {
    fetchPosts()
    fetchCampaigns()
  }, [fetchPosts, fetchCampaigns])

  async function handleContact(authorId: string) {
    try {
      const conversationId = await startConversation(authorId)
      navigate(`/messages/${conversationId}`)
    } catch {
      navigate('/auth')
    }
  }

  const filteredPosts = activeTab === 'feed'
    ? posts
    : posts.filter((p) => p.post_type === (activeTab === 'ofertas' ? 'oferta' : 'solicitud'))

  const featuredCampaigns = campaigns
    .sort((a, b) => b.donors_count - a.donors_count)
    .slice(0, 4)

  // Stats
  const totalPosts = posts.length
  const totalCampaigns = campaigns.length
  const totalRaised = campaigns.reduce((s, c) => s + Number(c.raised_amount), 0)
  const totalDonors = campaigns.reduce((s, c) => s + c.donors_count, 0)

  return (
    <div>
      {/* Hero section for guests */}
      {!user && (
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white px-6 py-10 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:gap-12">
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  Cambia una vida.<br />
                  <span className="text-emerald-200">Conecta con quien te necesita.</span>
                </h1>
                <p className="text-emerald-100 mt-4 text-base md:text-lg max-w-lg">
                  Ayudalia conecta a personas que necesitan ayuda con personas que quieren ayudar.
                  Desde donaciones económicas hasta compañía, empleo, vivienda, salud mental y mucho más.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link
                    to="/auth"
                    className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 no-underline"
                  >
                    Únete gratis
                  </Link>
                  <Link
                    to="/campaigns"
                    className="border-2 border-white/50 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 no-underline"
                  >
                    Ver campañas
                  </Link>
                </div>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4 mt-8 md:mt-0">
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                  <Heart className="mx-auto mb-2" size={28} />
                  <p className="text-2xl font-bold">{totalCampaigns}</p>
                  <p className="text-xs text-emerald-200">Campañas activas</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                  <TrendingUp className="mx-auto mb-2" size={28} />
                  <p className="text-2xl font-bold">{totalRaised.toLocaleString('es-ES')}€</p>
                  <p className="text-xs text-emerald-200">Recaudados</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                  <Users className="mx-auto mb-2" size={28} />
                  <p className="text-2xl font-bold">{posts.length}+</p>
                  <p className="text-xs text-emerald-200">Publicaciones</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                  <Globe className="mx-auto mb-2" size={28} />
                  <p className="text-2xl font-bold">{CATEGORIES.length}</p>
                  <p className="text-xs text-emerald-200">Categorías</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections for guests */}
      {!user && (
        <>
          <ImpactCounter
            totalPosts={totalPosts}
            totalCampaigns={totalCampaigns}
            totalRaised={totalRaised}
            totalDonors={totalDonors}
          />
          <HowToHelp />
          <CategoryShowcase />
        </>
      )}

      {/* Featured campaigns */}
      {featuredCampaigns.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="text-lg font-bold text-gray-900">Campañas destacadas</h2>
            </div>
            <Link to="/campaigns" className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 no-underline">
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      )}

      {/* Testimonial for guests */}
      {!user && <TestimonialBanner />}

      {/* Feed section */}
      <div className="px-4 md:px-6 pt-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-3 border-b border-gray-200">
          {[
            { key: 'feed', label: 'Todo' },
            { key: 'ofertas', label: 'Ofrecen ayuda' },
            { key: 'solicitudes', label: 'Necesitan ayuda' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <CategoryFilter />

        <div className="flex items-center gap-2 pb-3">
          {['all', 'local', 'global'].map((scope) => (
            <button
              key={scope}
              onClick={() => useFeedStore.getState().setFilter({ scope: scope as 'all' | 'local' | 'global' })}
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                filter.scope === scope ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {scope === 'all' ? 'Todos' : scope === 'local' ? 'Cerca de mí' : 'Global'}
            </button>
          ))}
        </div>
      </div>

      {/* Posts grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4 md:px-6 pb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <PostSkeleton />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 px-4">
          <span className="text-4xl">🌱</span>
          <h2 className="text-lg font-semibold text-gray-900 mt-3">Aún no hay publicaciones</h2>
          <p className="text-gray-500 text-sm mt-1">Sé el primero en publicar una oferta o solicitud de ayuda</p>
          {user && (
            <Link to="/create" className="inline-block mt-4 bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium no-underline">
              Crear publicación
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4 md:px-6 pb-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <PostCard
                post={post}
                onLike={toggleLike}
                onContact={handleContact}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
