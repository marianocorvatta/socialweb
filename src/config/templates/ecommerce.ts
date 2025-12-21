import { EcommerceProfile, InstagramProfile, InstagramMedia } from '@/types/instagram';

export function generateEcommercePrompt(
  analyzed: EcommerceProfile,
  profile: InstagramProfile,
  media: InstagramMedia[],
  galleryList: string,
  heroImageUrl: string,
  profilePicUrl: string
): string {
  return `Genera una landing page HTML de ALTA CALIDAD para una TIENDA/E-COMMERCE.

DATOS DEL PERFIL:
${JSON.stringify(analyzed, null, 2)}

DATOS DE INSTAGRAM:
- Nombre: ${profile.name || profile.username}
- Username: @${profile.username}
- Instagram: https://instagram.com/${profile.username}

IMAGEN HERO: ${heroImageUrl}
IMÁGENES DE PRODUCTOS: ${galleryList}

SECCIONES ESPECÍFICAS PARA E-COMMERCE:

HERO: Producto destacado o colección, nombre de tienda "${analyzed.business_name}", botón "Shop Now" a Instagram

SOBRE LA TIENDA: Bio "${analyzed.bio}", categorías: ${analyzed.product_categories.join(', ')}

PRODUCTOS DESTACADOS:
- Grid de productos
- Destacar: ${analyzed.featured_products.map(p => `"${p}"`).join(', ')}
- Cada producto enlaza a Instagram

CATEGORÍAS: Pills/badges para ${analyzed.product_categories.join(', ')}

INFO DE ENVÍO: "${analyzed.shipping_info}"

CTA: "Shop en Instagram" → https://instagram.com/${profile.username}

DISEÑO: Moderno, clean, enfocado en productos. Colores que reflejen la marca.

Meta title: ${analyzed.business_name} | Online Shop
Keywords: ${analyzed.keywords_seo.join(', ')}

Responde solo con HTML completo, sin explicaciones.`;
}
