import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FullProfileData, GeneratedWebsite } from "@/types/instagram";

interface InstagramStore {
  // Authentication
  token: string | null;
  setToken: (token: string | null) => void;

  // Profile data
  profileData: FullProfileData | null;
  setProfileData: (data: FullProfileData | null) => void;

  // Generated website
  generatedSite: GeneratedWebsite | null;
  setGeneratedSite: (site: GeneratedWebsite | null) => void;

  // Loading states
  isLoadingProfile: boolean;
  setIsLoadingProfile: (loading: boolean) => void;

  // Actions
  clearAll: () => void;
  refreshProfile: (token: string) => Promise<void>;
}

export const useInstagramStore = create<InstagramStore>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      profileData: null,
      generatedSite: null,
      isLoadingProfile: false,

      // Setters
      setToken: (token) => set({ token }),
      setProfileData: (data) => set({ profileData: data }),
      setGeneratedSite: (site) => set({ generatedSite: site }),
      setIsLoadingProfile: (loading) => set({ isLoadingProfile: loading }),

      // Clear all data (logout)
      clearAll: () =>
        set({
          token: null,
          profileData: null,
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
    }),
    {
      name: "instagram-storage", // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        token: state.token,
        profileData: state.profileData,
        generatedSite: state.generatedSite,
      }),
    }
  )
);
