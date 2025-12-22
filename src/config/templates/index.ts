import { AnalyzedProfile, InstagramProfile, InstagramMedia, BusinessCategory } from '@/types/instagram';
import { generatePhotographerPrompt } from './photographer';
import { generateRestaurantPrompt } from './restaurant';
import { generateEcommercePrompt } from './ecommerce';
import { generateProfessionalServicesPrompt } from './professional_services';
import { generateWellnessPrompt } from './wellness';
import { generateCraftsPrompt } from './crafts';
import { generateOtherPrompt } from './other';

export function getTemplatePrompt(
  analyzedProfile: AnalyzedProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  const category = analyzedProfile.category;

  switch (category) {
    case BusinessCategory.PHOTOGRAPHER:
      return generatePhotographerPrompt(
        analyzedProfile,
        profile,
        media,
        galleryList,
        heroImageUrl,
        profilePicUrl
      );

    case BusinessCategory.RESTAURANT:
      return generateRestaurantPrompt(
        analyzedProfile,
        profile,
        media,
        galleryList,
        heroImageUrl,
        profilePicUrl
      );

    case BusinessCategory.ECOMMERCE:
      return generateEcommercePrompt(
        analyzedProfile,
        profile,
        media,
        galleryList,
        heroImageUrl,
        profilePicUrl
      );

    case BusinessCategory.PROFESSIONAL_SERVICES:
      return generateProfessionalServicesPrompt(
        analyzedProfile,
        profile,
        media,
        galleryList,
        heroImageUrl,
        profilePicUrl
      );

    case BusinessCategory.WELLNESS:
      return generateWellnessPrompt(
        analyzedProfile,
        profile,
        media,
        galleryList,
        heroImageUrl,
        profilePicUrl
      );

    case BusinessCategory.CRAFTS:
      return generateCraftsPrompt(
        analyzedProfile,
        profile,
        media,
        galleryList,
        heroImageUrl,
        profilePicUrl
      );

    case BusinessCategory.OTHER:
    default:
      return generateOtherPrompt(
        analyzedProfile,
        profile,
        media,
        galleryList,
        heroImageUrl,
        profilePicUrl
      );
  }
}

export {
  generatePhotographerPrompt,
  generateRestaurantPrompt,
  generateEcommercePrompt,
  generateProfessionalServicesPrompt,
  generateWellnessPrompt,
  generateCraftsPrompt,
  generateOtherPrompt,
};
