import { supabaseAdmin } from './supabase';

/**
 * SQL to create the sites table if it doesn't exist
 */
const CREATE_SITES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    html TEXT NOT NULL,
    instagram_username VARCHAR(100),
    instagram_user_id VARCHAR(100) UNIQUE,
    business_name VARCHAR(255),
    category VARCHAR(100),
    tagline TEXT,
    bio TEXT,
    subdomain VARCHAR(100) UNIQUE,
    custom_domain VARCHAR(255) UNIQUE,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);
  CREATE INDEX IF NOT EXISTS idx_sites_custom_domain ON sites(custom_domain);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_instagram_user_id ON sites(instagram_user_id) WHERE instagram_user_id IS NOT NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_subdomain ON sites(subdomain) WHERE subdomain IS NOT NULL;
`;

/**
 * Run database setup
 * This function creates the sites table and indexes if they don't exist
 */
export async function setupDatabase(): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  const { error } = await supabaseAdmin.rpc('exec_sql', {
    sql: CREATE_SITES_TABLE_SQL,
  });

  if (error) {
    // If exec_sql RPC doesn't exist, we need to run SQL manually via Supabase Dashboard
    console.error('Error setting up database:', error);
    console.log('Please run the following SQL in Supabase Dashboard > SQL Editor:');
    console.log(CREATE_SITES_TABLE_SQL);
    throw new Error(`Database setup failed: ${error.message}`);
  }

  console.log('Database setup completed successfully');
}

/**
 * Get the SQL for manual execution
 */
export function getSetupSQL(): string {
  return CREATE_SITES_TABLE_SQL;
}
