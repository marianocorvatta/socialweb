import { ReactNode } from "react";

interface ButtonProps {
  variant?: "purple-pink" | "green-teal" | "blue" | "dark";
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  className?: string;
}

export default function Button({
  variant = "purple-pink",
  children,
  onClick,
  disabled = false,
  loading = false,
  href,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    "purple-pink":
      "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:from-purple-700 hover:via-pink-600 hover:to-orange-500",
    "green-teal":
      "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600",
    blue: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
    dark: "bg-gray-900 text-white hover:bg-gray-800",
  };

  const spinnerElement = loading && (
    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
  );

  const content = (
    <>
      {spinnerElement}
      {children}
    </>
  );

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClassName}>
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
    >
      {content}
    </button>
  );
}
