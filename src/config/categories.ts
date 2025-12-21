import { BusinessCategory, CategoryConfig } from '@/types/instagram';

export const CATEGORY_CONFIGS: Record<BusinessCategory, CategoryConfig> = {
  [BusinessCategory.PHOTOGRAPHER]: {
    id: BusinessCategory.PHOTOGRAPHER,
    displayName: 'Photographer/Creator',
    keywords: [
      'photo', 'photography', 'photographer', 'portrait', 'wedding', 'event',
      'shoot', 'camera', 'visual', 'creator', 'content creator', 'videography',
      'sessions', 'retratos', 'bodas', 'fotógrafo', 'sesión', 'fotografia',
      'imagen', 'captura', 'lens', 'shooting'
    ],
    sections: ['Hero', 'About', 'Portfolio', 'Packages', 'Testimonials', 'Contact'],
    analysisFields: ['portfolio_focus', 'packages', 'specialties']
  },
  
  [BusinessCategory.RESTAURANT]: {
    id: BusinessCategory.RESTAURANT,
    displayName: 'Restaurant/Cafe',
    keywords: [
      'restaurant', 'cafe', 'food', 'chef', 'dining', 'menu', 'eat', 'cuisine',
      'bar', 'coffee', 'bakery', 'bistro', 'cocina', 'restaurante', 'comida',
      'gastronomía', 'delivery', 'takeout', 'foodie', 'delicious', 'plate',
      'dish', 'recipe', 'cooking'
    ],
    sections: ['Hero', 'About', 'Menu Highlights', 'Reservations', 'Location & Hours', 'Contact'],
    analysisFields: ['cuisine_type', 'menu_highlights', 'dining_options', 'price_range']
  },
  
  [BusinessCategory.ECOMMERCE]: {
    id: BusinessCategory.ECOMMERCE,
    displayName: 'E-commerce/Shop',
    keywords: [
      'shop', 'store', 'buy', 'sell', 'boutique', 'retail', 'clothing', 'fashion',
      'jewelry', 'accessories', 'tienda', 'venta', 'compra', 'productos',
      'shopping', 'online shop', 'shopnow', 'order', 'purchase', 'collection'
    ],
    sections: ['Hero', 'About', 'Featured Products', 'Categories', 'Shop Info', 'Contact'],
    analysisFields: ['product_categories', 'shipping_info', 'featured_products']
  },
  
  [BusinessCategory.PROFESSIONAL_SERVICES]: {
    id: BusinessCategory.PROFESSIONAL_SERVICES,
    displayName: 'Professional Services',
    keywords: [
      'consulting', 'coach', 'coaching', 'lawyer', 'legal', 'accounting',
      'real estate', 'agent', 'advisor', 'consultant', 'professional',
      'services', 'consultor', 'asesor', 'profesional', 'attorney', 'cpa',
      'financial', 'business'
    ],
    sections: ['Hero', 'About', 'Services', 'Credentials', 'Testimonials', 'Contact'],
    analysisFields: ['services_offered', 'credentials', 'consultation_type']
  },
  
  [BusinessCategory.WELLNESS]: {
    id: BusinessCategory.WELLNESS,
    displayName: 'Wellness/Therapy',
    keywords: [
      'yoga', 'fitness', 'spa', 'massage', 'therapy', 'wellness', 'health',
      'meditation', 'trainer', 'personal trainer', 'gym', 'pilates',
      'bienestar', 'salud', 'terapia', 'workout', 'exercise', 'mindfulness',
      'healing', 'bodywork'
    ],
    sections: ['Hero', 'About', 'Services', 'Classes', 'Testimonials', 'Contact'],
    analysisFields: ['specialties', 'class_types', 'certifications']
  },
  
  [BusinessCategory.CRAFTS]: {
    id: BusinessCategory.CRAFTS,
    displayName: 'Crafts/Handmade',
    keywords: [
      'handmade', 'craft', 'art', 'artist', 'pottery', 'ceramics', 'jewelry',
      'woodwork', 'painting', 'sculpture', 'artisan', 'artesanía', 'hecho a mano',
      'arte', 'artista', 'creative', 'design', 'maker', 'creation'
    ],
    sections: ['Hero', 'About', 'Gallery', 'Process', 'Custom Orders', 'Contact'],
    analysisFields: ['craft_type', 'techniques', 'custom_orders']
  },
  
  [BusinessCategory.OTHER]: {
    id: BusinessCategory.OTHER,
    displayName: 'General/Other',
    keywords: [],
    sections: ['Hero', 'About', 'Services', 'Gallery', 'Contact', 'Footer'],
    analysisFields: ['services']
  }
};

/**
 * Detects business category based on bio, captions, and account type
 */
