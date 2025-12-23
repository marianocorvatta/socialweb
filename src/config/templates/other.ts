import { OtherProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateOtherPrompt(
  analyzed: OtherProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  const isSpanish = /[áéíóúñ¿¡]/.test(profile.biography || '') ||
                    /(hola|contacto|síguenos|servicios)/i.test(profile.biography || '');

  return `Genera una landing page HTML MODERNA y ELEGANTE.

REGLAS CRÍTICAS:
1. TODO el texto en ${isSpanish ? 'ESPAÑOL' : 'el mismo idioma del perfil'}
2. NO inventes información - solo usa los datos proporcionados
3. NO pongas servicios inventados, testimonios, ni descripciones placeholder
4. NO uses textos como "Descripción del servicio" o "Lorem ipsum"

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
   - Imagen de fondo: ${heroImageUrl}
   - Overlay oscuro elegante
   - Nombre: "${analyzed.business_name}"
   - Tagline: "${analyzed.tagline}"

2. SOBRE:
   - Foto de perfil circular
   - Bio: "${analyzed.bio}"
   - Ubicación
   - Link a Instagram con seguidores

3. GALERÍA (visual, sin título):
   - Grid elegante de imágenes
   - Cada imagen enlaza a Instagram
   - Hover moderno

4. CONTACTO:
   - Fondo con color acento
   - Botón: "Sígueme" → https://instagram.com/${profile.username}

5. FOOTER:
   - © ${analyzed.business_name} 2025

ESTILO:
- Ultra minimalista tipo Squarespace
- Tipografía: 'Inter' para todo
- Paleta: blanco, texto oscuro, un acento elegante
- Mucho espacio en blanco
- Mobile responsive

TÉCNICO:
- <!DOCTYPE html>
- CSS en <style>
- loading="lazy"
- NO JavaScript

RESPONDE SOLO CON HTML.`;
}
