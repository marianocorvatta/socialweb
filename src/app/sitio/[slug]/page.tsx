import { notFound } from 'next/navigation';

interface SitePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getSiteData(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}/api/sites/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.site : null;
  } catch (error) {
    console.error('Error fetching site:', error);
    return null;
  }
}

export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params;
  const site = await getSiteData(slug);

  if (!site) {
    notFound();
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: site.html }}
      suppressHydrationWarning
    />
  );
}
