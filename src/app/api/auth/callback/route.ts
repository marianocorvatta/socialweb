import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  if (error) {
    const errorData = {
      error,
      error_reason: searchParams.get("error_reason"),
      error_description: searchParams.get("error_description"),
    };
    return NextResponse.redirect(
      `${baseUrl}/?error=${encodeURIComponent(JSON.stringify(errorData))}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=No code received`);
  }

  // Exchange code for access token
  const tokenResponse = await fetch(
    "https://api.instagram.com/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: "authorization_code",
        redirect_uri: `${baseUrl}/api/auth/callback`,
        code,
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  if (tokenData.error_message) {
    return NextResponse.redirect(
      `${baseUrl}/?error=${encodeURIComponent(tokenData.error_message)}`
    );
  }

  // Redirect to home with access_token to fetch full profile
  return NextResponse.redirect(
    `${baseUrl}/?token=${encodeURIComponent(tokenData.access_token)}`
  );
}
