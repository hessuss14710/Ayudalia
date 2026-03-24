import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { TrendingSidebar } from './TrendingSidebar'
import { Footer } from './Footer'
import { EmergencyBar } from './EmergencyBar'
import { GuestBanner } from '@/components/auth/GuestBanner'
import { useAuthStore } from '@/stores/authStore'
import { useMessages } from '@/hooks/useMessages'
import { useCampaigns } from '@/hooks/useCampaigns'

export function MainLayout() {
  const user = useAuthStore((s) => s.user)
  const { unreadCount } = useMessages()
  const { campaigns, fetchCampaigns } = useCampaigns()

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar unreadCount={unreadCount} />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <EmergencyBar campaigns={campaigns} />
        <div className="md:hidden">
          <Header unreadCount={unreadCount} />
        </div>
        {!user && <GuestBanner />}
        <main className="flex-1 w-full max-w-4xl mx-auto pb-20 md:pb-0">
          <Outlet />
        </main>
        <div className="hidden md:block">
          <Footer />
        </div>
        <BottomNav unreadCount={unreadCount} />
      </div>
      <TrendingSidebar />
    </div>
  )
}
