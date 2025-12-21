"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  hasGeneratedSite: boolean;
}

export default function Sidebar({ hasGeneratedSite }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Perfil",
      path: "/profile",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      disabled: false,
    },
    {
      name: "Preview",
      path: "/generate",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      disabled: !hasGeneratedSite,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200/50">
        <Link href="/" className="block">
          <div className="relative inline-block">
            <h1 className="text-3xl font-light tracking-tight text-gray-900">
              Winsta
            </h1>
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full" />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const isDisabled = item.disabled;

          return (
            <Link
              key={item.path}
              href={isDisabled ? "#" : item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive && !isDisabled
                  ? "bg-linear-to-r from-purple-50 to-pink-50 text-purple-700 font-medium shadow-sm"
                  : isDisabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
              onClick={(e) => isDisabled && e.preventDefault()}
            >
              <span className={isActive && !isDisabled ? "text-purple-600" : ""}>
                {item.icon}
              </span>
              <span>{item.name}</span>
              {isDisabled && (
                <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  Bloqueado
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-200 to-transparent opacity-60" />
    </aside>
  );
}
