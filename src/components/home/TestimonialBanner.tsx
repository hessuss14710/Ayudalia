import { Link } from 'react-router'

export function TestimonialBanner() {
  return (
    <div className="bg-emerald-600 text-white py-14 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic">
          "Gracias a Ayudalia encontré un psicólogo que me ayudó gratuitamente con mi adicción.
          Hoy llevo 8 meses limpio y ahora soy yo quien ayuda a otros."
        </blockquote>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
            M
          </div>
          <div className="text-left">
            <p className="font-semibold">Miguel R.</p>
            <p className="text-emerald-200 text-sm">Miembro de Ayudalia</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/auth"
            className="bg-white text-emerald-700 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 no-underline"
          >
            Comparte tu historia
          </Link>
          <Link
            to="/campaigns"
            className="border-2 border-white/50 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 no-underline"
          >
            Quiero ayudar
          </Link>
        </div>
      </div>
    </div>
  )
}
