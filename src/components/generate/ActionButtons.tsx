import Alert from "../ui/Alert";

interface ActionButtonsProps {
  onDownload: () => void;
  onPublish: () => void;
  onFullScreen: () => void;
  publishing: boolean;
  publishSuccess: string | null;
  publishError: string | null;
  publishedUrl: string | null;
  isExistingSite?: boolean;
  existingSiteUrl?: string;
}

export default function ActionButtons({
  onDownload,
  onPublish,
  onFullScreen,
  publishing,
  publishSuccess,
  publishError,
  publishedUrl,
  isExistingSite = false,
  existingSiteUrl,
}: ActionButtonsProps) {
  const siteUrl = existingSiteUrl || publishedUrl;

  return (
    <div className="space-y-4">
      {/* Existing Site Alert */}
      {isExistingSite && siteUrl && (
        <Alert variant="success">
          <p className="font-medium">Tu sitio ya está publicado</p>
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Ver mi sitio web
          </a>
        </Alert>
      )}

      {/* Success/Error Messages */}
      {!isExistingSite && publishSuccess && (
        <Alert variant="success">
          <p className="font-medium whitespace-pre-line">{publishSuccess}</p>
          {publishedUrl && (
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Ver mi web publicada
            </a>
          )}
        </Alert>
      )}

      {publishError && (
        <Alert variant="error" title="Error al publicar">
          {publishError}
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onFullScreen}
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Pantalla completa
        </button>

        <button
          onClick={onDownload}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Descargar HTML
        </button>

        {isExistingSite ? (
          <a
            href={siteUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Ver sitio publicado
          </a>
        ) : (
          <button
            onClick={onPublish}
            disabled={publishing}
            className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Publicando...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Publicar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
