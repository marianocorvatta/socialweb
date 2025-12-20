import { NextRequest } from "next/server";

// Simple in-memory cache (will reset on server restart, fine for POC)
const imageCache = new Map<string, { data: ArrayBuffer; contentType: string; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Placeholder SVG for failed images
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#f3f4f6"/>
  <text x="200" y="200" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui" font-size="14">
    Imagen no disponible
  </text>
</svg>`;

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get("url");

  if (!imageUrl) {
    return new Response(PLACEHOLDER_SVG, {
      status: 400,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  try {
    const decodedUrl = decodeURIComponent(imageUrl);

    // Check cache
    const cached = imageCache.get(decodedUrl);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return new Response(cached.data, {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Fetch the image with browser-like headers
    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.instagram.com/",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    // Cache the image
    imageCache.set(decodedUrl, {
      data: arrayBuffer,
      contentType,
      timestamp: Date.now(),
    });

    // Clean old cache entries (keep max 100 images)
    if (imageCache.size > 100) {
      const oldestKey = imageCache.keys().next().value;
      if (oldestKey) imageCache.delete(oldestKey);
    }

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Proxy image error:", error);
    return new Response(PLACEHOLDER_SVG, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60",
      },
    });
  }
}
