import { NextRequest, NextResponse } from 'next/server';
import { createSite, generateUniqueSlug } from '@/lib/sites';
import type { AnalyzedProfile } from '@/types/instagram';

interface CreateSiteRequestBody {
  html: string;
  instagram_username: string;
  instagram_user_id: string;
  analyzed_profile: AnalyzedProfile;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateSiteRequestBody;
    const { html, instagram_username, instagram_user_id, analyzed_profile } = body;

    // Validate required fields
    if (!html || html.trim().length === 0) {
      return NextResponse.json(
        { error: 'HTML content is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!analyzed_profile || !analyzed_profile.business_name) {
      return NextResponse.json(
        { error: 'analyzed_profile with business_name is required' },
        { status: 400 }
      );
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(analyzed_profile.business_name);

    // Create site
    const site = await createSite({
      slug,
      html,
      instagram_username: instagram_username || undefined,
      instagram_user_id: instagram_user_id || undefined,
      business_name: analyzed_profile.business_name,
      category: analyzed_profile.category,
      tagline: analyzed_profile.tagline,
      bio: analyzed_profile.bio,
    });

    // Build site URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const siteUrl = `${baseUrl}/sitio/${slug}`;

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        slug: site.slug,
        url: siteUrl,
        business_name: site.business_name,
        category: site.category,
        created_at: site.created_at,
      },
    });
  } catch (err) {
    console.error('Error creating site:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    return NextResponse.json(
      { error: `Failed to create site: ${errorMessage}` },
      { status: 500 }
    );
  }
}
