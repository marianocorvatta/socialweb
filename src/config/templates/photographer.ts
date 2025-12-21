import { PhotographerProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generatePhotographerPrompt(
  analyzed: PhotographerProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  return `Genera una landing page HTML de ALTA CALIDAD para un FOTÓGRAFO/CREADOR profesional.

DATOS DEL PERFIL:
${JSON.stringify(analyzed, null, 2)}

DATOS DE INSTAGRAM:
- Nombre: ${profile.name || profile.username}
- Username: @${profile.username}
- Foto de perfil: ${profilePicUrl}
- Instagram: https://instagram.com/${profile.username}
- Seguidores: ${profile.followers_count || 'N/A'}
- Posts: ${profile.media_count || 'N/A'}

IMAGEN PARA HERO (usar como background):
${heroImageUrl}

IMÁGENES PARA PORTFOLIO (usar estas URLs exactas con sus links):
${galleryList}

REQUISITOS DE DISEÑO OBLIGATORIOS:

1. ESTÉTICA MODERNA 2025:
   - Diseño minimalista y elegante tipo portfolio premium
   - Espaciado generoso (mucho white space)
   - Bordes redondeados sutiles (border-radius: 12-20px)
   - Sombras suaves (box-shadow con blur alto y opacidad baja)
   - Transiciones CSS en hover (transform, opacity)

2. PALETA DE COLORES:
   - Fondo principal: #fafafa o similar (off-white)
   - Texto principal: #1a1a1a (casi negro)
   - Texto secundario: #666666
   - Acento: elegir UN color elegante que combine con el estilo "${analyzed.style}"
   - Usar el color acento solo en CTAs y detalles pequeños

3. TIPOGRAFÍA:
   - Importar Google Fonts: 'Poppins' para texto y títulos
   - Títulos: font-weight 600-700, tamaño grande (2.5-4rem)
   - Cuerpo: font-weight 400, tamaño 1rem-1.125rem, line-height 1.6

4. ESTRUCTURA DE SECCIONES ESPECÍFICAS PARA FOTÓGRAFO:

   HERO (100vh altura):
   - Imagen de fondo dramática usando: ${heroImageUrl}
   - Overlay oscuro semitransparente (rgba(0,0,0,0.5))
   - Nombre grande centrado en blanco: "${analyzed.business_name}"
   - Especialidades debajo como badges/pills: ${analyzed.specialties.join(', ')}
   - Flecha animada indicando scroll (CSS animation)

   SOBRE MÍ:
   - Layout de dos columnas en desktop (foto perfil a la izquierda, texto a la derecha)
   - Foto de perfil circular grande (200px) con borde sutil
   - Título "Sobre Mí" o "About"
   - Bio completa: "${analyzed.bio}"
   - Enfoque del portfolio: ${analyzed.portfolio_focus.join(', ')}
   - Badges/pills con las ubicaciones: ${analyzed.locations.join(', ')}
   - Mostrar seguidores y posts como social proof

   PORTFOLIO:
   - Título "Portfolio" o "Mis Trabajos"
   - Grid masonry o 3 columnas en desktop
   - Mostrar categorías si existen: ${analyzed.portfolio_focus.join(', ')}
   - Máximo 9 imágenes de Instagram
   - Imágenes con aspect-ratio: 1 y object-fit: cover
   - Hover: scale(1.05) y overlay con ícono de Instagram
   - Cada imagen es un link <a> al permalink de Instagram correspondiente

   PAQUETES (reemplaza "Servicios"):
   - Título "Paquetes" o "Packages"
   - Grid de 3 columnas en desktop (cards horizontales)
   - Para cada paquete: ${analyzed.packages.map(p => `"${p}"`).join(', ')}
   - Cada card con:
     * Título del paquete
     * Breve descripción (placeholder)
     * Ícono relacionado (emoji o símbolo)
     * Hover effect (translateY -5px, shadow más grande)
   - CTA "Consultar Precio" que va a Instagram DM

   TESTIMONIOS (opcional):
   - Título "Lo Que Dicen Mis Clientes" o "Testimonials"
   - Cards con diseño elegante
   - 2-3 testimonios con texto placeholder
   - Foto circular, nombre y tipo de sesión

   CONTACTO/CTA:
   - Sección con fondo del color acento elegido
   - Texto blanco centrado
   - Título: "¿Listo para tu sesión?"
   - Botón grande "Contáctame en Instagram" → https://instagram.com/${profile.username}
   - Ícono de Instagram

   FOOTER:
   - Simple, fondo oscuro (#1a1a1a), texto gris claro
   - Copyright ${analyzed.business_name} © 2025
   - Link a Instagram
   - Links opcionales a otras redes sociales (placeholder)

5. RESPONSIVE:
   - Mobile first con breakpoints en 768px y 1024px
   - En mobile: una columna, portfolio en grid de 2 columnas
   - Padding menor en mobile (1rem vs 4rem)
   - Hero height en mobile: 100vh también

6. CSS ESPECIAL:
   - html { scroll-behavior: smooth; }
   - Todas las imágenes con loading="lazy"
   - Portfolio: aspect-ratio: 1; object-fit: cover;
   - Transiciones suaves: transition: all 0.3s ease;
   - Animación del scroll arrow en hero

7. META TAGS SEO:
   - <title>${analyzed.business_name} | ${analyzed.specialties[0] || 'Photographer'}</title>
   - Meta description: "${analyzed.tagline}"
   - Keywords: ${analyzed.keywords_seo.join(', ')}
   - Open Graph completo (og:title, og:description, og:image con heroImageUrl)

IMPORTANTE:
- Usa EXACTAMENTE las URLs de imágenes proporcionadas, no las modifiques
- El HTML debe empezar con <!DOCTYPE html> y terminar con </html>
- No incluyas JavaScript, solo HTML y CSS
- Todo el CSS debe estar en un <style> tag dentro del <head>
- Enfócate en un diseño elegante tipo portfolio premium para fotógrafos
- NO uses la palabra "Servicios", usa "Paquetes" o "Packages"

RESPONDE ÚNICAMENTE CON EL CÓDIGO HTML COMPLETO.
No incluyas explicaciones, comentarios ni markdown.`;
}
