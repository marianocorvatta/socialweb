import { WellnessProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateWellnessPrompt(
  analyzed: WellnessProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  return `Genera una landing page HTML de ALTA CALIDAD para un PROFESIONAL DE BIENESTAR (yoga, fitness, spa, etc).

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
   - Diseño calmado, armónico y relajante
   - Espaciado generoso y fluido
   - Bordes redondeados suaves (border-radius: 16-24px)
   - Sombras muy sutiles
   - Transiciones CSS suaves en hover

2. PALETA DE COLORES:
   - Fondo principal: #fafafa o tonos tierra claros (#f5f1ed, #e8f4f8)
   - Texto principal: #2a2a2a
   - Texto secundario: #666666
   - Acento: color calmado (verde sage, azul claro, lavanda, coral suave) según especialidad
   - Usar el color acento en CTAs y detalles

3. TIPOGRAFÍA:
   - Importar Google Fonts: 'Poppins' para texto, 'Playfair Display' o 'Cormorant' para títulos
   - Títulos: font-weight 500-600, tamaño grande (2.5-4rem), elegante
   - Cuerpo: font-weight 400, tamaño 1rem-1.125rem, line-height 1.7

4. ESTRUCTURA DE SECCIONES ESPECÍFICAS PARA WELLNESS:

   HERO (100vh altura):
   - Imagen de fondo serena usando: ${heroImageUrl}
   - Overlay claro semitransparente (rgba(255,255,255,0.3) o rgba(0,0,0,0.3))
   - Nombre grande centrado: "${analyzed.business_name}"
   - Tagline debajo: "${analyzed.tagline}"
   - Especialidades como badges suaves: ${analyzed.specialties.join(', ')}
   - Flecha animada suave indicando scroll

   SOBRE MÍ:
   - Layout de dos columnas en desktop
   - Foto de perfil circular grande (200px) con borde suave
   - Título "Sobre Mí" o "My Journey"
   - Bio completa: "${analyzed.bio}"
   - Certificaciones destacadas: ${analyzed.certifications.join(', ')}
   - Ubicaciones: ${analyzed.locations.join(', ')}
   - Estilo visual relajado y personal

   ESPECIALIDADES/SERVICIOS:
   - Título "Especialidades" o "What I Offer"
   - Grid de 3 columnas en desktop (cards con mucho padding)
   - Para cada especialidad: ${analyzed.specialties.map(s => `"${s}"`).join(', ')}
   - Cada card con:
     * Título de la especialidad
     * Breve descripción inspiradora (placeholder)
     * Emoji o ícono zen relacionado (🧘, 🌿, 💆, ✨, 🕉️)
     * Hover effect muy sutil (translateY -3px)

   CLASES/SESIONES:
   - Título "Clases" o "Sessions"
   - Layout de cards horizontales o vertical
   - Para cada tipo de clase: ${analyzed.class_types.map(c => `"${c}"`).join(', ')}
   - Cada clase con:
     * Nombre de la clase
     * Descripción placeholder
     * Duración placeholder (45min, 60min, etc)
     * Nivel (todos, principiante, avanzado)
   - CTA: "Reserva tu Clase"

   GALERÍA/TRANSFORMACIONES:
   - Título "Galería" o "Transformations"
   - Grid masonry o 3 columnas
   - Máximo 9 imágenes de Instagram
   - Imágenes con aspect-ratio variado y object-fit: cover
   - Hover: zoom muy sutil (scale 1.02)
   - Cada imagen enlaza a su permalink de Instagram

   CERTIFICACIONES:
   - Sección con fondo suave diferente
   - Título "Certificaciones" o "Credentials"
   - Badges o lista elegante: ${analyzed.certifications.join(', ')}
   - Diseño limpio con íconos o emojis (📜, ✓, 🎓)

   TESTIMONIOS (opcional):
   - Título "Testimonios" o "What Clients Say"
   - Cards con diseño zen y minimalista
   - 2-3 testimonios placeholder
   - Foto circular, nombre y transformación lograda

   CONTACTO/CTA:
   - Sección con fondo del color acento suave
   - Texto centrado
   - Título: "¿Lista para transformar tu vida?"
   - Subtítulo inspirador sobre bienestar
   - Botón grande "Empieza tu Viaje" → https://instagram.com/${profile.username}
   - Ícono de Instagram

   FOOTER:
   - Simple, fondo claro (#f5f5f5), texto gris oscuro
   - Copyright ${analyzed.business_name} © 2025
   - Link a Instagram
   - Opcional: links a YouTube, sitio de reservas (placeholder)

5. RESPONSIVE:
   - Mobile first con breakpoints en 768px y 1024px
   - En mobile: una columna, clases apiladas
   - Padding menor en mobile (1rem vs 4rem)

6. CSS ESPECIAL:
   - html { scroll-behavior: smooth; }
   - Todas las imágenes con loading="lazy"
   - Galería: object-fit: cover con bordes redondeados
   - Transiciones MUY suaves: transition: all 0.4s ease;
   - Animaciones sutiles y relajantes

7. META TAGS SEO:
   - <title>${analyzed.business_name} | ${analyzed.specialties[0] || 'Wellness'}</title>
   - Meta description: "${analyzed.tagline}"
   - Keywords: ${analyzed.keywords_seo.join(', ')}
   - Open Graph completo (og:title, og:description, og:image con heroImageUrl)

8. ELEMENTOS ESPECIALES PARA WELLNESS:
   - Emojis zen y de naturaleza: 🧘‍♀️, 🌿, 💆‍♀️, ✨, 🕉️, 🌸, 🍃
   - Sensación de paz y armonía en todo el diseño
   - Mucho white space (espacios en blanco)
   - Imágenes grandes y respirables

IMPORTANTE:
- Usa EXACTAMENTE las URLs de imágenes proporcionadas
- El HTML debe empezar con <!DOCTYPE html> y terminar con </html>
- No incluyas JavaScript, solo HTML y CSS
- Todo el CSS debe estar en un <style> tag dentro del <head>
- Diseño calmado y armonioso apropiado para wellness/bienestar

RESPONDE ÚNICAMENTE CON EL CÓDIGO HTML COMPLETO.
No incluyas explicaciones, comentarios ni markdown.`;
}
