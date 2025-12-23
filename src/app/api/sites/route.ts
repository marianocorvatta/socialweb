import { NextRequest, NextResponse } from 'next/server';
import { createSite, generateUniqueSlug, getSiteByInstagramUserId, updateSite } from '@/lib/sites';
import { findAvailableSubdomain } from '@/lib/vercel';
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

    // Check if site already exists for this Instagram user ID
    let site;
    let subdomain: string | undefined;

    if (instagram_user_id) {
      const existingSite = await getSiteByInstagramUserId(instagram_user_id);

      if (existingSite) {
        // Update existing site - only change subdomain if business name actually changed
        const businessNameChanged = analyzed_profile.business_name !== existingSite.business_name;

        if (businessNameChanged) {
          // Business name changed - need new subdomain
          const newSlug = await generateUniqueSlug(analyzed_profile.business_name);
          const availableSubdomain = await findAvailableSubdomain(newSlug);

          if (!availableSubdomain) {
            return NextResponse.json(
              { error: 'Could not find an available subdomain for the new business name.' },
              { status: 409 }
            );
          }

          subdomain = availableSubdomain;

          // Update with new subdomain
          site = await updateSite(existingSite.slug, {
            html,
            business_name: analyzed_profile.business_name,
            category: analyzed_profile.category,
            tagline: analyzed_profile.tagline,
            bio: analyzed_profile.bio,
            subdomain,
          });
        } else {
          // Business name didn't change - reuse existing subdomain
          site = await updateSite(existingSite.slug, {
            html,
            business_name: analyzed_profile.business_name,
            category: analyzed_profile.category,
            tagline: analyzed_profile.tagline,
            bio: analyzed_profile.bio,
          });
          subdomain = existingSite.subdomain || undefined;
        }
      } else {
        // Create new site with new subdomain
        const slug = await generateUniqueSlug(analyzed_profile.business_name);

        // Find an available subdomain (tries slug, slug-1, slug-2, etc.)
        const availableSubdomain = await findAvailableSubdomain(slug);

        if (!availableSubdomain) {
          return NextResponse.json(
            { error: 'Could not find an available subdomain. Please try a different business name.' },
            { status: 409 }
          );
        }

        subdomain = availableSubdomain;

        site = await createSite({
          slug,
          html,
          instagram_username: instagram_username || undefined,
          instagram_user_id: instagram_user_id || undefined,
          business_name: analyzed_profile.business_name,
          category: analyzed_profile.category,
          tagline: analyzed_profile.tagline,
          bio: analyzed_profile.bio,
          subdomain,
        });
      }
    } else {
      // No instagram_user_id, create new site
      const slug = await generateUniqueSlug(analyzed_profile.business_name);

      // Find an available subdomain (tries slug, slug-1, slug-2, etc.)
      const availableSubdomain = await findAvailableSubdomain(slug);

      if (!availableSubdomain) {
        return NextResponse.json(
          { error: 'Could not find an available subdomain. Please try a different business name.' },
          { status: 409 }
        );
      }

      subdomain = availableSubdomain;

      site = await createSite({
        slug,
        html,
        instagram_username: instagram_username || undefined,
        instagram_user_id: instagram_user_id || undefined,
        business_name: analyzed_profile.business_name,
        category: analyzed_profile.category,
        tagline: analyzed_profile.tagline,
        bio: analyzed_profile.bio,
        subdomain,
      });
    }

    // Build site URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const siteUrl = `${baseUrl}/sitio/${site.slug}`;

    // Use subdomain URL if available
    const subdomainUrl = subdomain ? `https://${subdomain}.vercel.app` : null;
    const primaryUrl = subdomainUrl || siteUrl;

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        slug: site.slug,
        subdomain: site.subdomain,
        url: primaryUrl,
        fallback_url: siteUrl,
        business_name: site.business_name,
        category: site.category,
        created_at: site.created_at,
      },
    });
  } catch (err) {
    console.error('Error creating/updating site:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    return NextResponse.json(
      { error: `Failed to create/update site: ${errorMessage}` },
      { status: 500 }
    );
  }
}
