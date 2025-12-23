import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    console.error("LinkedIn OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/?error=${encodeURIComponent(
        errorDescription || error
      )}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/?error=${encodeURIComponent(
        "No authorization code received"
      )}`
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/linkedin/callback`,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(
        tokenData.error_description || tokenData.error || "Failed to get access token"
      );
    }

    const accessToken = tokenData.access_token;

    // Redirect to LinkedIn profile page with token
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/linkedin-profile?token=${accessToken}`
    );
  } catch (err) {
    console.error("LinkedIn callback error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/?error=${encodeURIComponent(
        `LinkedIn authentication failed: ${errorMessage}`
      )}`
    );
  }
}
