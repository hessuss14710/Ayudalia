import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

export function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="sticky top-14 md:top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-gray-900">Política de Privacidad</h1>
      </div>

      <div className="p-6 prose prose-sm max-w-none text-gray-700">
        <p className="text-sm text-gray-500">Última actualización: 23 de marzo de 2026</p>

        <h3 className="text-lg font-bold text-gray-900 mt-4">1. Responsable del tratamiento</h3>
        <p>
          El responsable del tratamiento de tus datos personales es <strong>Ayudalia</strong>,
          con domicilio en España y contacto a través de <a href="mailto:contacto@ayudalia.es" className="text-emerald-600">contacto@ayudalia.es</a>.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">2. Datos que recopilamos</h3>
        <p>Recopilamos los siguientes datos cuando usas Ayudalia:</p>
        <ul className="space-y-1">
          <li><strong>Datos de registro:</strong> nombre, nombre de usuario, dirección de correo electrónico y contraseña cifrada.</li>
          <li><strong>Datos de perfil:</strong> foto de perfil, biografía, ubicación (si la proporcionas voluntariamente) y tipo de perfil.</li>
          <li><strong>Contenido generado:</strong> publicaciones, comentarios, mensajes privados y archivos adjuntos que compartas.</li>
          <li><strong>Datos de uso:</strong> información técnica como dirección IP, tipo de navegador y páginas visitadas.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">3. Finalidad del tratamiento</h3>
        <p>Utilizamos tus datos para:</p>
        <ul className="space-y-1">
          <li>Gestionar tu cuenta y proporcionarte acceso a la plataforma.</li>
          <li>Permitir la comunicación entre usuarios a través de mensajes y publicaciones.</li>
          <li>Mostrar contenido relevante según tu ubicación y preferencias.</li>
          <li>Mejorar la plataforma y garantizar la seguridad de los usuarios.</li>
          <li>Enviar notificaciones relacionadas con tu actividad en la plataforma.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">4. Base legal</h3>
        <p>
          El tratamiento de tus datos se basa en tu <strong>consentimiento</strong> al registrarte,
          la <strong>ejecución del contrato</strong> de uso del servicio y nuestro <strong>interés legítimo</strong> en
          mantener la seguridad de la plataforma.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">5. Conservación de datos</h3>
        <p>
          Conservaremos tus datos mientras mantengas tu cuenta activa. Si eliminas tu cuenta,
          tus datos personales serán eliminados en un plazo máximo de 30 días, salvo obligación legal de conservarlos.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">6. Compartición de datos</h3>
        <p>
          No vendemos ni compartimos tus datos personales con terceros con fines comerciales.
          Tus datos pueden ser procesados por:
        </p>
        <ul className="space-y-1">
          <li><strong>Supabase:</strong> proveedor de infraestructura y base de datos (servidores en la UE).</li>
          <li><strong>Vercel:</strong> proveedor de alojamiento web.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">7. Tus derechos</h3>
        <p>De acuerdo con el RGPD, tienes derecho a:</p>
        <ul className="space-y-1">
          <li><strong>Acceso:</strong> solicitar una copia de tus datos personales.</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
          <li><strong>Supresión:</strong> solicitar la eliminación de tus datos («derecho al olvido»).</li>
          <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado.</li>
          <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
          <li><strong>Limitación:</strong> solicitar la restricción del tratamiento.</li>
        </ul>
        <p>
          Para ejercer estos derechos, escríbenos a <a href="mailto:contacto@ayudalia.es" className="text-emerald-600">contacto@ayudalia.es</a>.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">8. Cookies</h3>
        <p>
          Ayudalia utiliza cookies técnicas necesarias para el funcionamiento de la plataforma
          (autenticación de sesión). No utilizamos cookies de seguimiento ni publicitarias.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">9. Seguridad</h3>
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos,
          incluyendo cifrado de contraseñas, conexiones HTTPS y políticas de acceso restringido a la base de datos.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">10. Modificaciones</h3>
        <p>
          Nos reservamos el derecho de actualizar esta política. Te notificaremos de cambios significativos
          a través de la plataforma o por correo electrónico.
        </p>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Ayudalia.es</p>
        </div>
      </div>
    </div>
  )
}
