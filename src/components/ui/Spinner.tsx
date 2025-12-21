interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export default function Spinner({ size = "md", message }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="text-center py-20">
      <div
        className={`inline-block animate-spin rounded-full ${sizeClasses[size]} border-purple-500 border-t-transparent`}
      ></div>
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}
