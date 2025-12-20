import { NextRequest, NextResponse } from "next/server";

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

interface FullProfileResponse {
  profile: InstagramProfile;
  media: InstagramMedia[];
  access_token: string;
  fetched_at: string;
}

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.json(
      { error: "access_token is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch user profile
    const profileFields = [
      "user_id",
      "username",
      "name",
      "biography",
      "website",
      "profile_picture_url",
      "followers_count",
      "follows_count",
      "media_count",
      "account_type",
    ].join(",");

    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=${profileFields}&access_token=${accessToken}`
    );
    const profileData = await profileResponse.json();

    if (profileData.error) {
      return NextResponse.json(
        { error: profileData.error.message, details: profileData.error },
        { status: 400 }
      );
    }

    // Fetch user media (last 25 posts)
    const mediaFields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "thumbnail_url",
      "permalink",
      "timestamp",
    ].join(",");

    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=${mediaFields}&limit=25&access_token=${accessToken}`
    );
    const mediaData = await mediaResponse.json();

    // Build profile object with null fallbacks
    const profile: InstagramProfile = {
      user_id: profileData.user_id ?? profileData.id ?? null,
      username: profileData.username ?? null,
      name: profileData.name ?? null,
      biography: profileData.biography ?? null,
      website: profileData.website ?? null,
      profile_picture_url: profileData.profile_picture_url ?? null,
      followers_count: profileData.followers_count ?? null,
      follows_count: profileData.follows_count ?? null,
      media_count: profileData.media_count ?? null,
      account_type: profileData.account_type ?? null,
    };

    // Build media array with null fallbacks
    const media: InstagramMedia[] = (mediaData.data || []).map(
      (item: Record<string, unknown>) => ({
        id: item.id as string,
        caption: (item.caption as string) ?? null,
        media_type: item.media_type as "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM",
        media_url: (item.media_url as string) ?? null,
        thumbnail_url: (item.thumbnail_url as string) ?? null,
        permalink: (item.permalink as string) ?? null,
        timestamp: (item.timestamp as string) ?? null,
      })
    );

    const response: FullProfileResponse = {
      profile,
      media,
      access_token: accessToken,
      fetched_at: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
