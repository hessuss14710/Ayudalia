import { BrowserRouter, Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layout/MainLayout'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { ToastContainer } from '@/components/ui/Toast'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Lazy load pages for code splitting
const ExplorePage = lazy(() => import('@/pages/ExplorePage').then(m => ({ default: m.ExplorePage })))
const CreatePostPage = lazy(() => import('@/pages/CreatePostPage').then(m => ({ default: m.CreatePostPage })))
const PostDetailPage = lazy(() => import('@/pages/PostDetailPage').then(m => ({ default: m.PostDetailPage })))
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const MessagesPage = lazy(() => import('@/pages/MessagesPage').then(m => ({ default: m.MessagesPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const AuthPage = lazy(() => import('@/pages/AuthPage').then(m => ({ default: m.AuthPage })))
const CampaignsPage = lazy(() => import('@/pages/CampaignsPage').then(m => ({ default: m.CampaignsPage })))
const CampaignDetailPage = lazy(() => import('@/pages/CampaignDetailPage').then(m => ({ default: m.CampaignDetailPage })))
const CreateCampaignPage = lazy(() => import('@/pages/CreateCampaignPage').then(m => ({ default: m.CreateCampaignPage })))
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import('@/pages/TermsPage').then(m => ({ default: m.TermsPage })))
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })))
const AdminPage = lazy(() => import('@/pages/AdminPage').then(m => ({ default: m.AdminPage })))

function PageLoader() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-5xl animate-bounce">🤝</span>
          <h1 className="text-2xl font-bold text-emerald-600 mt-3">Ayudalia</h1>
          <p className="text-gray-400 text-sm mt-1">Cargando...</p>
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>
    )
  }

  return (
    <>
      <ScrollToTop />
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="create" element={<CreatePostPage />} />
            <Route path="post/:id" element={<PostDetailPage />} />
            <Route path="profile/:id" element={<ProfilePage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="messages/:conversationId" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="campaign/:id" element={<CampaignDetailPage />} />
            <Route path="campaigns/create" element={<CreateCampaignPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
