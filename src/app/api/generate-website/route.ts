import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface InstagramProfile {
  user_id: string | null;
  username: string | null;
  name: string | null;
  biography: string | null;
  website: string | null;
  profile_picture_url: string | null;
  followers_count: number | null;
  follows_count: number | null;
  media_count: number | null;
  account_type: string | null;
}

interface InstagramMedia {
  id: string;
  caption: string | null;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string | null;
  thumbnail_url: string | null;
  permalink: string | null;
  timestamp: string | null;
}

interface AnalyzedProfile {
  business_name: string;
  tagline: string;
  bio: string;
  services: string[];
  keywords_seo: string[];
  locations: string[];
  style: string;
  target_audience: string;
  category: string;
}

function getDirectUrl(originalUrl: string | null): string {
  // Use Instagram URLs directly - they work fine in <img> tags
  // CORS only affects fetch/XHR, not image loading
  return originalUrl || "";
}

async function analyzeProfile(
  profile: InstagramProfile,
  media: InstagramMedia[]
): Promise<AnalyzedProfile> {
  const systemPrompt = `Eres un experto en marketing digital y análisis de perfiles de redes sociales.
Tu tarea es analizar datos de Instagram y crear un perfil de negocio/creador completo.
Responde SOLO en formato JSON válido, sin markdown ni explicaciones.`;

  const mediaDescriptions = media
    .slice(0, 15)
    .map(
      (m, i) =>
        `${i + 1}. "${m.caption || "(sin caption)"}" (${m.media_type}, ${m.timestamp})`
    )
    .join("\n");

  const analysisPrompt = `Analiza este perfil de Instagram y sus publicaciones para inferir:

Datos del perfil:
- Nombre: ${profile.name || profile.username}
- Username: ${profile.username}
- Bio actual: ${profile.biography || "(sin bio)"}
- Seguidores: ${profile.followers_count || "desconocido"}
- Tipo de cuenta: ${profile.account_type}

Últimas publicaciones (captions):
${mediaDescriptions}

Genera un JSON con esta estructura exacta:
{
  "business_name": "nombre del negocio o nombre artístico",
  "tagline": "frase corta que describe lo que hace (máximo 10 palabras)",
  "bio": "descripción profesional de 2-3 oraciones",
  "services": ["servicio 1", "servicio 2", "servicio 3"],
  "keywords_seo": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "locations": ["ubicación 1", "ubicación 2"],
  "style": "descripción del estilo visual/artístico en una oración",
  "target_audience": "descripción del público objetivo",
  "category": "categoría principal (ej: Fotografía, Gastronomía, Moda, Arte, etc)"
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: analysisPrompt },
    ],
    temperature: 0.7,
  });

  const responseText = completion.choices[0]?.message?.content || "{}";

  const cleanedResponse = responseText
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  return JSON.parse(cleanedResponse) as AnalyzedProfile;
}

async function generateHTML(
  analyzedProfile: AnalyzedProfile,
  profile: InstagramProfile,
  media: InstagramMedia[]
): Promise<string> {
  // Filter usable images and create proxy URLs
  const galleryImages = media
    .filter((m) => m.media_url && (m.media_type === "IMAGE" || m.media_type === "CAROUSEL_ALBUM"))
    .slice(0, 9);

  const profilePicUrl = getDirectUrl(profile.profile_picture_url);
  const heroImageUrl = galleryImages[0] ? getDirectUrl(galleryImages[0].media_url) : "";

  const galleryList = galleryImages
    .map((m, i) => `${i + 1}. URL: ${getDirectUrl(m.media_url)} | Link: ${m.permalink}`)
    .join("\n");

  const htmlPrompt = `Genera una landing page HTML de ALTA CALIDAD para un portfolio profesional.

DATOS DEL PERFIL:
${JSON.stringify(analyzedProfile, null, 2)}

DATOS DE INSTAGRAM:
- Nombre: ${profile.name || profile.username}
- Username: @${profile.username}
- Foto de perfil: ${profilePicUrl}
- Instagram: https://instagram.com/${profile.username}
- Seguidores: ${profile.followers_count || "N/A"}
- Posts: ${profile.media_count || "N/A"}

IMAGEN PARA HERO (usar como background):
${heroImageUrl}

IMÁGENES PARA GALERÍA (usar estas URLs exactas con sus links):
${galleryList}

REQUISITOS DE DISEÑO OBLIGATORIOS:

1. ESTÉTICA MODERNA 2025:
   - Diseño minimalista y elegante tipo Squarespace/Wix premium
   - Espaciado generoso (mucho white space)
   - Bordes redondeados sutiles (border-radius: 12-20px)
   - Sombras suaves (box-shadow con blur alto y opacidad baja)
   - Transiciones CSS en hover (transform, opacity)

2. PALETA DE COLORES:
   - Fondo principal: #fafafa o similar (off-white)
   - Texto principal: #1a1a1a (casi negro)
   - Texto secundario: #666666
   - Acento: elegir UN color que combine con el estilo "${analyzedProfile.style}"
   - Usar el color acento solo en CTAs y detalles pequeños

3. TIPOGRAFÍA:
   - Importar Google Fonts: 'poppins' para texto, 'poppins' para títulos
   - Títulos: font-weight 600-700, tamaño grande (2.5-4rem)
   - Cuerpo: font-weight 400, tamaño 1rem-1.125rem, line-height 1.6

4. ESTRUCTURA DE SECCIONES:

   HERO (100vh altura):
   - Imagen de fondo usando la URL del hero proporcionada con overlay oscuro semitransparente (rgba(0,0,0,0.4))
   - Nombre grande centrado en blanco
   - Tagline debajo
   - Flecha animada indicando scroll (usar CSS animation) centrada en el medio del viewport

   SOBRE MÍ:
   - Layout de dos columnas en desktop (foto perfil a la izquierda, texto a la derecha)
   - Foto de perfil circular grande (200px) con borde sutil
   - Bio completa del perfil analizado
   - Badges/pills con las ubicaciones: ${analyzedProfile.locations.join(", ")}
   - Mostrar seguidores y posts como social proof

   SERVICIOS:
   - Grid de 3 columnas en desktop, 1 en mobile
   - Cada servicio en una card con emoji como ícono
   - Hover effect sutil (translateY -5px, shadow más grande)

   GALERÍA/PORTFOLIO:
   - Título "Portfolio" o "Mis Trabajos"
   - Grid de 3 columnas (máximo 9 imágenes)
   - Imágenes cuadradas con aspect-ratio: 1 y object-fit: cover
   - Hover: scale(1.03) y overlay semitransparente con ícono
   - Cada imagen es un link <a> al permalink de Instagram correspondiente

   CONTACTO/CTA:
   - Sección con fondo del color acento
   - Texto blanco centrado
   - Botón grande "Sígueme en Instagram" que va a https://instagram.com/${profile.username}

   FOOTER:
   - Simple, fondo oscuro (#1a1a1a), texto gris claro
   - Copyright con el nombre con año 2025
   - Link a Instagram

5. RESPONSIVE:
   - Mobile first con breakpoints en 768px y 1024px
   - En mobile: una columna, galería en grid de 3 columnas más pequeño
   - Padding menor en mobile (1rem vs 4rem)

6. CSS ESPECIAL:
   - html { scroll-behavior: smooth; }
   - Todas las imágenes con loading="lazy"
   - Imágenes de galería: aspect-ratio: 1; object-fit: cover;
   - Transiciones suaves: transition: all 0.3s ease;

7. META TAGS SEO:
   - <title>${analyzedProfile.business_name} | ${analyzedProfile.category}</title>
   - Meta description con la bio
   - Keywords: ${analyzedProfile.keywords_seo.join(", ")}
   - Open Graph completo (og:title, og:description, og:image)

IMPORTANTE:
- Usa EXACTAMENTE las URLs de imágenes proporcionadas, no las modifiques
- El HTML debe empezar con <!DOCTYPE html> y terminar con </html>
- No incluyas JavaScript, solo HTML y CSS
- Todo el CSS debe estar en un <style> tag dentro del <head>

RESPONDE ÚNICAMENTE CON EL CÓDIGO HTML COMPLETO.
No incluyas explicaciones, comentarios ni markdown.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Eres un experto desarrollador web frontend. Generas código HTML/CSS de alta calidad, moderno, semántico y responsive. Sigues las mejores prácticas de diseño web 2024. Responde ÚNICAMENTE con código HTML válido, sin explicaciones ni markdown.",
      },
      { role: "user", content: htmlPrompt },
    ],
    temperature: 0.7,
    max_tokens: 8192,
  });

  let html = completion.choices[0]?.message?.content || "";

  // Clean up any markdown formatting
  html = html.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();

  // Ensure it starts with DOCTYPE
  if (!html.toLowerCase().startsWith("<!doctype html>")) {
    const doctypeIndex = html.toLowerCase().indexOf("<!doctype html>");
    if (doctypeIndex > 0) {
      html = html.substring(doctypeIndex);
    }
  }

  return html;
}

