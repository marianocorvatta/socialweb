import ConnectButton from "../landing/ConnectButton";
import Alert from "../ui/Alert";

interface MobileLoginViewProps {
  error?: string;
}

export default function MobileLoginView({ error }: MobileLoginViewProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
      {/* Línea gradiente decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60" />

      <div className="w-full max-w-sm space-y-8">
        {/* Error alert si existe */}
        {error && (
          <div className="mb-4">
            <Alert variant="error" title="Error">
              {error}
            </Alert>
          </div>
        )}

        {/* Logo con underline gradiente */}
        <div className="text-center">
          <div className="inline-block">
            <h1 className="text-6xl font-light tracking-tight text-gray-900 mb-2">
              Winsta
            </h1>
            <div className="h-px bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-full" />
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center space-y-3">
          <h2 className="text-xl font-light text-gray-700 leading-relaxed">
            Tu perfil de Instagram,
            <br />
            <span className="font-medium bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              tu sitio web
            </span>
          </h2>

          <p className="text-sm text-gray-500 font-light">
            Conecta tu cuenta y genera tu página web en minutos
          </p>
        </div>

        {/* Botón de conexión - full width en mobile */}
        <div className="pt-4">
          <ConnectButton />
        </div>

        {/* Features hints */}
        <div className="flex flex-col items-center gap-3 text-xs text-gray-400 font-light pt-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-purple-300" />
            <span>Generado con IA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-pink-300" />
            <span>Diseño personalizado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-orange-300" />
            <span>Listo en minutos</span>
          </div>
        </div>
      </div>

      {/* Línea gradiente decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60" />
    </div>
  );
}
