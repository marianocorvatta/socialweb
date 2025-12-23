import Spinner from "../ui/Spinner";

interface FloatingPublishButtonProps {
  onClick: () => void;
  loading: boolean;
  label?: string;
}

export default function FloatingPublishButton({
  onClick,
  loading,
  label = "Publicar",
}: FloatingPublishButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-entrance disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
      aria-label={loading ? "Publicando sitio..." : label}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span className="text-sm">Publicando...</span>
        </>
      ) : (
        <>
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm">{label}</span>
        </>
      )}
    </button>
  );
}
