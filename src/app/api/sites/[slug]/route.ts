import { NextRequest, NextResponse } from 'next/server';
import { getSiteBySlug } from '@/lib/sites';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const site = await getSiteBySlug(slug);

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        slug: site.slug,
        html: site.html,
        instagram_username: site.instagram_username,
        instagram_user_id: site.instagram_user_id,
        business_name: site.business_name,
        category: site.category,
        tagline: site.tagline,
        bio: site.bio,
        custom_domain: site.custom_domain,
        is_published: site.is_published,
        created_at: site.created_at,
        updated_at: site.updated_at,
      },
    });
  } catch (err) {
    console.error('Error fetching site:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    return NextResponse.json(
      { error: `Failed to fetch site: ${errorMessage}` },
      { status: 500 }
    );
  }
}
