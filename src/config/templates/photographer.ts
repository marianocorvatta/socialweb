import { PhotographerProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generatePhotographerPrompt(
  analyzed: PhotographerProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  const isSpanish = /[áéíóúñ¿¡]/.test(profile.biography || '') ||
                    /(hola|fotograf|sesión|reserva|contacto)/i.test(profile.biography || '');

  return `Genera una landing page HTML ELEGANTE y MODERNA para un fotógrafo profesional.

REGLAS CRÍTICAS:
1. TODO el texto en ${isSpanish ? 'ESPAÑOL' : 'el mismo idioma del perfil'}
2. NO inventes información - solo usa los datos proporcionados
3. NO pongas testimonios inventados, precios, ni descripciones placeholder
4. NO uses textos genéricos como "Lorem ipsum" o "Descripción del servicio"

DATOS REALES:
- Nombre: ${analyzed.business_name}
- Tagline: ${analyzed.tagline}
- Bio: ${analyzed.bio}
- Ubicación: ${analyzed.locations.length > 0 ? analyzed.locations.join(', ') : 'Consultar en Instagram'}
- Instagram: @${profile.username}
- Seguidores: ${profile.followers_count || 'N/A'}

IMÁGENES (usar URLs exactas):
- Hero: ${heroImageUrl}
- Foto de perfil: ${profilePicUrl}
- Portfolio:
${galleryList}

ESTRUCTURA (solo estas secciones):

1. HERO (pantalla completa):
   - Imagen de fondo: ${heroImageUrl}
   - Overlay oscuro elegante
   - Nombre: "${analyzed.business_name}" tipografía grande y elegante
   - Tagline: "${analyzed.tagline}"

2. SOBRE MÍ:
   - Foto de perfil circular CENTRADA (usa margin: 0 auto; display: block; o text-align: center en el padre)
   - Bio: "${analyzed.bio}"
   - Ubicación: ${analyzed.locations.join(', ') || 'No especificada'}
   - Link a Instagram con seguidores

3. PORTFOLIO (la sección más importante):
   - Grid elegante de imágenes (3 columnas desktop, 2 mobile)
   - Sin título "Portfolio" ni "Galería" - que sea visual
   - Cada imagen enlaza a Instagram
   - Hover con zoom sutil y overlay

4. CONTACTO:
   - Fondo con color acento
   - Botón: "Contactar por Instagram" → https://instagram.com/${profile.username}

5. FOOTER mínimo:
   - © ${analyzed.business_name} 2025

ESTILO:
- Ultra minimalista, mucho espacio en blanco
- Tipografía: 'Playfair Display' títulos, 'Inter' texto
- Paleta: fondo blanco/crema, texto negro, un acento sutil
- Las fotos son el protagonista
- Mobile responsive

TÉCNICO:
- <!DOCTYPE html> al inicio
- CSS en <style>
- loading="lazy" en imágenes
- scroll-behavior: smooth
- NO JavaScript

RESPONDE SOLO CON HTML.`;
}
