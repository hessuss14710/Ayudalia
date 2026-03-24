import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

export function AboutPage() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="sticky top-14 md:top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-gray-900">Sobre Ayudalia</h1>
      </div>

      <div className="p-6 prose prose-sm max-w-none text-gray-700">
        <div className="text-center mb-8">
          <span className="text-5xl">🤝</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">Ayudalia</h2>
          <p className="text-emerald-600 font-medium">Red solidaria de ayuda mutua</p>
        </div>

        <h3 className="text-lg font-bold text-gray-900">¿Qué es Ayudalia?</h3>
        <p>
          Ayudalia es una plataforma solidaria que conecta a personas que necesitan ayuda con personas
          que quieren ayudar. Nuestro objetivo es crear una red de apoyo mutuo donde nadie se quede solo
          ante las dificultades de la vida.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">Nuestra misión</h3>
        <p>
          Creemos que la solidaridad puede cambiar el mundo. Ayudalia nace con la misión de facilitar
          la conexión entre personas, eliminando barreras y haciendo que pedir o ofrecer ayuda sea algo
          sencillo, seguro y accesible para todos.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">¿Cómo funciona?</h3>
        <ul className="space-y-2">
          <li><strong>Publica lo que necesitas</strong> — Describe tu situación y la comunidad te ayudará.</li>
          <li><strong>Ofrece tu ayuda</strong> — Comparte tus habilidades, tiempo o recursos con quienes lo necesitan.</li>
          <li><strong>Campañas solidarias</strong> — Crea o apoya campañas para causas que importan.</li>
          <li><strong>Mensajería directa</strong> — Comunícate de forma privada para coordinar la ayuda.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">Valores</h3>
        <ul className="space-y-2">
          <li><strong>Solidaridad</strong> — Creemos en el poder de ayudarnos mutuamente.</li>
          <li><strong>Transparencia</strong> — Operamos con honestidad y claridad.</li>
          <li><strong>Accesibilidad</strong> — Ayudalia es gratuita y abierta para todos.</li>
          <li><strong>Respeto</strong> — Tratamos a cada persona con dignidad.</li>
          <li><strong>Comunidad</strong> — Juntos somos más fuertes.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">Contacto</h3>
        <p>
          Si tienes alguna pregunta, sugerencia o necesitas ayuda con la plataforma,
          puedes escribirnos a <a href="mailto:contacto@ayudalia.es" className="text-emerald-600 font-medium">contacto@ayudalia.es</a>.
        </p>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Ayudalia.es — Juntos podemos cambiar el mundo ❤️</p>
        </div>
      </div>
    </div>
  )
}
