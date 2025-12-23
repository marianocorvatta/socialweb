import { supabaseAdmin } from './supabase';
import type { Site, CreateSiteInput, UpdateSiteInput } from '@/types/database';

if (!supabaseAdmin) {
  throw new Error('Supabase admin client not initialized. Missing SUPABASE_SERVICE_ROLE_KEY');
}

/**
 * Generate a URL-friendly slug from a string
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

/**
 * Generate a unique slug based on the business name
 * If slug exists, append -2, -3, etc.
 */
export async function generateUniqueSlug(baseName: string): Promise<string> {
  const baseSlug = slugify(baseName);

  if (!baseSlug) {
    throw new Error('Invalid business name for slug generation');
  }

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('sites')
      .select('slug')
      .eq('slug', slug)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows found - slug is available
      return slug;
    }

    if (error) {
      throw new Error(`Error checking slug availability: ${error.message}`);
    }

    if (data) {
      // Slug exists, try with counter
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
}

/**
 * Create a new site
 */
export async function createSite(input: CreateSiteInput): Promise<Site> {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .insert({
      slug: input.slug,
      html: input.html,
      instagram_username: input.instagram_username || null,
      instagram_user_id: input.instagram_user_id || null,
      business_name: input.business_name || null,
      category: input.category || null,
      tagline: input.tagline || null,
      bio: input.bio || null,
      is_published: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating site: ${error.message}`);
  }

  return data;
}

/**
 * Get site by slug
 */
export async function getSiteBySlug(slug: string): Promise<Site | null> {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error && error.code === 'PGRST116') {
    return null;
  }

  if (error) {
    throw new Error(`Error fetching site: ${error.message}`);
  }

  return data;
}

/**
 * Get site by custom domain
 */
export async function getSiteByDomain(domain: string): Promise<Site | null> {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .select('*')
    .eq('custom_domain', domain)
    .eq('is_published', true)
    .single();

  if (error && error.code === 'PGRST116') {
    return null;
  }

  if (error) {
    throw new Error(`Error fetching site by domain: ${error.message}`);
  }

  return data;
}

/**
 * Update site by slug
 */
export async function updateSite(slug: string, input: UpdateSiteInput): Promise<Site> {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.html !== undefined) updateData.html = input.html;
  if (input.business_name !== undefined) updateData.business_name = input.business_name;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.tagline !== undefined) updateData.tagline = input.tagline;
  if (input.bio !== undefined) updateData.bio = input.bio;
  if (input.custom_domain !== undefined) updateData.custom_domain = input.custom_domain;
  if (input.is_published !== undefined) updateData.is_published = input.is_published;

  const { data, error } = await supabaseAdmin
    .from('sites')
    .update(updateData)
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating site: ${error.message}`);
  }

  return data;
}

/**
 * Delete site by slug
 */
export async function deleteSite(slug: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('sites')
    .delete()
    .eq('slug', slug);

  if (error) {
    throw new Error(`Error deleting site: ${error.message}`);
  }
}
