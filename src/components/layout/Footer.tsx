import { Link } from 'react-router'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤝</span>
              <span className="text-xl font-bold text-white">Ayudalia</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Conectamos a personas que necesitan ayuda con personas que quieren ayudar.
              Juntos podemos cambiar el mundo, una acción a la vez.
            </p>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Cómo ayudar</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/campaigns" className="text-gray-400 hover:text-white no-underline">Donar a una campaña</Link></li>
              <li><Link to="/create" className="text-gray-400 hover:text-white no-underline">Ofrecer tu ayuda</Link></li>
              <li><Link to="/campaigns/create" className="text-gray-400 hover:text-white no-underline">Crear una campaña</Link></li>
              <li><Link to="/explore" className="text-gray-400 hover:text-white no-underline">Explorar necesidades</Link></li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="text-gray-400 hover:text-white no-underline">Ayuda económica</Link></li>
              <li><Link to="/explore" className="text-gray-400 hover:text-white no-underline">Empleo</Link></li>
              <li><Link to="/explore" className="text-gray-400 hover:text-white no-underline">Salud y psicología</Link></li>
              <li><Link to="/explore" className="text-gray-400 hover:text-white no-underline">Vivienda</Link></li>
              <li><Link to="/explore" className="text-gray-400 hover:text-white no-underline">Educación</Link></li>
              <li><Link to="/explore" className="text-gray-400 hover:text-white no-underline">Compañía</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Información</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-white no-underline">Sobre Ayudalia</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white no-underline">Política de privacidad</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white no-underline">Términos de uso</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white no-underline">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Ayudalia. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Hecho con <Heart size={12} className="text-red-500" fill="currentColor" /> para cambiar el mundo
          </p>
        </div>
      </div>
    </footer>
  )
}
