import FloatingPublishButton from "./FloatingPublishButton";
import Alert from "../ui/Alert";

interface MobilePreviewViewProps {
  html: string;
  onPublish: () => void;
  publishing: boolean;
  publishedUrl?: string | null;
  isExistingSite?: boolean;
  existingSiteUrl?: string;
}

export default function MobilePreviewView({
  html,
  onPublish,
  publishing,
  publishedUrl,
  isExistingSite = false,
  existingSiteUrl,
}: MobilePreviewViewProps) {
  const siteUrl = existingSiteUrl || publishedUrl;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Preview del HTML - pantalla completa scrolleable */}
      <div className="flex-1 overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />
      </div>

      {/* Botón flotante - cambia según si es sitio existente */}
      {isExistingSite ? (
        <a
          href={siteUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-linear-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium animate-entrance"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Ver sitio
        </a>
      ) : !publishedUrl ? (
        <FloatingPublishButton
          onClick={onPublish}
          loading={publishing}
          label="Publicar"
        />
      ) : null}

      {/* Success message cuando se publica (solo para nuevos sitios) */}
      {!isExistingSite && publishedUrl && (
        <div className="fixed bottom-6 left-6 right-6 z-50 animate-entrance">
          <Alert variant="success" title="¡Sitio publicado!">
            <p className="text-sm mb-2">Tu sitio web está listo</p>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-green-700 hover:text-green-800 underline break-all"
            >
              {publishedUrl}
            </a>
          </Alert>
        </div>
      )}

      {/* Alert para sitio existente */}
      {isExistingSite && siteUrl && (
        <div className="fixed top-6 left-6 right-6 z-50 animate-entrance">
          <Alert variant="success" title="Tu sitio ya está publicado">
            <p className="text-sm">Puedes verlo haciendo clic en el botón de abajo</p>
          </Alert>
        </div>
      )}
    </div>
  );
}
