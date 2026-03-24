import { Link } from 'react-router'
import { CATEGORIES } from '@/lib/constants'
import { useFeedStore } from '@/stores/feedStore'
import { ArrowRight } from 'lucide-react'

const categoryImages: Record<string, string> = {
  economica: '💰',
  empleo: '💼',
  compania: '🤗',
  salud: '🏥',
  vivienda: '🏠',
  educacion: '📚',
  legal: '⚖️',
  transporte: '🚗',
  alimentacion: '🍽️',
  psicologia: '🧠',
  otro: '🤝',
}

export function CategoryShowcase() {
  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Todo tipo de ayuda, un solo lugar
        </h2>
        <p className="text-gray-500 text-center mt-2 max-w-2xl mx-auto">
          Desde ayuda económica hasta apoyo psicológico, pasando por vivienda, empleo y compañía.
          Cada persona merece recibir la ayuda que necesita.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/explore"
              onClick={() => useFeedStore.getState().setFilter({ category: cat.id })}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 no-underline"
              style={{ backgroundColor: cat.color + '12' }}
            >
              <span className="text-4xl block mb-3">{categoryImages[cat.slug] ?? '🤝'}</span>
              <h3 className="font-bold text-gray-900 text-base">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {cat.slug === 'economica' && 'Crowdfunding, donaciones y apoyo financiero'}
                {cat.slug === 'empleo' && 'Ofertas de trabajo y formación profesional'}
                {cat.slug === 'compania' && 'Acompañamiento para personas en soledad'}
                {cat.slug === 'salud' && 'Atención médica y apoyo sanitario'}
                {cat.slug === 'vivienda' && 'Alojamiento temporal o permanente'}
                {cat.slug === 'educacion' && 'Clases, tutorías y materiales educativos'}
                {cat.slug === 'legal' && 'Asesoría jurídica y acompañamiento legal'}
                {cat.slug === 'transporte' && 'Traslados y movilidad'}
                {cat.slug === 'alimentacion' && 'Comida, comedores y cestas solidarias'}
                {cat.slug === 'psicologia' && 'Terapia, adicciones y salud mental'}
                {cat.slug === 'otro' && 'Muebles, ropa, artículos y más'}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: cat.color }}>
                Ver ofertas <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
