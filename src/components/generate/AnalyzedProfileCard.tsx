import { AnalyzedProfile } from "@/types/instagram";
import Badge from "../ui/Badge";

interface AnalyzedProfileCardProps {
  analyzedProfile: AnalyzedProfile;
}

export default function AnalyzedProfileCard({
  analyzedProfile,
}: AnalyzedProfileCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Perfil Analizado por IA
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Nombre del negocio</p>
          <p className="font-medium">{analyzedProfile.business_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Categoría</p>
          <p className="font-medium">{analyzedProfile.category}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500">Tagline</p>
          <p className="font-medium">{analyzedProfile.tagline}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500">Bio generada</p>
          <p className="text-gray-700">{analyzedProfile.bio}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Servicios</p>
          <ul className="list-disc list-inside text-gray-700">
            {"services" in analyzedProfile && Array.isArray(analyzedProfile.services) && analyzedProfile.services.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm text-gray-500">Keywords SEO</p>
          <div className="flex flex-wrap gap-1">
            {analyzedProfile.keywords_seo.map((k, i) => (
              <Badge key={i}>{k}</Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Público objetivo</p>
          <p className="text-gray-700">{analyzedProfile.target_audience}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estilo</p>
          <p className="text-gray-700">{analyzedProfile.style}</p>
        </div>
      </div>
    </div>
  );
}
