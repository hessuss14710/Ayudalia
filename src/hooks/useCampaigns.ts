import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Campaign, Donation } from '@/types'

export function useCampaigns() {
  const user = useAuthStore((s) => s.user)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCampaigns = useCallback(async (categoryId?: number) => {
    setLoading(true)
    try {
      let query = supabase
        .from('campaigns')
        .select('*, author:profiles!campaigns_author_id_fkey(*)')
        .eq('status', 'activa')
        .order('created_at', { ascending: false })

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error fetching campaigns:', error)
        return
      }
      setCampaigns((data ?? []) as Campaign[])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCampaign = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*, author:profiles!campaigns_author_id_fkey(*)')
      .eq('id', id)
      .single()
    if (error) {
      console.error('Error fetching campaign:', error)
      return null
    }
    return data as Campaign
  }, [])

  const createCampaign = useCallback(async (data: {
    title: string
    description: string
    category_id: number
    goal_amount: number
    image_url?: string
    location_name?: string
    urgency?: string
    end_date?: string
  }) => {
    if (!user) throw new Error('Debes iniciar sesión')
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({ ...data, author_id: user.id })
      .select('*, author:profiles!campaigns_author_id_fkey(*)')
      .single()
    if (error) {
      console.error('Error creating campaign:', error)
      throw error
    }
    if (campaign) setCampaigns((prev) => [campaign as Campaign, ...prev])
    return campaign
  }, [user])

  const donate = useCallback(async (campaignId: string, amount: number, message?: string, isAnonymous = false) => {
    if (!user) throw new Error('Debes iniciar sesión')
    const { error: donationError } = await supabase
      .from('donations')
      .insert({
        campaign_id: campaignId,
        donor_id: user.id,
        amount,
        message: message || null,
        is_anonymous: isAnonymous,
      })
    if (donationError) {
      console.error('Error donating:', donationError)
      throw donationError
    }

    // Update campaign raised amount and donors count
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (campaign) {
      const newRaised = Number(campaign.raised_amount) + amount
      const newDonors = campaign.donors_count + 1
      await supabase
        .from('campaigns')
        .update({ raised_amount: newRaised, donors_count: newDonors })
        .eq('id', campaignId)
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId
            ? { ...c, raised_amount: newRaised, donors_count: newDonors }
            : c
        )
      )
    }
  }, [user, campaigns])

  const fetchDonations = useCallback(async (campaignId: string) => {
    const { data, error } = await supabase
      .from('donations')
      .select('*, donor:profiles(*)')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching donations:', error)
      return []
    }
    return (data ?? []) as Donation[]
  }, [])

  return { campaigns, loading, fetchCampaigns, fetchCampaign, createCampaign, donate, fetchDonations }
}
