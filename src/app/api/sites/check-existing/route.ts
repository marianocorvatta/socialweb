import { NextRequest, NextResponse } from 'next/server';
import { getSiteByInstagramUserId } from '@/lib/sites';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instagramUserId = searchParams.get('instagram_user_id');

    if (!instagramUserId) {
      return NextResponse.json(
        { error: 'instagram_user_id is required' },
        { status: 400 }
      );
    }

    const site = await getSiteByInstagramUserId(instagramUserId);

    if (!site) {
      return NextResponse.json(
        { success: false, message: 'No site found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        slug: site.slug,
        subdomain: site.subdomain,
        html: site.html,
        business_name: site.business_name,
        category: site.category,
        created_at: site.created_at,
        is_published: site.is_published,
      },
    });
  } catch (err) {
    console.error('Error checking existing site:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    return NextResponse.json(
      { error: `Failed to check existing site: ${errorMessage}` },
      { status: 500 }
    );
  }
}
