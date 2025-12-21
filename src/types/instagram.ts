export interface InstagramProfile {
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

export interface InstagramMedia {
  id: string;
  caption: string | null;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string | null;
  thumbnail_url: string | null;
  permalink: string | null;
  timestamp: string | null;
}

export interface FullProfileData {
  profile: InstagramProfile;
  media: InstagramMedia[];
  access_token: string;
  fetched_at: string;
}

export interface AnalyzedProfile {
  business_name: string;
  tagline: string;
  bio: string;
  services: string[];
  keywords_seo: string[];
  locations: string[];
  style: string;
  target_audience: string;
  category: string;
}

export interface GeneratedWebsite {
  analyzed_profile: AnalyzedProfile;
  generated_html: string;
  generated_at: string;
}
