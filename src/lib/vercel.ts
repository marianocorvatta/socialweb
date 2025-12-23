/**
 * Vercel API Integration
 * Docs: https://vercel.com/docs/rest-api/endpoints/projects/domains
 */

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

interface VercelDomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
}

interface VercelErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Add a subdomain to the Vercel project
 * @param subdomain - The subdomain name (e.g., "cofbar" for "cofbar.vercel.app")
 * @returns The domain configuration or throws an error
 */
export async function addVercelSubdomain(subdomain: string): Promise<VercelDomainResponse> {
  if (!VERCEL_API_TOKEN) {
    throw new Error('VERCEL_API_TOKEN environment variable is not set');
  }

  if (!VERCEL_PROJECT_ID) {
    throw new Error('VERCEL_PROJECT_ID environment variable is not set');
  }

  const domain = `${subdomain}.vercel.app`;

  // Build API URL
  let apiUrl = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`;
  if (VERCEL_TEAM_ID) {
    apiUrl += `?teamId=${VERCEL_TEAM_ID}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain,
      }),
    });

    const data = (await response.json()) as VercelDomainResponse | VercelErrorResponse;

    if (!response.ok) {
      const errorData = data as VercelErrorResponse;
      // Domain already exists is OK
      if (errorData.error?.code === 'domain_already_in_use') {
        console.log(`Domain ${domain} already exists, continuing...`);
        return {
          name: domain,
          apexName: 'vercel.app',
          projectId: VERCEL_PROJECT_ID,
          verified: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      }
      throw new Error(`Vercel API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    return data as VercelDomainResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to add Vercel subdomain');
  }
}

/**
 * Check if a subdomain is available in your Vercel project
 * @param subdomain - The subdomain name to check
 * @returns true if available (can be added), false if already taken
 */
export async function isSubdomainAvailable(subdomain: string): Promise<boolean> {
  if (!VERCEL_API_TOKEN) {
    throw new Error('VERCEL_API_TOKEN environment variable is not set');
  }

  if (!VERCEL_PROJECT_ID) {
    throw new Error('VERCEL_PROJECT_ID environment variable is not set');
  }

  const domain = `${subdomain}.vercel.app`;

  // Try to add the domain - if it fails with specific errors, it's not available
  let apiUrl = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`;
  if (VERCEL_TEAM_ID) {
    apiUrl += `?teamId=${VERCEL_TEAM_ID}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain,
      }),
    });

    const data = (await response.json()) as VercelDomainResponse | VercelErrorResponse;

    if (response.ok) {
      // Successfully added - domain is available
      return true;
    }

    const errorData = data as VercelErrorResponse;

    // If already in use (by another account or project), it's NOT available
    if (errorData.error?.code === 'domain_already_in_use' ||
        errorData.error?.code === 'domain_taken' ||
        errorData.error?.message?.includes('already exists')) {
      return false;
    }

    // For other errors, log and assume not available (safer)
    console.error(`Unexpected error checking subdomain ${subdomain}:`, errorData.error?.message);
    return false;
  } catch (error) {
    console.error('Error checking subdomain availability:', error);
    return false;
  }
}

/**
 * Find an available subdomain by trying the base name and appending numbers if needed
 * @param baseSubdomain - The preferred subdomain name
 * @param maxAttempts - Maximum number of attempts (default: 10)
 * @returns An available subdomain or null if none found
 */
export async function findAvailableSubdomain(
  baseSubdomain: string,
  maxAttempts: number = 10
): Promise<string | null> {
  // Try the base subdomain first
  const isAvailable = await isSubdomainAvailable(baseSubdomain);
  if (isAvailable) {
    return baseSubdomain;
  }

  // Try with numeric suffixes: workitout-1, workitout-2, etc.
  for (let i = 1; i <= maxAttempts; i++) {
    const candidate = `${baseSubdomain}-${i}`;
    const available = await isSubdomainAvailable(candidate);
    if (available) {
      return candidate;
    }
  }

  // No available subdomain found
  return null;
}

/**
 * Remove a subdomain from the Vercel project
 * @param subdomain - The subdomain name to remove
 */
export async function removeVercelSubdomain(subdomain: string): Promise<void> {
  if (!VERCEL_API_TOKEN) {
    throw new Error('VERCEL_API_TOKEN environment variable is not set');
  }

  if (!VERCEL_PROJECT_ID) {
    throw new Error('VERCEL_PROJECT_ID environment variable is not set');
  }

  const domain = `${subdomain}.vercel.app`;

  let apiUrl = `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`;
  if (VERCEL_TEAM_ID) {
    apiUrl += `?teamId=${VERCEL_TEAM_ID}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const data = (await response.json()) as VercelErrorResponse;
      throw new Error(`Vercel API error: ${data.error?.message || 'Unknown error'}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to remove Vercel subdomain');
  }
}
