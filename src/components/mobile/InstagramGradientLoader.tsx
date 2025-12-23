interface InstagramGradientLoaderProps {
  message?: string;
}

export default function InstagramGradientLoader({
  message = "Cargando...",
}: InstagramGradientLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      {/* Borde animado con gradiente rotatorio */}
      <div className="absolute inset-4 rounded-2xl overflow-hidden">
        {/* Gradiente rotatorio */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 animate-rotate-gradient"
          style={{ backgroundSize: "200% 100%" }}
        />

        {/* Shimmer overlay - destello */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      </div>

      {/* Contenido central */}
      <div className="relative z-10 text-center px-6">
        <p className="text-xl font-light text-gray-800">{message}</p>
      </div>
    </div>
  );
}
