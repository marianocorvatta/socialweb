import { CraftsProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateCraftsPrompt(
  analyzed: CraftsProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  return `Genera una landing page HTML de ALTA CALIDAD para un ARTESANO/CREADOR DE MANUALIDADES.

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
   - Diseño cálido, artístico y creativo
   - Espaciado generoso con toques artesanales
   - Bordes redondeados sutiles (border-radius: 12-20px)
   - Sombras suaves
   - Transiciones CSS en hover

2. PALETA DE COLORES:
   - Fondo principal: #fafafa o tonos cálidos (#fdf8f3, #f9f5f0)
   - Texto principal: #2a2a2a
   - Texto secundario: #666666
   - Acento: color que refleje el tipo de artesanía "${analyzed.craft_type}" (terracota, mostaza, verde bosque, azul índigo)
   - Usar el color acento en CTAs y detalles

3. TIPOGRAFÍA:
   - Importar Google Fonts: 'Poppins' para texto, 'Playfair Display' o 'Lora' para títulos
   - Títulos: font-weight 600-700, tamaño grande (2.5-4rem)
   - Cuerpo: font-weight 400, tamaño 1rem-1.125rem, line-height 1.6

4. ESTRUCTURA DE SECCIONES ESPECÍFICAS PARA ARTESANÍAS:

   HERO (100vh altura):
   - Imagen de fondo mostrando artesanía usando: ${heroImageUrl}
   - Overlay suave semitransparente (rgba(0,0,0,0.3))
   - Nombre grande centrado en blanco: "${analyzed.business_name}"
   - Tipo de artesanía debajo: "${analyzed.craft_type}"
   - Tagline: "${analyzed.tagline}"
   - Badge si acepta pedidos personalizados: ${analyzed.custom_orders ? '"Pedidos Personalizados"' : ''}
   - Flecha animada indicando scroll

   SOBRE MÍ / MI HISTORIA:
   - Layout de dos columnas en desktop
   - Foto de perfil circular (200px) o foto trabajando
   - Título "Sobre Mí" o "Mi Historia"
   - Bio completa: "${analyzed.bio}"
   - Tipo de artesanía: ${analyzed.craft_type}
   - Técnicas utilizadas: ${analyzed.techniques.join(', ')}
   - Ubicaciones: ${analyzed.locations.join(', ')}

   TÉCNICAS Y PROCESO:
   - Título "Técnicas" o "My Craft"
   - Grid o lista de técnicas: ${analyzed.techniques.map(t => `"${t}"`).join(', ')}
   - Cada técnica con:
     * Nombre de la técnica
     * Breve descripción (placeholder)
     * Emoji o ícono relacionado (✂️, 🧵, 🎨, 🪡, 🖌️, 🔨)
   - Diseño visual y artístico

   GALERÍA DE TRABAJOS:
   - Título "Galería" o "Mis Creaciones"
   - Grid masonry o 3 columnas en desktop
   - Máximo 12 imágenes de Instagram (más que otros templates)
   - Imágenes con aspect-ratio: 1 y object-fit: cover
   - Hover: scale(1.05) y overlay con ícono
   - Cada imagen enlaza a su permalink de Instagram
   - Estilo tipo portfolio artístico

   PEDIDOS PERSONALIZADOS (si ${analyzed.custom_orders}):
   - Sección destacada con fondo diferente
   - Título "Pedidos Personalizados" o "Custom Orders"
   - Texto explicando que acepta pedidos personalizados
   - Pasos del proceso:
     1. Cuéntame tu idea
     2. Diseño y presupuesto
     3. Creación artesanal
     4. Entrega con amor
   - CTA "Solicita tu Pedido Personalizado"

   PRODUCTOS/CREACIONES DESTACADAS:
   - Título "Creaciones Destacadas" o "Featured Work"
   - Grid de 3 columnas
   - Cards mostrando diferentes tipos de productos
   - Cada card con foto de Instagram y descripción
   - Hover effect artístico

   PROCESO CREATIVO (opcional):
   - Título "Proceso Creativo" o "Behind the Scenes"
   - Timeline o pasos visuales mostrando cómo se crea
   - Fotos de Instagram mostrando el proceso
   - Diseño narrativo y personal

   CONTACTO/CTA:
   - Sección con fondo del color acento
   - Texto blanco centrado
   - Título: "¿Listo para tu pieza única?"
   - Subtítulo: ${analyzed.custom_orders ? '"Pedidos personalizados disponibles"' : '"Sígueme para ver nuevas creaciones"'}
   - Botón grande "Contáctame en Instagram" → https://instagram.com/${profile.username}
   - Ícono de Instagram

   FOOTER:
   - Simple, fondo oscuro (#2a2a2a), texto gris claro
   - Copyright ${analyzed.business_name} © 2025
   - Link a Instagram
   - Opcional: links a Etsy, tienda online (placeholder)
   - Texto: "Hecho a mano con amor ❤️"

5. RESPONSIVE:
   - Mobile first con breakpoints en 768px y 1024px
   - En mobile: una columna, galería en grid de 2 columnas
   - Padding menor en mobile (1rem vs 4rem)

6. CSS ESPECIAL:
   - html { scroll-behavior: smooth; }
   - Todas las imágenes con loading="lazy"
   - Galería: aspect-ratio: 1; object-fit: cover;
   - Transiciones suaves: transition: all 0.3s ease;
   - Efectos hover creativos

7. META TAGS SEO:
   - <title>${analyzed.business_name} | ${analyzed.craft_type} Artesanías</title>
   - Meta description: "${analyzed.tagline}"
   - Keywords: ${analyzed.keywords_seo.join(', ')}
   - Open Graph completo (og:title, og:description, og:image con heroImageUrl)

8. ELEMENTOS ESPECIALES PARA ARTESANÍAS:
   - Emojis creativos: ✂️, 🧵, 🎨, 🪡, 🖌️, 🔨, ✨, 💝
   - Énfasis en lo "hecho a mano" y "único"
   - Sensación de calidez y creatividad
   - Mostrar el proceso creativo
   - Badge visible de "Pedidos Personalizados" si aplica

IMPORTANTE:
- Usa EXACTAMENTE las URLs de imágenes proporcionadas
- El HTML debe empezar con <!DOCTYPE html> y terminar con </html>
- No incluyas JavaScript, solo HTML y CSS
- Todo el CSS debe estar en un <style> tag dentro del <head>
- Diseño cálido y artístico apropiado para artesanías

RESPONDE ÚNICAMENTE CON EL CÓDIGO HTML COMPLETO.
No incluyas explicaciones, comentarios ni markdown.`;
}