export async function POST(request: NextRequest) {
  const totalStart = Date.now();

  try {
    const parseStart = Date.now();
    const body = await request.json();
    const { profile, media } = body as {
      profile: InstagramProfile;
      media: InstagramMedia[];
    };
    console.log(`⏱️ [1] Parse request body: ${Date.now() - parseStart}ms`);

    if (!profile || !media) {
      return NextResponse.json(
        { error: "profile and media are required" },
        { status: 400 }
      );
    }

    // Step 1: Analyze profile with AI
    const analyzeStart = Date.now();
    let analyzedProfile: AnalyzedProfile;
    try {
      analyzedProfile = await analyzeProfile(profile, media);
    } catch (parseError) {
      console.error("First attempt failed, retrying...", parseError);
      analyzedProfile = await analyzeProfile(profile, media);
    }
    console.log(`⏱️ [2] Analyze profile (OpenAI gpt-4o-mini): ${Date.now() - analyzeStart}ms`);

    // Step 2: Generate HTML with AI
    const htmlStart = Date.now();
    const generatedHtml = await generateHTML(analyzedProfile, profile, media);
    console.log(`⏱️ [3] Generate HTML (OpenAI gpt-4o-mini): ${Date.now() - htmlStart}ms`);

    const totalTime = Date.now() - totalStart;
    console.log(`⏱️ [TOTAL] Generate website completed in: ${totalTime}ms (${(totalTime / 1000).toFixed(1)}s)`);

    return NextResponse.json({
      analyzed_profile: analyzedProfile,
      generated_html: generatedHtml,
      instagram_data: {
        profile,
        media,
      },
      generated_at: new Date().toISOString(),
      timing: {
        total_ms: totalTime,
        total_seconds: (totalTime / 1000).toFixed(1),
      },
    });
  } catch (err) {
    console.error("Error generating website:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
