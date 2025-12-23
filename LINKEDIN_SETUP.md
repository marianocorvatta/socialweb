# LinkedIn OAuth Setup Guide

This guide explains how to configure LinkedIn OAuth authentication for the Winsta application.

## Prerequisites

- LinkedIn account (personal account is sufficient)
- Access to LinkedIn Developer Portal

## Step 1: Create a LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click **"Create app"**
3. Fill in the required information:
   - **App name**: Winsta (or your preferred name)
   - **LinkedIn Page**: Select the default company page for individual developers
   - **App logo**: Upload your app logo
   - **Legal agreement**: Check the box to agree

## Step 2: Configure OAuth Settings

### Add Products

1. In your app dashboard, go to the **Products** tab
2. Request access to these products:
   - **Sign In with LinkedIn using OpenID Connect** (Standard Tier) - Usually auto-approved
   - **Share on LinkedIn** (Default Tier) - Optional, for future features

### Configure Redirect URLs

1. Go to the **Auth** tab
2. Under **OAuth 2.0 settings**, find **Authorized redirect URLs for your app**
3. Add these URLs:

**For Development:**
```
http://localhost:3000/api/auth/linkedin/callback
```

**For Production:**
```
https://your-domain.vercel.app/api/auth/linkedin/callback
```

Replace `your-domain.vercel.app` with your actual production URL.

### Copy Credentials

1. In the **Auth** tab, you'll find:
   - **Client ID**: Copy this value
   - **Client Secret**: Click "Show" and copy this value

## Step 3: Add Environment Variables

Add the following to your `.env.local` file:

```bash
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

For production deployment on Vercel:
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add both `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`
4. Redeploy your application

## Step 4: Configure OAuth Scopes

The application requests these scopes:
- `openid` - Required for OpenID Connect
- `profile` - Access to basic profile information (name)
- `email` - Access to user's email address
- `w_member_social` - Share content on LinkedIn (optional for future features)

These scopes are configured in the code at [/src/app/api/auth/linkedin/route.ts](src/app/api/auth/linkedin/route.ts:7).

## Available LinkedIn Data

With the current setup, you can access:

```typescript
{
  id: string;           // Unique LinkedIn user ID
  name: string;         // Full name
  given_name: string;   // First name
  family_name: string;  // Last name
  email: string;        // Email address
  email_verified: boolean;
  picture: string;      // Profile picture URL
  locale: string;       // User's locale (e.g., "en-US")
}
```

**Note:** With the free tier (Standard Access), you only get basic profile information via OpenID Connect. Advanced data (work history, skills, recommendations) requires LinkedIn Partner Program approval.

## How It Works

### OAuth Flow

1. User clicks "Conectar con LinkedIn" button on the landing page
2. Redirects to `/api/auth/linkedin` which initiates OAuth flow
3. LinkedIn shows authorization screen
4. User approves
5. LinkedIn redirects to `/api/auth/linkedin/callback` with authorization code
6. Callback exchanges code for access token
7. User is redirected to `/linkedin-profile` with access token
8. Profile page fetches LinkedIn data via `/api/linkedin/profile`

### Files Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── linkedin/
│   │   │       ├── route.ts           # Initiates OAuth
│   │   │       └── callback/
│   │   │           └── route.ts       # Handles callback
│   │   └── linkedin/
│   │       └── profile/
│   │           └── route.ts           # Fetches profile data
│   └── linkedin-profile/
│       └── page.tsx                   # Profile display page
└── components/
    └── landing/
        └── LinkedInConnectButton.tsx  # Connect button
```

## Integration with Instagram Data

The LinkedIn OAuth is set up as a complementary data source to enrich website generation:

- **Instagram**: Provides business profile, media, followers, bio
- **LinkedIn**: Provides professional information (name, email, profile picture)

In future iterations, you could combine both data sources to create more comprehensive professional websites, especially for consultants and service providers.

## Troubleshooting

### "redirect_uri_mismatch" error
- Make sure the redirect URL in LinkedIn app settings exactly matches the one in your code
- Check for trailing slashes (they matter!)
- Use `http://localhost:3000` for local development (not `https://`)

### "invalid_client" error
- Verify your Client ID and Client Secret are correct
- Make sure there are no extra spaces or quotes in `.env.local`

### "insufficient_scope" error
- Check that your app has the required products enabled
- Wait a few minutes after enabling products (can take time to propagate)

### Can't access work history or education
- This data requires LinkedIn Partner Program approval
- The free tier only provides basic OpenID Connect data
- Consider applying for Partner Program if you need advanced data

## Testing

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Conectar con LinkedIn"
4. Authorize the app
5. You should see your LinkedIn profile data

## Security Notes

- Never commit `.env.local` to version control (already in `.gitignore`)
- Store credentials securely in Vercel environment variables for production
- The access token is passed via URL parameter for simplicity - consider using sessions for production
- Tokens expire after a certain time (typically 60 days for LinkedIn)

## Next Steps

To fully integrate LinkedIn data into website generation:

1. Store LinkedIn profile data in Zustand store (similar to Instagram)
2. Merge LinkedIn + Instagram data before sending to AI
3. Update website generation prompts to use professional info from LinkedIn
4. Create specialized templates for professional services using LinkedIn data
