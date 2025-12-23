import { WellnessProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateWellnessPrompt(
  analyzed: WellnessProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  const isSpanish = /[áéíóúñ¿¡]/.test(profile.biography || '') ||
                    /(yoga|bienestar|clases|sesiones|reserva)/i.test(profile.biography || '');

  return `Genera una landing page HTML SERENA y ELEGANTE para wellness/bienestar.

REGLAS CRÍTICAS:
1. TODO el texto en ${isSpanish ? 'ESPAÑOL' : 'el mismo idioma del perfil'}
2. NO inventes información - solo usa los datos proporcionados
3. NO pongas clases inventadas, horarios, precios, testimonios ni descripciones placeholder
4. NO uses textos como "Descripción de la clase" o similares

DATOS REALES:
- Nombre: ${analyzed.business_name}
- Tagline: ${analyzed.tagline}
- Bio: ${analyzed.bio}
- Ubicación: ${analyzed.locations.length > 0 ? analyzed.locations.join(', ') : 'Consultar en Instagram'}
- Instagram: @${profile.username}
- Seguidores: ${profile.followers_count || 'N/A'}

IMÁGENES:
- Hero: ${heroImageUrl}
- Foto de perfil: ${profilePicUrl}
- Galería:
${galleryList}

ESTRUCTURA (solo estas secciones):

1. HERO:
   - Imagen de fondo serena: ${heroImageUrl}
   - Overlay suave
   - Nombre: "${analyzed.business_name}"
   - Tagline: "${analyzed.tagline}"

2. SOBRE MÍ:
   - Foto de perfil circular CENTRADA (usa margin: 0 auto; display: block; o text-align: center en el padre)
   - Bio: "${analyzed.bio}"
   - Ubicación
   - Link a Instagram

3. GALERÍA (visual, sin título):
   - Grid elegante de imágenes
   - Cada imagen enlaza a Instagram
   - Hover suave y zen

4. CONTACTO:
   - Fondo con color acento calmado (verde sage, lavanda)
   - Botón: "Sígueme" → https://instagram.com/${profile.username}

5. FOOTER:
   - © ${analyzed.business_name} 2025

ESTILO:
- Diseño zen, mucho espacio en blanco
- Tipografía: 'Playfair Display' títulos, 'Inter' texto
- Paleta: tonos tierra claros, acento calmado
- Bordes muy redondeados
- Mobile responsive

TÉCNICO:
- <!DOCTYPE html>
- CSS en <style>
- loading="lazy"
- NO JavaScript

RESPONDE SOLO CON HTML.`;
}
