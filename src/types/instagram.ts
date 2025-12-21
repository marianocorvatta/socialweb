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

// Category enum for business types
export enum BusinessCategory {
  PHOTOGRAPHER = 'photographer',
  RESTAURANT = 'restaurant',
  ECOMMERCE = 'ecommerce',
  PROFESSIONAL_SERVICES = 'professional_services',
  WELLNESS = 'wellness',
  CRAFTS = 'crafts',
  OTHER = 'other'
}

// Category configuration
export interface CategoryConfig {
  id: BusinessCategory;
  displayName: string;
  keywords: string[];
  sections: string[];
  analysisFields: string[];
}

// Base profile with common fields
export interface BaseAnalyzedProfile {
  business_name: string;
  tagline: string;
  bio: string;
  keywords_seo: string[];
  locations: string[];
  style: string;
  target_audience: string;
  category: BusinessCategory;
}

// Category-specific profile interfaces
export interface PhotographerProfile extends BaseAnalyzedProfile {
  category: BusinessCategory.PHOTOGRAPHER;
  portfolio_focus: string[];
  packages: string[];
  specialties: string[];
}

export interface RestaurantProfile extends BaseAnalyzedProfile {
  category: BusinessCategory.RESTAURANT;
  cuisine_type: string;
  menu_highlights: string[];
  dining_options: string[];
  price_range: string;
}

export interface EcommerceProfile extends BaseAnalyzedProfile {
  category: BusinessCategory.ECOMMERCE;
  product_categories: string[];
  shipping_info: string;
  featured_products: string[];
}

export interface ProfessionalServicesProfile extends BaseAnalyzedProfile {
  category: BusinessCategory.PROFESSIONAL_SERVICES;
  services_offered: string[];
  credentials: string[];
  consultation_type: string;
}

export interface WellnessProfile extends BaseAnalyzedProfile {
  category: BusinessCategory.WELLNESS;
  specialties: string[];
  class_types: string[];
  certifications: string[];
}

export interface CraftsProfile extends BaseAnalyzedProfile {
  category: BusinessCategory.CRAFTS;
  craft_type: string;
  techniques: string[];
  custom_orders: boolean;
}

export interface OtherProfile extends BaseAnalyzedProfile {
  category: BusinessCategory.OTHER;
  services: string[];
}

// Union type for all profile types
export type AnalyzedProfile = 
  | PhotographerProfile 
  | RestaurantProfile 
  | EcommerceProfile 
  | ProfessionalServicesProfile
  | WellnessProfile
  | CraftsProfile
  | OtherProfile;

export interface GeneratedWebsite {
  analyzed_profile: AnalyzedProfile;
  generated_html: string;
  generated_at: string;
}
