import FloatingPublishButton from "./FloatingPublishButton";
import Alert from "../ui/Alert";

interface MobilePreviewViewProps {
  html: string;
  onPublish: () => void;
  publishing: boolean;
  publishedUrl?: string | null;
}

export default function MobilePreviewView({
  html,
  onPublish,
  publishing,
  publishedUrl,
}: MobilePreviewViewProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Preview del HTML - pantalla completa scrolleable */}
      <div className="flex-1 overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />
      </div>

      {/* Botón flotante de publicar */}
      {!publishedUrl && (
        <FloatingPublishButton
          onClick={onPublish}
          loading={publishing}
          label="Publicar"
        />
      )}

      {/* Success message cuando se publica */}
      {publishedUrl && (
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
    </div>
  );
}
