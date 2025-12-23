"use client";

import { useEffect, useState } from "react";

/**
 * Hook genérico para media queries
 * Detecta si la consulta de medios coincide con el viewport actual
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Verificar si estamos en el cliente
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(query);

    // Establecer el valor inicial
    setMatches(media.matches);

    // Listener para cambios en el media query
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // addEventListener es el método moderno
    media.addEventListener("change", listener);

    // Cleanup
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

/**
 * Hook específico para detectar viewport móvil
 * Retorna true si el ancho de pantalla es menor a 768px (breakpoint md de Tailwind)
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
