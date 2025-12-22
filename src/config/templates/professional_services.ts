import { ProfessionalServicesProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateProfessionalServicesPrompt(
  analyzed: ProfessionalServicesProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  return `Genera una landing page HTML de ALTA CALIDAD para un PROFESIONAL/CONSULTOR.

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

IMÁGENES PARA GALERÍA (usar estas URLs exactas con sus links):
${galleryList}

REQUISITOS DE DISEÑO OBLIGATORIOS:

1. ESTÉTICA MODERNA 2025:
   - Diseño profesional y corporativo pero moderno
   - Espaciado generoso y limpio
   - Bordes redondeados sutiles (border-radius: 12-20px)
   - Sombras suaves y elegantes
   - Transiciones CSS en hover

2. PALETA DE COLORES:
   - Fondo principal: #ffffff o #fafafa
   - Texto principal: #1a1a1a
   - Texto secundario: #666666
   - Acento: color profesional (azul corporativo, verde oscuro, gris oscuro) según el servicio
   - Usar el color acento en CTAs y detalles

3. TIPOGRAFÍA:
   - Importar Google Fonts: 'Inter' o 'Poppins' para todo
   - Títulos: font-weight 600-700, tamaño grande (2.5-4rem)
   - Cuerpo: font-weight 400, tamaño 1rem-1.125rem, line-height 1.6

4. ESTRUCTURA DE SECCIONES ESPECÍFICAS PARA PROFESIONAL:

   HERO (100vh altura):
   - Imagen de fondo profesional usando: ${heroImageUrl}
   - Overlay oscuro semitransparente (rgba(0,0,0,0.5))
   - Nombre grande centrado en blanco: "${analyzed.business_name}"
   - Tagline debajo: "${analyzed.tagline}"
   - Tipo de consultoría: ${analyzed.consultation_type}
   - CTA principal: "Agenda una Consulta"

   SOBRE MÍ / ACERCA:
   - Layout de dos columnas en desktop
   - Foto de perfil profesional circular (200px)
   - Título "Sobre Mí" o "About"
   - Bio completa: "${analyzed.bio}"
   - Credenciales destacadas como badges: ${analyzed.credentials.join(', ')}
   - Ubicaciones: ${analyzed.locations.join(', ')}
   - Social proof: seguidores y posts

   SERVICIOS:
   - Título "Servicios" o "What I Offer"
   - Grid de 3 columnas en desktop (2 en tablet, 1 en mobile)
   - Para cada servicio: ${analyzed.services_offered.map(s => `"${s}"`).join(', ')}
   - Cada card con:
     * Título del servicio
     * Breve descripción (placeholder profesional)
     * Ícono relacionado (emoji o símbolo)
     * Hover effect (translateY -5px, shadow más grande)

   PROCESO / CÓMO TRABAJO:
   - Título "Mi Proceso" o "How I Work"
   - Timeline o pasos numerados (3-4 pasos)
   - Placeholder para cada paso:
     1. Consulta inicial
     2. Análisis y estrategia
     3. Implementación
     4. Seguimiento
   - Diseño limpio con íconos

   PORTFOLIO/CASOS DE ÉXITO:
   - Título "Portfolio" o "Success Stories"
   - Grid de 3 columnas
   - Máximo 6 imágenes de Instagram
   - Imágenes con aspect-ratio: 1 y object-fit: cover
   - Hover: scale(1.05) y overlay
   - Cada imagen enlaza a su permalink de Instagram

   CREDENCIALES Y CERTIFICACIONES:
   - Sección destacada con fondo diferente (#f5f5f5)
   - Título "Credenciales" o "Certifications"
   - Lista o badges de: ${analyzed.credentials.join(', ')}
   - Diseño limpio y profesional

   CONTACTO/CTA:
   - Sección con fondo del color acento
   - Texto blanco centrado
   - Título: "¿Listo para empezar?"
   - Subtítulo: "Agenda una consulta ${analyzed.consultation_type}"
   - Botón grande "Contáctame en Instagram" → https://instagram.com/${profile.username}
   - Ícono de Instagram

   FOOTER:
   - Simple, fondo oscuro (#1a1a1a), texto gris claro
   - Copyright ${analyzed.business_name} © 2025
   - Link a Instagram
   - Links opcionales a LinkedIn y sitio web (placeholder)

5. RESPONSIVE:
   - Mobile first con breakpoints en 768px y 1024px
   - En mobile: una columna, servicios apilados
   - Padding menor en mobile (1rem vs 4rem)

6. CSS ESPECIAL:
   - html { scroll-behavior: smooth; }
   - Todas las imágenes con loading="lazy"
   - Portfolio: aspect-ratio: 1; object-fit: cover;
   - Transiciones suaves: transition: all 0.3s ease;

7. META TAGS SEO:
   - <title>${analyzed.business_name} | ${analyzed.services_offered[0] || 'Professional Services'}</title>
   - Meta description: "${analyzed.tagline}"
   - Keywords: ${analyzed.keywords_seo.join(', ')}
   - Open Graph completo (og:title, og:description, og:image con heroImageUrl)

IMPORTANTE:
- Usa EXACTAMENTE las URLs de imágenes proporcionadas
- El HTML debe empezar con <!DOCTYPE html> y terminar con </html>
- No incluyas JavaScript, solo HTML y CSS
- Todo el CSS debe estar en un <style> tag dentro del <head>
- Diseño profesional y confiable apropiado para servicios profesionales

RESPONDE ÚNICAMENTE CON EL CÓDIGO HTML COMPLETO.
No incluyas explicaciones, comentarios ni markdown.`;
}
