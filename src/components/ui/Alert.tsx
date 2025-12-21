import { ReactNode } from "react";

interface AlertProps {
  variant: "error" | "success";
  title?: string;
  children: ReactNode;
  onRetry?: () => void;
  retryText?: string;
}

export default function Alert({
  variant,
  title,
  children,
  onRetry,
  retryText = "Intentar de nuevo",
}: AlertProps) {
  const styles = {
    error: {
      container: "bg-red-50 border-red-200",
      title: "text-red-800",
      content: "text-red-600",
      button: "text-red-600 hover:text-red-800",
    },
    success: {
      container: "bg-green-50 border-green-200",
      title: "text-green-800",
      content: "text-green-800",
      button: "text-green-600 hover:text-green-800",
    },
  };

  const style = styles[variant];

  return (
    <div className={`${style.container} border rounded-lg p-4`}>
      {title && (
        <h2 className={`${style.title} font-semibold mb-2`}>{title}</h2>
      )}
      <div className={`${style.content} text-sm whitespace-pre-wrap`}>
        {children}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`inline-block mt-4 ${style.button} underline`}
        >
          {retryText}
        </button>
      )}
    </div>
  );
}
