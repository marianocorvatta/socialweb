import { EcommerceProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateEcommercePrompt(
  analyzed: EcommerceProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  const isSpanish = /[áéíóúñ¿¡]/.test(profile.biography || '') ||
                    /(tienda|envío|pedidos|compra|productos)/i.test(profile.biography || '');

  return `Genera una landing page HTML ELEGANTE para una tienda online.

REGLAS CRÍTICAS:
1. TODO el texto en ${isSpanish ? 'ESPAÑOL' : 'el mismo idioma del perfil'}
2. NO inventes precios, productos, ni descripciones
3. NO uses placeholders como "Descripción del producto"
4. SOLO usa la información proporcionada

DATOS REALES:
- Nombre: ${analyzed.business_name}
- Tagline: ${analyzed.tagline}
- Bio: ${analyzed.bio}
- Instagram: @${profile.username}
- Seguidores: ${profile.followers_count || 'N/A'}

IMÁGENES:
- Hero: ${heroImageUrl}
- Productos:
${galleryList}

ESTRUCTURA:

1. HERO:
   - Imagen de fondo: ${heroImageUrl}
   - Nombre: "${analyzed.business_name}"
   - Tagline: "${analyzed.tagline}"
   - Botón: "${isSpanish ? 'Ver Productos' : 'Shop Now'}"

2. SOBRE NOSOTROS:
   - Bio: "${analyzed.bio}"
   - Link a Instagram

3. PRODUCTOS (grid visual):
   - Mostrar las imágenes proporcionadas
   - Sin precios ni descripciones inventadas
   - Cada imagen enlaza a Instagram
   - Hover elegante

4. CTA:
   - "${isSpanish ? 'Compra en Instagram' : 'Shop on Instagram'}"
   - Botón a: https://instagram.com/${profile.username}

5. FOOTER:
   - © ${analyzed.business_name} 2025

ESTILO:
- Minimalista y moderno
- Tipografía: 'Inter' para todo
- Productos como protagonistas
- Mobile responsive

TÉCNICO:
- <!DOCTYPE html>
- CSS en <style>
- loading="lazy"
- NO JavaScript

RESPONDE SOLO CON HTML.`;
}
