import { RestaurantProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateRestaurantPrompt(
  analyzed: RestaurantProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  // Detectar idioma basado en la bio
  const isSpanish = /[áéíóúñ¿¡]/.test(profile.biography || '') ||
                    /(hola|bienvenidos|síguenos|ubicación|horario|pedidos|delivery)/i.test(profile.biography || '');

  return `Genera una landing page HTML ELEGANTE y MODERNA para un restaurante/café.

REGLAS CRÍTICAS - LEE ESTO PRIMERO:
1. TODO el texto debe estar en ${isSpanish ? 'ESPAÑOL' : 'el mismo idioma que la bio del perfil'}
2. NO inventes información que no esté en los datos proporcionados
3. NO pongas horarios, precios, descripciones de platillos, ni ningún dato inventado
4. NO uses placeholders como "Descripción del platillo" o "Lorem ipsum"
5. NO incluyas secciones de menú con items inventados
6. SOLO usa la información real proporcionada abajo

DATOS REALES DEL NEGOCIO:
- Nombre: ${analyzed.business_name}
- Tagline: ${analyzed.tagline}
- Bio: ${analyzed.bio}
- Ubicación: ${analyzed.locations.length > 0 ? analyzed.locations.join(', ') : 'Consultar en Instagram'}
- Instagram: @${profile.username}
- Seguidores: ${profile.followers_count || 'N/A'}

IMÁGENES (usar URLs exactas):
- Hero: ${heroImageUrl}
- Foto de perfil: ${profilePicUrl}
- Galería:
${galleryList}

ESTRUCTURA DE LA PÁGINA (solo 4 secciones):

1. HERO (pantalla completa):
   - Imagen de fondo: ${heroImageUrl}
   - Overlay oscuro semitransparente
   - Nombre: "${analyzed.business_name}" en grande
   - Tagline: "${analyzed.tagline}"
   - Botón elegante "Ver más" que hace scroll suave

2. SOBRE NOSOTROS:
   - Foto de perfil circular CENTRADA (usa margin: 0 auto; display: block; o text-align: center en el padre)
   - Texto: "${analyzed.bio}"
   - Ubicación si está disponible: ${analyzed.locations.join(', ') || 'No especificada'}
   - Badges con: @${profile.username} y cantidad de seguidores

3. GALERÍA (sin título "Galería", hacerlo visual):
   - Grid elegante de 3 columnas
   - Mostrar las imágenes proporcionadas
   - Hover con zoom sutil
   - Cada imagen enlaza a su permalink de Instagram

4. CONTACTO:
   - Fondo con color acento
   - Texto: "Síguenos en Instagram"
   - Botón grande que va a: https://instagram.com/${profile.username}

5. FOOTER mínimo:
   - © ${analyzed.business_name} 2025
   - Link a Instagram

ESTILO VISUAL:
- Diseño minimalista y elegante tipo restaurante premium
- Paleta: fondo claro (#fafafa), texto oscuro (#1a1a1a), un color acento cálido
- Tipografía: Google Fonts 'Playfair Display' para títulos, 'Inter' para texto
- Mucho espacio en blanco
- Bordes redondeados sutiles (12px)
- Transiciones suaves en hover
- Mobile responsive

REQUISITOS TÉCNICOS:
- Empezar con <!DOCTYPE html>
- CSS en tag <style> dentro de <head>
- Imágenes con loading="lazy"
- html { scroll-behavior: smooth; }
- NO JavaScript

RESPONDE SOLO CON HTML. Sin explicaciones ni markdown.`;
}
