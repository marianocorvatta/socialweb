import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch user profile using LinkedIn v2 API
    const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      throw new Error(errorData.message || "Failed to fetch LinkedIn profile");
    }

    const profileData = await profileResponse.json();

    // Response structure from LinkedIn OpenID Connect:
    // {
    //   "sub": "unique_user_id",
    //   "name": "Full Name",
    //   "given_name": "First Name",
    //   "family_name": "Last Name",
    //   "email": "user@example.com",
    //   "email_verified": true,
    //   "picture": "https://media.licdn.com/dms/image/...",
    //   "locale": "en-US"
    // }

    return NextResponse.json({
      success: true,
      profile: {
        id: profileData.sub,
        name: profileData.name,
        given_name: profileData.given_name,
        family_name: profileData.family_name,
        email: profileData.email,
        email_verified: profileData.email_verified,
        picture: profileData.picture,
        locale: profileData.locale,
      },
    });
  } catch (err) {
    console.error("LinkedIn profile fetch error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to fetch LinkedIn profile: ${errorMessage}` },
      { status: 500 }
    );
  }
}
