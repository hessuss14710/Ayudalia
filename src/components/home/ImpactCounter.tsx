import { useEffect, useState } from 'react'
import { Heart, Users, HandHeart, Globe } from 'lucide-react'

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

function AnimatedNumber({ end, duration = 2000, suffix = '', prefix = '' }: CounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (end === 0) return
    const steps = 60
    const increment = end / steps
    const stepTime = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [end, duration])

  return (
    <span>
      {prefix}{count.toLocaleString('es-ES')}{suffix}
    </span>
  )
}

interface ImpactCounterProps {
  totalPosts: number
  totalCampaigns: number
  totalRaised: number
  totalDonors: number
}

export function ImpactCounter({ totalPosts, totalCampaigns, totalRaised, totalDonors }: ImpactCounterProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-lg font-semibold text-gray-400 uppercase tracking-wider mb-8">
          Nuestro impacto juntos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-emerald-500/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <HandHeart size={28} className="text-emerald-400" />
            </div>
            <p className="text-3xl md:text-4xl font-bold">
              <AnimatedNumber end={totalPosts} suffix="+" />
            </p>
            <p className="text-sm text-gray-400 mt-1">Ayudas publicadas</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-500/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart size={28} className="text-blue-400" />
            </div>
            <p className="text-3xl md:text-4xl font-bold">
              <AnimatedNumber end={totalCampaigns} />
            </p>
            <p className="text-sm text-gray-400 mt-1">Campañas activas</p>
          </div>
          <div className="text-center">
            <div className="bg-amber-500/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe size={28} className="text-amber-400" />
            </div>
            <p className="text-3xl md:text-4xl font-bold">
              <AnimatedNumber end={totalRaised} suffix="€" />
            </p>
            <p className="text-sm text-gray-400 mt-1">Recaudados</p>
          </div>
          <div className="text-center">
            <div className="bg-pink-500/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users size={28} className="text-pink-400" />
            </div>
            <p className="text-3xl md:text-4xl font-bold">
              <AnimatedNumber end={totalDonors} suffix="+" />
            </p>
            <p className="text-sm text-gray-400 mt-1">Donaciones realizadas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
