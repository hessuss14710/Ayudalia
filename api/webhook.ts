import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const config = {
  api: { bodyParser: false },
}

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature'] as string
  const rawBody = await getRawBody(req)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { campaign_id, donor_id, message, is_anonymous } = session.metadata || {}
    const amount = (session.amount_total || 0) / 100

    if (campaign_id && amount > 0) {
      // Create donation record
      await supabase.from('donations').insert({
        campaign_id,
        donor_id: donor_id || null,
        amount,
        message: message || null,
        is_anonymous: is_anonymous === 'true',
      })

      // Update campaign totals
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('raised_amount, donors_count')
        .eq('id', campaign_id)
        .single()

      if (campaign) {
        await supabase
          .from('campaigns')
          .update({
            raised_amount: Number(campaign.raised_amount) + amount,
            donors_count: campaign.donors_count + 1,
          })
          .eq('id', campaign_id)
      }
    }
  }

  return res.status(200).json({ received: true })
}
