export interface Site {
  id: string;
  slug: string;
  html: string;
  instagram_username: string | null;
  instagram_user_id: string | null;
  business_name: string | null;
  category: string | null;
  tagline: string | null;
  bio: string | null;
  subdomain: string | null;
  custom_domain: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSiteInput {
  slug: string;
  html: string;
  instagram_username?: string;
  instagram_user_id?: string;
  business_name?: string;
  category?: string;
  tagline?: string;
  bio?: string;
  subdomain?: string;
}

export interface UpdateSiteInput {
  html?: string;
  business_name?: string;
  category?: string;
  tagline?: string;
  bio?: string;
  subdomain?: string;
  custom_domain?: string;
  is_published?: boolean;
}