export function detectCategory(
  bio: string,
  captions: string[],
  accountType: string | null
): BusinessCategory {
  const allText = [bio, ...captions].join(' ').toLowerCase();
  const scores: Record<BusinessCategory, number> = {
    [BusinessCategory.PHOTOGRAPHER]: 0,
    [BusinessCategory.RESTAURANT]: 0,
    [BusinessCategory.ECOMMERCE]: 0,
    [BusinessCategory.PROFESSIONAL_SERVICES]: 0,
    [BusinessCategory.WELLNESS]: 0,
    [BusinessCategory.CRAFTS]: 0,
    [BusinessCategory.OTHER]: 0
  };

  // Score based on keyword matches
  for (const [category, config] of Object.entries(CATEGORY_CONFIGS)) {
    const cat = category as BusinessCategory;
    if (cat === BusinessCategory.OTHER) continue;
    
    for (const keyword of config.keywords) {
      if (allText.includes(keyword.toLowerCase())) {
        scores[cat] += 1;
      }
    }
  }

  // Bonus for account type
  if (accountType === 'CREATOR') {
    scores[BusinessCategory.PHOTOGRAPHER] += 2;
  } else if (accountType === 'BUSINESS') {
    scores[BusinessCategory.PROFESSIONAL_SERVICES] += 1;
    scores[BusinessCategory.RESTAURANT] += 1;
  }

  // Find highest score
  let maxScore = 0;
  let detectedCategory = BusinessCategory.OTHER;
  
  for (const [cat, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = cat as BusinessCategory;
    }
  }

  // If confidence too low (< 3 matches), use OTHER
  return maxScore >= 3 ? detectedCategory : BusinessCategory.OTHER;
}

/**
 * Gets the category-specific analysis prompt fields
 */
export function getCategoryAnalysisPrompt(category: BusinessCategory): string {
  const config = CATEGORY_CONFIGS[category];
  const fieldsJson: string[] = [];
  
  for (const field of config.analysisFields) {
    switch (field) {
      case 'portfolio_focus':
        fieldsJson.push(`  "portfolio_focus": ["Wedding Photography", "Portraits", "Events"]`);
        break;
      case 'packages':
        fieldsJson.push(`  "packages": ["Basic Package", "Premium Package", "Full Day"]`);
        break;
      case 'specialties':
        fieldsJson.push(`  "specialties": ["Natural light", "Editorial style"]`);
        break;
      case 'cuisine_type':
        fieldsJson.push(`  "cuisine_type": "Italian" (or "Mexican", "Contemporary", etc)`);
        break;
      case 'menu_highlights':
        fieldsJson.push(`  "menu_highlights": ["Signature pasta", "Wood-fired pizza", "House special"]`);
        break;
      case 'dining_options':
        fieldsJson.push(`  "dining_options": ["Dine-in", "Takeout", "Delivery"]`);
        break;
      case 'price_range':
        fieldsJson.push(`  "price_range": "$" (or "$$", "$$$", "$$$$")`);
        break;
      case 'product_categories':
        fieldsJson.push(`  "product_categories": ["Clothing", "Accessories", "Home Decor"]`);
        break;
      case 'shipping_info':
        fieldsJson.push(`  "shipping_info": "Ships worldwide" (or other shipping details)`);
        break;
      case 'featured_products':
        fieldsJson.push(`  "featured_products": ["Best seller 1", "New arrival", "Signature piece"]`);
        break;
      case 'services_offered':
        fieldsJson.push(`  "services_offered": ["Service 1", "Service 2", "Service 3"]`);
        break;
      case 'credentials':
        fieldsJson.push(`  "credentials": ["Certification 1", "10 years experience", "Award"]`);
        break;
      case 'consultation_type':
        fieldsJson.push(`  "consultation_type": "Virtual and in-person" (or other types)`);
        break;
      case 'class_types':
        fieldsJson.push(`  "class_types": ["Yoga", "Meditation", "Breathwork"]`);
        break;
      case 'certifications':
        fieldsJson.push(`  "certifications": ["RYT 500", "Certified Trainer"]`);
        break;
      case 'craft_type':
        fieldsJson.push(`  "craft_type": "Pottery" (or "Jewelry", "Woodworking", etc)`);
        break;
      case 'techniques':
        fieldsJson.push(`  "techniques": ["Hand-thrown", "Glazing", "Custom design"]`);
        break;
      case 'custom_orders':
        fieldsJson.push(`  "custom_orders": true (or false)`);
        break;
      case 'services':
        fieldsJson.push(`  "services": ["Service 1", "Service 2", "Service 3"]`);
        break;
      default:
        fieldsJson.push(`  "${field}": []`);
    }
  }

  return fieldsJson.join(',\n');
}
