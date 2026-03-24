import { Link } from 'react-router'
import { Heart, PenSquare, Search, MessageCircle } from 'lucide-react'

const steps = [
  {
    icon: PenSquare,
    title: 'Publica tu situación',
    description: 'Cuéntanos qué necesitas o qué puedes ofrecer. Añade fotos, vídeos y documentos para documentar tu caso.',
    color: 'bg-emerald-500',
    link: '/create',
  },
  {
    icon: Search,
    title: 'Explora y encuentra',
    description: 'Busca por categoría, ubicación o urgencia. Encuentra a personas cerca de ti que necesitan tu ayuda.',
    color: 'bg-blue-500',
    link: '/explore',
  },
  {
    icon: Heart,
    title: 'Dona o colabora',
    description: 'Contribuye económicamente a campañas solidarias o ofrece tu tiempo, conocimientos y recursos.',
    color: 'bg-pink-500',
    link: '/campaigns',
  },
  {
    icon: MessageCircle,
    title: 'Conecta directamente',
    description: 'Comunícate en tiempo real con quienes necesitan ayuda. Coordina la ayuda de forma directa y personal.',
    color: 'bg-purple-500',
    link: '/messages',
  },
]

export function HowToHelp() {
  return (
    <div className="bg-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          ¿Cómo funciona Ayudalia?
        </h2>
        <p className="text-gray-500 text-center mt-2 max-w-2xl mx-auto">
          Cuatro pasos sencillos para conectar con quienes más lo necesitan
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {steps.map((step, i) => (
            <Link
              key={i}
              to={step.link}
              className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 no-underline"
            >
              <div className={`${step.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <step.icon size={24} className="text-white" />
              </div>
              <div className="text-xs font-bold text-gray-400 mb-1">PASO {i + 1}</div>
              <h3 className="font-bold text-gray-900 text-base">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{step.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
