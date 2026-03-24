import { useState } from 'react'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import { useNavigate } from 'react-router'

export function ContactPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const mailtoLink = `mailto:contacto@ayudalia.es?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`)}`
    window.location.href = mailtoLink
    setSent(true)
  }

  return (
    <div>
      <div className="sticky top-14 md:top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-gray-900">Contacto</h1>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <Mail size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-4">¿En qué podemos ayudarte?</h2>
          <p className="text-gray-500 text-sm mt-2">
            Escríbenos y te responderemos lo antes posible.
          </p>
        </div>

        {sent ? (
          <div className="text-center bg-emerald-50 rounded-xl p-8">
            <span className="text-4xl">✅</span>
            <h3 className="text-lg font-bold text-gray-900 mt-3">¡Mensaje preparado!</h3>
            <p className="text-gray-600 text-sm mt-2">
              Se ha abierto tu cliente de correo con el mensaje. Si no se ha abierto,
              escríbenos directamente a:
            </p>
            <a href="mailto:contacto@ayudalia.es" className="text-emerald-600 font-semibold mt-2 block">
              contacto@ayudalia.es
            </a>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-emerald-600 hover:underline"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Selecciona un asunto</option>
                <option value="Consulta general">Consulta general</option>
                <option value="Problema técnico">Problema técnico</option>
                <option value="Reportar contenido">Reportar contenido</option>
                <option value="Sugerencia">Sugerencia</option>
                <option value="Solicitud de datos (RGPD)">Solicitud de datos (RGPD)</option>
                <option value="Eliminar cuenta">Eliminar cuenta</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Escribe tu mensaje..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2"
            >
              <Send size={18} /> Enviar mensaje
            </button>
          </form>
        )}

        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">También puedes contactarnos en:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Mail size={16} className="text-gray-400" />
              <a href="mailto:contacto@ayudalia.es" className="text-emerald-600 hover:underline">contacto@ayudalia.es</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
