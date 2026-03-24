export type ProfileType = 'oferente' | 'demandante' | 'ambos'
export type PostType = 'oferta' | 'solicitud'
export type PostStatus = 'activo' | 'resuelto' | 'cerrado'
export type Scope = 'local' | 'global'
export type CampaignStatus = 'activa' | 'completada' | 'cerrada'
export type Urgency = 'normal' | 'urgente' | 'critica'

export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  profile_type: ProfileType
  is_admin: boolean
  location_name: string | null
  latitude: number | null
  longitude: number | null
  created_at: string
}

export interface Category {
  id: number
  slug: string
  name: string
  icon: string
  color: string
}

export interface Post {
  id: string
  author_id: string
  post_type: PostType
  category_id: number
  title: string
  body: string
  media_urls: string[]
  location_name: string | null
  latitude: number | null
  longitude: number | null
  scope: Scope
  status: PostStatus
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  author?: Profile
  category?: Category
  user_has_liked?: boolean
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  body: string
  created_at: string
  author?: Profile
}

export interface Conversation {
  id: string
  participant_1: string
  participant_2: string
  last_message_at: string
  created_at: string
  other_user?: Profile
  last_message?: Message
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  attachment_url: string | null
  attachment_type: string | null
  attachment_name: string | null
  is_read: boolean
  created_at: string
}

export interface Campaign {
  id: string
  author_id: string
  category_id: number
  title: string
  description: string
  goal_amount: number
  raised_amount: number
  currency: string
  image_url: string | null
  status: CampaignStatus
  donors_count: number
  location_name: string | null
  urgency: Urgency
  emergency_approved: boolean
  end_date: string | null
  created_at: string
  updated_at: string
  author?: Profile
  category?: Category
}

export interface Donation {
  id: string
  campaign_id: string
  donor_id: string | null
  amount: number
  message: string | null
  is_anonymous: boolean
  created_at: string
  donor?: Profile
}
