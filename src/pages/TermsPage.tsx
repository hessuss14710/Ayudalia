import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

export function TermsPage() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="sticky top-14 md:top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-gray-900">Términos de Uso</h1>
      </div>

      <div className="p-6 prose prose-sm max-w-none text-gray-700">
        <p className="text-sm text-gray-500">Última actualización: 23 de marzo de 2026</p>

        <h3 className="text-lg font-bold text-gray-900 mt-4">1. Aceptación de los términos</h3>
        <p>
          Al acceder y utilizar Ayudalia, aceptas estos términos de uso en su totalidad.
          Si no estás de acuerdo con alguno de estos términos, no debes utilizar la plataforma.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">2. Descripción del servicio</h3>
        <p>
          Ayudalia es una plataforma gratuita de ayuda mutua que permite a los usuarios:
        </p>
        <ul className="space-y-1">
          <li>Publicar solicitudes de ayuda u ofertas de colaboración.</li>
          <li>Comunicarse con otros usuarios a través de mensajería privada.</li>
          <li>Crear y apoyar campañas solidarias.</li>
          <li>Compartir recursos y conocimientos con la comunidad.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">3. Registro y cuenta</h3>
        <ul className="space-y-1">
          <li>Debes tener al menos 16 años para registrarte.</li>
          <li>La información que proporciones debe ser veraz y actualizada.</li>
          <li>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
          <li>Una persona solo puede tener una cuenta activa.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">4. Normas de conducta</h3>
        <p>Al usar Ayudalia, te comprometes a:</p>
        <ul className="space-y-1">
          <li>Tratar a todos los usuarios con respeto y dignidad.</li>
          <li>No publicar contenido falso, engañoso, difamatorio u ofensivo.</li>
          <li>No utilizar la plataforma para actividades ilegales o fraudulentas.</li>
          <li>No hacer spam ni enviar mensajes no solicitados de forma masiva.</li>
          <li>No suplantar la identidad de otra persona.</li>
          <li>No publicar contenido que vulnere derechos de propiedad intelectual de terceros.</li>
          <li>No utilizar la plataforma con fines comerciales sin autorización.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">5. Contenido del usuario</h3>
        <p>
          Eres el único responsable del contenido que publicas en Ayudalia. Al publicar contenido,
          nos concedes una licencia no exclusiva para mostrarlo en la plataforma. Puedes eliminar
          tu contenido en cualquier momento.
        </p>
        <p>
          Nos reservamos el derecho de eliminar contenido que viole estas normas sin previo aviso.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">6. Campañas y donaciones</h3>
        <ul className="space-y-1">
          <li>Las campañas deben tener un propósito legítimo y solidario.</li>
          <li>Los creadores de campañas son responsables de utilizar los fondos según lo descrito.</li>
          <li>Ayudalia no gestiona pagos directamente; las donaciones se coordinan entre usuarios.</li>
          <li>Ayudalia no se hace responsable del uso final de las donaciones.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">7. Limitación de responsabilidad</h3>
        <p>
          Ayudalia actúa como intermediario entre usuarios. No nos hacemos responsables de:
        </p>
        <ul className="space-y-1">
          <li>La veracidad de las publicaciones o campañas creadas por los usuarios.</li>
          <li>Las interacciones entre usuarios fuera de la plataforma.</li>
          <li>Daños derivados del uso o imposibilidad de uso de la plataforma.</li>
          <li>La calidad, seguridad o legalidad de la ayuda ofrecida o recibida.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">8. Propiedad intelectual</h3>
        <p>
          El diseño, código, logotipos y marca de Ayudalia son propiedad de sus creadores.
          Queda prohibida su reproducción sin autorización expresa.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">9. Suspensión y cancelación</h3>
        <p>
          Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos.
          Puedes cancelar tu cuenta en cualquier momento desde la configuración de tu perfil.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">10. Modificaciones</h3>
        <p>
          Podemos modificar estos términos en cualquier momento. Los cambios entrarán en vigor
          desde su publicación en la plataforma. El uso continuado de Ayudalia implica la aceptación
          de los términos actualizados.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">11. Legislación aplicable</h3>
        <p>
          Estos términos se rigen por la legislación española. Para cualquier controversia,
          las partes se someten a los juzgados y tribunales competentes de España.
        </p>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Ayudalia.es</p>
        </div>
      </div>
    </div>
  )
}
