# Vercel Subdomain Configuration

This project uses Vercel's API to automatically create subdomains for each generated site (e.g., `nombrenegocio.vercel.app`).

## Setup Instructions

### 1. Get Your Vercel API Token

1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "Socialweb Subdomain Manager")
4. Set the scope to your account or team
5. Copy the generated token

### 2. Get Your Project ID

1. Go to your Vercel project dashboard
2. Click on "Settings"
3. Under "General", you'll find your **Project ID**
4. Copy it

### 3. (Optional) Get Your Team ID

Only required if you're using a team account:

1. Go to your team settings
2. Find your **Team ID** in the URL or settings
3. Copy it

### 4. Add Environment Variables

Add these to your Vercel project environment variables:

```bash
VERCEL_API_TOKEN=your_vercel_api_token_here
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx
VERCEL_TEAM_ID=team_xxxxxxxxxxxxx  # Optional
NEXT_PUBLIC_BASE_DOMAIN=vercel.app
```

Also add them to your local `.env.local` file for development.

### 5. Redeploy

After adding the environment variables, redeploy your project for the changes to take effect.

## How It Works

### Site Creation Flow

1. User connects Instagram account
2. User generates their website
3. User clicks "Publicar"
4. Backend:
   - Generates a unique slug from business name (e.g., "cof-bar")
   - Calls Vercel API to add `cof-bar.vercel.app` subdomain
   - Saves site to Supabase with `subdomain` field
   - Returns `https://cof-bar.vercel.app` as the primary URL

### Request Routing

When a request comes to `nombrenegocio.vercel.app`:

1. Middleware detects it's a subdomain
2. Rewrites the request to `/sitio/[slug]`
3. Page fetches site data from Supabase by slug
4. Returns the generated HTML

### Fallback

If Vercel API fails or subdomain isn't set:
- Sites are still accessible via `https://your-app.vercel.app/sitio/slug`
- This URL is returned as `fallback_url` in the API response

## Files Modified

- [src/middleware.ts](src/middleware.ts) - Hostname detection and rewriting
- [src/lib/vercel.ts](src/lib/vercel.ts) - Vercel API integration
- [src/lib/sites.ts](src/lib/sites.ts) - Added subdomain CRUD operations
- [src/app/api/sites/route.ts](src/app/api/sites/route.ts) - Subdomain creation on publish
- [src/types/database.ts](src/types/database.ts) - Added subdomain field to types

## API Response

When publishing a site, the API now returns:

```json
{
  "success": true,
  "site": {
    "id": "...",
    "slug": "cof-bar",
    "subdomain": "cof-bar",
    "url": "https://cof-bar.vercel.app",
    "fallback_url": "https://socialweb.vercel.app/sitio/cof-bar",
    "business_name": "Cof & Bar",
    "category": "Coffee Shop",
    "created_at": "2025-12-23T..."
  }
}
```

## Troubleshooting

### Domain Already Exists Error

If you see a "domain already exists" error, it means the subdomain is already assigned to this project. This is handled gracefully - the code will continue and use the existing subdomain.

### API Token Issues

- Make sure your token has the correct scope
- Verify it's not expired
- Check that it has permissions to manage domains for your project

### Subdomain Not Working

1. Check that the domain was added in Vercel dashboard (Settings → Domains)
2. Verify the middleware is detecting the hostname correctly
3. Check that the site exists in Supabase with the correct subdomain value

## Local Development

For local development:
- Subdomains won't work on `localhost`
- Use the fallback URL: `http://localhost:3000/sitio/[slug]`
- Test subdomain routing in production or preview deployments
