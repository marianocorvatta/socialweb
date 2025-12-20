import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const htmlBase64 = request.nextUrl.searchParams.get("html");

  if (!htmlBase64) {
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body style="font-family: sans-serif; padding: 2rem; text-align: center;">
  <h1>Error</h1>
  <p>No HTML content provided</p>
</body>
</html>`,
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  try {
    const html = Buffer.from(htmlBase64, "base64").toString("utf-8");

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body style="font-family: sans-serif; padding: 2rem; text-align: center;">
  <h1>Error</h1>
  <p>Failed to decode HTML content</p>
</body>
</html>`,
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}
