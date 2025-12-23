import { CraftsProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateCraftsPrompt(
  analyzed: CraftsProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  const isSpanish = /[áéíóúñ¿¡]/.test(profile.biography || '') ||
                    /(hecho a mano|artesanal|pedidos|creaciones)/i.test(profile.biography || '');

  return `Genera una landing page HTML CÁLIDA y ARTÍSTICA para artesano/creador.

REGLAS CRÍTICAS:
1. TODO el texto en ${isSpanish ? 'ESPAÑOL' : 'el mismo idioma del perfil'}
2. NO inventes información - solo usa los datos proporcionados
3. NO pongas descripciones de productos inventadas, precios, ni procesos placeholder
4. NO uses textos como "Descripción del producto"

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
- Creaciones:
${galleryList}

ESTRUCTURA (solo estas secciones):

1. HERO:
   - Imagen de fondo: ${heroImageUrl}
   - Overlay cálido
   - Nombre: "${analyzed.business_name}"
   - Tagline: "${analyzed.tagline}"

2. SOBRE MÍ:
   - Foto de perfil circular
   - Bio: "${analyzed.bio}"
   - Ubicación
   - Link a Instagram

3. GALERÍA (la sección principal - visual, sin título):
   - Grid de imágenes grande
   - Las creaciones son el protagonista
   - Cada imagen enlaza a Instagram
   - Hover cálido y artístico

4. CONTACTO:
   - Fondo con color acento cálido (terracota, mostaza)
   - Botón: "Contactar" → https://instagram.com/${profile.username}

5. FOOTER:
   - © ${analyzed.business_name} 2025

ESTILO:
- Cálido y artesanal pero moderno
- Tipografía: 'Playfair Display' títulos, 'Inter' texto
- Paleta: tonos cálidos, acento artístico
- Las imágenes son grandes y protagonistas
- Mobile responsive

TÉCNICO:
- <!DOCTYPE html>
- CSS en <style>
- loading="lazy"
- NO JavaScript

RESPONDE SOLO CON HTML.`;
}
