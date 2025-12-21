import { RestaurantProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateRestaurantPrompt(
  analyzed: RestaurantProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  return `Genera una landing page HTML de ALTA CALIDAD para un RESTAURANTE/CAFÉ profesional.

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

IMÁGENES PARA GALERÍA DE PLATOS (usar estas URLs exactas con sus links):
${galleryList}

REQUISITOS DE DISEÑO OBLIGATORIOS:

1. ESTÉTICA MODERNA 2025:
   - Diseño cálido y apetitoso
   - Espaciado generoso
   - Bordes redondeados sutiles (border-radius: 12-20px)
   - Sombras suaves
   - Transiciones CSS en hover

2. PALETA DE COLORES:
   - Fondo principal: #fafafa o #ffffff
   - Texto principal: #1a1a1a
   - Texto secundario: #666666
   - Acento: color cálido que evoque la comida (dorado, rojo oscuro, verde oliva, etc) según el tipo de cocina "${analyzed.cuisine_type}"
   - Usar el color acento en CTAs y detalles

3. TIPOGRAFÍA:
   - Importar Google Fonts: 'Poppins' para texto, 'Playfair Display' o similar para títulos elegantes
   - Títulos: font-weight 600-700, tamaño grande (2.5-4rem)
   - Cuerpo: font-weight 400, tamaño 1rem-1.125rem, line-height 1.6

4. ESTRUCTURA DE SECCIONES ESPECÍFICAS PARA RESTAURANTE:

   HERO (100vh altura):
   - Imagen de fondo deliciosa de comida usando: ${heroImageUrl}
   - Overlay oscuro semitransparente (rgba(0,0,0,0.4))
   - Nombre grande centrado en blanco: "${analyzed.business_name}"
   - Tipo de cocina debajo: "${analyzed.cuisine_type}"
   - Rango de precio como badges: ${analyzed.price_range}
   - Flecha animada indicando scroll

   SOBRE NOSOTROS:
   - Layout de dos columnas en desktop
   - Foto de perfil o logo circular/cuadrado (200px)
   - Título "Sobre Nosotros" o "Nuestra Historia"
   - Bio completa: "${analyzed.bio}"
   - Tipo de cocina destacado: ${analyzed.cuisine_type}
   - Opciones de comida como badges: ${analyzed.dining_options.join(', ')}
   - Ubicaciones: ${analyzed.locations.join(', ')}

   DESTACADOS DEL MENÚ:
   - Título "Nuestros Platillos" o "Menu Highlights"
   - Grid de 3 columnas en desktop
   - Para cada platillo destacado: ${analyzed.menu_highlights.map(m => `"${m}"`).join(', ')}
   - Cards con:
     * Nombre del platillo
     * Breve descripción (placeholder)
     * Emoji o ícono relacionado
     * Precio (placeholder: "$$$")
   - Nota al final: "¡Y mucho más! Síguenos en Instagram para ver nuestro menú completo"

   GALERÍA DE PLATOS:
   - Título "Galería" o "Nuestros Platos"
   - Grid de 3 columnas
   - Máximo 9 fotos de comida
   - Imágenes cuadradas con aspect-ratio: 1 y object-fit: cover
   - Hover: scale(1.05) y overlay
   - Cada imagen enlaza a su permalink de Instagram

   RESERVACIONES Y UBICACIÓN:
   - Fondo de color suave diferente (#f5f5f5)
   - Dos columnas en desktop:
     * Izquierda: 
       - Título "Horarios"
       - Placeholder para horarios (Lun-Vie: 12pm-10pm, etc)
       - Título "Ubicación"
       - Direcciones: ${analyzed.locations.join(', ')}
     * Derecha:
       - Título "Reservaciones"
       - Texto: "Contáctanos por Instagram para reservar tu mesa"
       - Botón grande a Instagram DM
       - Iconos para: ${analyzed.dining_options.join(', ')}

   CONTACTO/CTA:
   - Sección con fondo del color acento
   - Texto blanco centrado
   - Título: "¿Listo para disfrutar?"
   - Subtítulo: "Síguenos en Instagram para ver nuestro menú diario"
   - Botón grande "Síguenos en Instagram" → https://instagram.com/${profile.username}

   FOOTER:
   - Simple, fondo oscuro (#1a1a1a), texto gris claro
   - Copyright ${analyzed.business_name} © 2025
   - Link a Instagram
   - Íconos para opciones: ${analyzed.dining_options.join(', ')}

5. RESPONSIVE:
   - Mobile first con breakpoints en 768px y 1024px
   - En mobile: una columna, galería en grid de 2 columnas
   - Padding menor en mobile (1rem vs 4rem)

6. CSS ESPECIAL:
   - html { scroll-behavior: smooth; }
   - Todas las imágenes con loading="lazy"
   - Galería: aspect-ratio: 1; object-fit: cover;
   - Transiciones suaves: transition: all 0.3s ease;
   - Efectos hover apetitosos (zoom ligero)

7. META TAGS SEO:
   - <title>${analyzed.business_name} | ${analyzed.cuisine_type} Restaurant</title>
   - Meta description: "${analyzed.tagline} - ${analyzed.dining_options.join(', ')}"
   - Keywords: ${analyzed.keywords_seo.join(', ')}
   - Open Graph completo (og:title, og:description, og:image con heroImageUrl)

8. ELEMENTOS ESPECIALES PARA RESTAURANTES:
   - Íconos para: dine-in, takeout, delivery según corresponda
   - Badge de rango de precio: ${analyzed.price_range}
   - Énfasis en las fotos de comida (más grandes, mejor presentadas)

IMPORTANTE:
- Usa EXACTAMENTE las URLs de imágenes proporcionadas
- El HTML debe empezar con <!DOCTYPE html> y terminar con </html>
- No incluyas JavaScript, solo HTML y CSS
- Todo el CSS debe estar en un <style> tag dentro del <head>
- Diseño apetitoso y cálido apropiado para restaurante
- NO uses "Servicios", enfócate en menú, ubicación y reservaciones

RESPONDE ÚNICAMENTE CON EL CÓDIGO HTML COMPLETO.
No incluyas explicaciones, comentarios ni markdown.`;
}
