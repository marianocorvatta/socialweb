import { ProfessionalServicesProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateProfessionalServicesPrompt(
  analyzed: ProfessionalServicesProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  const isSpanish = /[áéíóúñ¿¡]/.test(profile.biography || '') ||
                    /(consulta|servicio|profesional|contacto)/i.test(profile.biography || '');

  return `Genera una landing page HTML PROFESIONAL y MODERNA.

REGLAS CRÍTICAS:
1. TODO el texto en ${isSpanish ? 'ESPAÑOL' : 'el mismo idioma del perfil'}
2. NO inventes información - solo usa los datos proporcionados
3. NO pongas testimonios, procesos, pasos, ni descripciones inventadas
4. NO uses textos placeholder

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
   - Overlay oscuro profesional
   - Nombre: "${analyzed.business_name}"
   - Tagline: "${analyzed.tagline}"

2. SOBRE MÍ:
   - Foto de perfil circular
   - Bio: "${analyzed.bio}"
   - Ubicación si disponible
   - Link a Instagram

3. GALERÍA (visual, sin título):
   - Grid de imágenes
   - Cada imagen enlaza a Instagram
   - Hover profesional

4. CONTACTO:
   - Fondo con color acento profesional (azul, verde oscuro)
   - Botón: "Contactar" → https://instagram.com/${profile.username}

5. FOOTER:
   - © ${analyzed.business_name} 2025

ESTILO:
- Profesional y corporativo pero moderno
- Tipografía: 'Inter' para todo
- Paleta: blanco, texto oscuro, acento profesional
- Mobile responsive

TÉCNICO:
- <!DOCTYPE html>
- CSS en <style>
- loading="lazy"
- NO JavaScript

RESPONDE SOLO CON HTML.`;
}
