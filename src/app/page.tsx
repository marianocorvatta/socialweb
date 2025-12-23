import ConnectButton from "@/components/landing/ConnectButton";
import LinkedInConnectButton from "@/components/landing/LinkedInConnectButton";
import Alert from "@/components/ui/Alert";
import MobileLoginView from "@/components/mobile/MobileLoginView";

interface HomeProps {
  searchParams: Promise<{ error?: string }>;
}

export const metadata = {
  title: "Winsta - Tu Web desde Instagram",
  description: "Transforma tu perfil de Instagram en un sitio web profesional con IA",
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const error = params.error;

  return (
    <>
      {/* Vista Mobile */}
      <div className="md:hidden">
        <MobileLoginView error={error} />
      </div>

      {/* Vista Desktop */}
      <div className="hidden md:flex min-h-screen bg-[#FAFAF8] flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative gradient lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-200 to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-pink-200 to-transparent opacity-60" />

      {/* Subtle gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-linear-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-linear-to-br from-orange-100/20 to-yellow-100/20 rounded-full blur-3xl" />

      <div className="max-w-2xl w-full relative z-10">
        {error && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <Alert variant="error" title="Error">
              <pre className="overflow-x-auto">{error}</pre>
            </Alert>
          </div>
        )}

        <div className="text-center space-y-8">
          {/* Logo/Brand */}
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <h1 className="text-7xl font-light tracking-tight text-gray-900">
                Winsta
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-linear-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full" />
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-2xl font-light text-gray-700 max-w-3xl mx-auto leading-relaxed mt-2">
            Transforma tu perfil de Instagram en un{" "}
            <span className="font-medium bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              sitio web profesional
            </span>
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-lg font-light max-w-md mx-auto leading-relaxed">
            Conecta tu cuenta y deja que la inteligencia artificial genere tu página web personalizada en minutos
          </p>

          {/* CTA */}
          <div className="pt-4 flex flex-col items-center gap-4">
            <ConnectButton />
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <div className="h-px w-12 bg-gray-300" />
              <span>o también</span>
              <div className="h-px w-12 bg-gray-300" />
            </div>
            <LinkedInConnectButton />
          </div>

          {/* Subtle feature hints */}
          <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-400 font-light">
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
      </div>
      </div>
    </>
  );
}
