import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FullProfileData, GeneratedWebsite } from "@/types/instagram";

interface ExistingSite {
  id: string;
  slug: string;
  subdomain: string | null;
  url: string;
  html: string;
  business_name: string | null;
  category: string | null;
  created_at: string;
  is_published: boolean;
}

interface InstagramStore {
  // Authentication
  token: string | null;
  setToken: (token: string | null) => void;

  // Profile data
  profileData: FullProfileData | null;
  setProfileData: (data: FullProfileData | null) => void;

  // Existing published site
  existingSite: ExistingSite | null;
  setExistingSite: (site: ExistingSite | null) => void;

  // Generated website
  generatedSite: GeneratedWebsite | null;
  setGeneratedSite: (site: GeneratedWebsite | null) => void;

  // Loading states
  isLoadingProfile: boolean;
  setIsLoadingProfile: (loading: boolean) => void;

  // Actions
  clearAll: () => void;
  refreshProfile: (token: string) => Promise<void>;
  checkExistingSite: (instagramUserId: string) => Promise<void>;
}

export const useInstagramStore = create<InstagramStore>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      profileData: null,
      existingSite: null,
      generatedSite: null,
      isLoadingProfile: false,

      // Setters
      setToken: (token) => set({ token }),
      setProfileData: (data) => set({ profileData: data }),
      setExistingSite: (site) => set({ existingSite: site }),
      setGeneratedSite: (site) => set({ generatedSite: site }),
      setIsLoadingProfile: (loading) => set({ isLoadingProfile: loading }),

      // Clear all data (logout)
      clearAll: () =>
        set({
          token: null,
          profileData: null,
          existingSite: null,
          generatedSite: null,
          isLoadingProfile: false,
        }),

      // Refresh profile from Instagram API
      refreshProfile: async (token: string) => {
        const currentState = get();
        currentState.setIsLoadingProfile(true);

        try {
          const response = await fetch(
            `/api/instagram/full-profile?access_token=${encodeURIComponent(token)}`
          );
          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          currentState.setProfileData(data);
        } catch (error) {
          console.error("Error refreshing profile:", error);
          throw error;
        } finally {
          currentState.setIsLoadingProfile(false);
        }
      },

      // Check if user already has a published site
      checkExistingSite: async (instagramUserId: string) => {
        try {
          const response = await fetch(
            `/api/sites/check-existing?instagram_user_id=${encodeURIComponent(instagramUserId)}`
          );

          if (!response.ok) {
            // No existing site found
            set({ existingSite: null });
            return;
          }

          const data = await response.json();

          if (data.success && data.site) {
            const site: ExistingSite = {
              id: data.site.id,
              slug: data.site.slug,
              subdomain: data.site.subdomain,
              url: data.site.subdomain
                ? `https://${data.site.subdomain}.vercel.app`
                : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/sitio/${data.site.slug}`,
              html: data.site.html,
              business_name: data.site.business_name,
              category: data.site.category,
              created_at: data.site.created_at,
              is_published: data.site.is_published,
            };
            set({ existingSite: site });
          } else {
            set({ existingSite: null });
          }
        } catch (error) {
          console.error("Error checking existing site:", error);
          set({ existingSite: null });
        }
      },
    }),
    {
      name: "instagram-storage", // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        token: state.token,
        profileData: state.profileData,
        existingSite: state.existingSite,
        generatedSite: state.generatedSite,
      }),
    }
  )
);
