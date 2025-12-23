import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  InstagramProfile,
  InstagramMedia,
  AnalyzedProfile,
  BusinessCategory
} from "@/types/instagram";
import {
  CATEGORY_CONFIGS,
  detectCategory,
  getCategoryAnalysisPrompt
} from "@/config/categories";
import { getTemplatePrompt } from "@/config/templates";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getProxiedUrl(originalUrl: string | null): string {
  if (!originalUrl) return "";

  // Use our proxy endpoint to serve Instagram images
  // This fixes the "Bad URL hash" error from Instagram CDN
  const encodedUrl = encodeURIComponent(originalUrl);
  return `/api/proxy-image?url=${encodedUrl}`;
}

async function analyzeProfile(
  profile: InstagramProfile,
  media: InstagramMedia[]
): Promise<AnalyzedProfile> {
  // Pre-detect category using keyword-based detection
  const captions = media.slice(0, 15).map(m => m.caption || '').filter(Boolean);
  const detectedCategory = detectCategory(
    profile.biography || '',
    captions,
    profile.account_type
  );
  
  const categoryConfig = CATEGORY_CONFIGS[detectedCategory];
  const categoryFieldsExample = getCategoryAnalysisPrompt(detectedCategory);

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
  "business_name": "${profile.name || profile.username}",
  "tagline": "frase corta que describe lo que hace (máximo 10 palabras)",
  "bio": "descripción profesional de 2-3 oraciones basada en la bio y contenido",
  "keywords_seo": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "locations": ["ubicación 1", "ubicación 2"],
  "style": "descripción del estilo visual/artístico en una oración",
  "target_audience": "descripción del público objetivo",
  "category": "MUST be exactly one of: 'photographer', 'restaurant', 'ecommerce', 'professional_services', 'wellness', 'crafts', 'other'",
${categoryFieldsExample}
}

IMPORTANTE:
- El campo "business_name" DEBE ser exactamente "${profile.name || profile.username}" - NO lo modifiques ni inventes otro nombre.
- El campo "category" debe ser exactamente uno de los valores especificados en inglés.
- Basándote en el análisis, este perfil parece ser de tipo: ${categoryConfig.displayName}
- Incluye los campos adicionales específicos para esta categoría como se muestra arriba.`;

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

  const parsed = JSON.parse(cleanedResponse);

  // Force business_name to be the actual profile name
  const correctName = profile.name || profile.username || '';
  if (parsed.business_name !== correctName) {
    parsed.business_name = correctName;
  }

  // Validate category - if invalid, use our detected category
  if (!Object.values(BusinessCategory).includes(parsed.category)) {
    console.warn(`Invalid category returned by AI: ${parsed.category}, using detected: ${detectedCategory}`);
    parsed.category = detectedCategory;
  }

  return parsed as AnalyzedProfile;
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

  const profilePicUrl = getProxiedUrl(profile.profile_picture_url);
  const heroImageUrl = galleryImages[0] ? getProxiedUrl(galleryImages[0].media_url) : "";

  const galleryList = galleryImages
    .map((m, i) => `${i + 1}. URL: ${getProxiedUrl(m.media_url)} | Link: ${m.permalink}`)
    .join("\n");

  // Get category-specific prompt template
  const htmlPrompt = getTemplatePrompt(
    analyzedProfile,
    profile,
    media,
    galleryList,
    heroImageUrl,
    profilePicUrl
  );

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
