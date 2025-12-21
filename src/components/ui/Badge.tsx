import { ReactNode } from "react";

interface BadgeProps {
  variant?: "success" | "default";
  children: ReactNode;
}

export default function Badge({ variant = "default", children }: BadgeProps) {
  const styles = {
    success:
      "text-green-600 bg-green-50 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
    default: "bg-gray-100 px-2 py-1 rounded text-xs",
  };

  if (variant === "success") {
    return (
      <span className={styles.success}>
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
        {children}
      </span>
    );
  }

  return <span className={styles.default}>{children}</span>;
}
