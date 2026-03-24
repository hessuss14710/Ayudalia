import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { campaignId, campaignTitle, amount, donorId, message, isAnonymous } = req.body

    if (!campaignId || !amount || amount < 1) {
      return res.status(400).json({ error: 'Datos inválidos' })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Donación: ${campaignTitle}`,
              description: `Donación solidaria a través de Ayudalia`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/campaign/${campaignId}?donated=true`,
      cancel_url: `${req.headers.origin}/campaign/${campaignId}`,
      metadata: {
        campaign_id: campaignId,
        donor_id: donorId || '',
        message: message || '',
        is_anonymous: isAnonymous ? 'true' : 'false',
      },
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return res.status(500).json({ error: 'Error al crear la sesión de pago' })
  }
}
