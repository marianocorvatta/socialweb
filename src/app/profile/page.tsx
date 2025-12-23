/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { GeneratedWebsite } from "@/types/instagram";
import { useInstagramStore } from "@/store/useInstagramStore";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import ProfileCard from "@/components/profile/ProfileCard";
import { useIsMobile } from "@/hooks/useMediaQuery";
import ProgressDots from "@/components/mobile/ProgressDots";
import InstagramGradientLoader from "@/components/mobile/InstagramGradientLoader";
import MobileProfileView from "@/components/mobile/MobileProfileView";
// import RawDataToggle from "@/components/profile/RawDataToggle";

function ProfileContent() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams.get("token");

  // Zustand store
  const {
    token,
    profileData,
    existingSite,
    isLoadingProfile,
    setToken,
    refreshProfile,
    checkExistingSite,
  } = useInstagramStore();

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Save token from URL to store
  useEffect(() => {
    if (tokenFromUrl && tokenFromUrl !== token) {
      setToken(tokenFromUrl);
    } else if (!tokenFromUrl && !token) {
      router.push("/?error=" + encodeURIComponent("No authentication token"));
    }
  }, [tokenFromUrl, token, setToken, router]);

  // Fetch profile data if we have token but no profile data
  useEffect(() => {
    if (token && !profileData && !isLoadingProfile) {
      refreshProfile(token).catch((err) => {
        setFetchError(err.message);
      });
    }
  }, [token, profileData, isLoadingProfile, refreshProfile]);

  // Check for existing site when profile data is loaded
  useEffect(() => {
    if (profileData?.profile?.user_id) {
      checkExistingSite(profileData.profile.user_id);
    }
  }, [profileData, checkExistingSite]);

  // If existing site found, redirect to generate page with existing HTML
  // Only redirect if we don't already have a generated site in store
  useEffect(() => {
    const { generatedSite } = useInstagramStore.getState();

    if (existingSite && profileData && !generatedSite) {
      // Set the existing site as generated site so it shows in preview
      useInstagramStore.getState().setGeneratedSite({
        generated_html: existingSite.html,
        generated_at: existingSite.created_at,
        analyzed_profile: {
          business_name: existingSite.business_name || profileData.profile.username,
          category: (existingSite.category || 'OTHER') as any,
          tagline: '',
          bio: profileData.profile.biography || '',
          locations: [],
          services: [],
          keywords_seo: [],
          style: '',
          target_audience: '',
        } as any,
      });
      // Navigate to generate page
      router.push("/generate");
    }
  }, [existingSite, profileData, router]);

  const handleGenerateWebsite = async () => {
    if (!profileData) return;

    setGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profileData.profile,
          media: profileData.media,
        }),
      });

      const data: GeneratedWebsite | { error: string } = await response.json();

      if ("error" in data) {
        setGenerateError(data.error);
      } else {
        // Save to Zustand store
        useInstagramStore.getState().setGeneratedSite(data);

        // Navigate to generate page
        router.push("/generate");
      }
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGenerating(false);
    }
  };

  const handleRefreshProfile = async () => {
    if (!token) return;

    setFetchError(null);
    try {
      await refreshProfile(token);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Error al actualizar");
    }
  };

  if (!token) {
    return null; // Will redirect
  }

  // Vista Mobile
  if (isMobile) {
    if (isLoadingProfile && !profileData) {
      return <InstagramGradientLoader message="Cargando perfil..." />;
    }

    return (
      <>
        <ProgressDots currentStep={2} />
        {generating && <InstagramGradientLoader message="Generando con IA..." />}
        {profileData && (
          <MobileProfileView
            profile={profileData.profile}
            mediaCount={profileData.media.length}
            onGenerate={handleGenerateWebsite}
            generating={generating}
          />
        )}
        {generateError && (
          <div className="fixed bottom-6 left-6 right-6 z-50">
            <Alert variant="error" title="Error al generar">
              {generateError}
            </Alert>
          </div>
        )}
        {fetchError && (
          <div className="fixed top-20 left-6 right-6 z-50">
            <Alert variant="error" title="Error">
              {fetchError}
            </Alert>
          </div>
        )}
      </>
    );
  }

  // Vista Desktop
  if (isLoadingProfile && !profileData) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="md" message="Cargando datos de Instagram..." />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
              Tu Perfil
            </h1>
            <p className="text-gray-500 font-light">
              Información de tu cuenta de Instagram
            </p>
          </div>
          <button
            onClick={handleRefreshProfile}
            disabled={isLoadingProfile}
            className="flex items-center gap-2 px-4 py-2 text-sm font-light text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-4 h-4 ${isLoadingProfile ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isLoadingProfile ? "Actualizando..." : "Actualizar datos"}
          </button>
        </div>

        {fetchError && (
          <div className="mb-6">
            <Alert
              variant="error"
              title="Error"
              onRetry={() => window.location.reload()}
            >
              {fetchError}
            </Alert>
          </div>
        )}

        {profileData && (
          <div className="space-y-6">
            <ProfileCard
              profile={profileData.profile}
              mediaCount={profileData.media.length}
            />

            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
              <h3 className="text-xl font-light text-gray-800 mb-4">
                ¿Listo para generar tu web?
              </h3>
              <Button
                variant="green-teal"
                onClick={handleGenerateWebsite}
                disabled={generating}
                loading={generating}
                className="shadow-lg hover:shadow-xl"
              >
                {generating ? "Generando con IA..." : "Generar mi Web"}
              </Button>
              {generating && (
                <p className="mt-4 text-sm text-gray-500 font-light">
                  Esto puede tardar hasta 1 minuto...
                </p>
              )}
            </div>

            {generateError && (
              <Alert variant="error" title="Error al generar">
                {generateError}
              </Alert>
            )}

            {/* <RawDataToggle profileData={profileData} /> */}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Spinner size="md" message="Cargando..." />}>
      <ProfileContent />
    </Suspense>
  );
}
