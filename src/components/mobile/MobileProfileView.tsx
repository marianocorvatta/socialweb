import { InstagramProfile } from "@/types/instagram";
import GradientAvatar from "../profile/GradientAvatar";
import Button from "../ui/Button";

interface MobileProfileViewProps {
  profile: InstagramProfile;
  mediaCount: number;
  onGenerate: () => void;
  generating: boolean;
}

export default function MobileProfileView({
  profile,
  mediaCount,
  onGenerate,
  generating,
}: MobileProfileViewProps) {
  // Formatear números grandes
  const formatNumber = (num: number | null) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Card principal con borde gradiente - estilo Instagram Stories */}
      <div className="flex-1 flex flex-col p-4">
        {/* Contenedor con borde gradiente */}
        <div className="flex-1 p-[2px] rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-xl">
          <div className="h-full bg-white rounded-3xl p-6 flex flex-col overflow-auto">
            {/* Avatar con gradiente - arriba centrado */}
            <div className="flex justify-center mb-6 pt-4">
              <GradientAvatar
                src={profile.profile_picture_url}
                alt={profile.username || "Profile"}
                size={30}
              />
            </div>

            {/* Información del perfil - layout vertical */}
            <div className="flex-1 flex flex-col items-center text-center space-y-4">
              {/* Nombre y username */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.name || profile.username}
                </h2>
                <p className="text-gray-500 font-medium flex items-center justify-center gap-1">
                  <svg
                    className="w-4 h-4 text-pink-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @{profile.username}
                </p>
              </div>

              {/* Stats compactos en línea */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-lg">📸</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(profile.media_count)}
                  </span>
                  <span className="text-gray-500">posts</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg">👥</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(profile.followers_count)}
                  </span>
                  <span className="text-gray-500">seguidores</span>
                </div>
              </div>

              {/* Bio scrolleable */}
              {profile.biography && (
                <div className="max-h-40 overflow-y-auto px-4">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {profile.biography}
                  </p>
                </div>
              )}

              {/* Info de posts cargados */}
              <div className="pt-2">
                <p className="text-xs text-gray-400">
                  {mediaCount} posts cargados para análisis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón sticky en la parte inferior */}
      <div className="p-4 bg-white border-t border-gray-100">
        <Button
          variant="green-teal"
          onClick={onGenerate}
          disabled={generating}
          loading={generating}
          className="w-full shadow-lg hover:shadow-xl py-4 text-base"
        >
          {generating ? "Generando con IA..." : "Generar mi Web"}
        </Button>
        {generating && (
          <p className="mt-2 text-xs text-center text-gray-500 font-light">
            Esto puede tardar hasta 1 minuto...
          </p>
        )}
      </div>
    </div>
  );
}
