"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FullProfileData, GeneratedWebsite } from "@/types/instagram";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import ProfileCard from "@/components/profile/ProfileCard";
import RawDataToggle from "@/components/profile/RawDataToggle";

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams.get("token");

  const [profileData, setProfileData] = useState<FullProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Check if user has generated site
  const [hasGeneratedSite, setHasGeneratedSite] = useState(false);

  // Get token from URL or sessionStorage
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("generatedSite");
    setHasGeneratedSite(!!stored);
  }, []);

  // Save token to sessionStorage and retrieve it
  useEffect(() => {
    if (tokenFromUrl) {
      // Save token from URL to sessionStorage
      sessionStorage.setItem("instagram_token", tokenFromUrl);
      setToken(tokenFromUrl);
    } else {
      // Try to get token from sessionStorage
      const storedToken = sessionStorage.getItem("instagram_token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        // No token available, redirect to home
        router.push("/?error=" + encodeURIComponent("No authentication token"));
      }
    }
  }, [tokenFromUrl, router]);

  // Fetch profile data
  useEffect(() => {
    if (token && !profileData) {
      setLoading(true);
      fetch(`/api/instagram/full-profile?access_token=${encodeURIComponent(token)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setFetchError(data.error);
          } else {
            setProfileData(data);
          }
        })
        .catch((err) => {
          setFetchError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token, profileData]);

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

      const data: GeneratedWebsite = await response.json();

      if ((data as any).error) {
        setGenerateError((data as any).error);
      } else {
        // Save to sessionStorage
        sessionStorage.setItem("generatedSite", JSON.stringify(data));
        sessionStorage.setItem("profileData", JSON.stringify(profileData));

        // Navigate to generate page
        router.push("/generate");
      }
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGenerating(false);
    }
  };

  if (!token) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <ProtectedLayout hasGeneratedSite={hasGeneratedSite}>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="md" message="Cargando datos de Instagram..." />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout hasGeneratedSite={hasGeneratedSite}>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
            Tu Perfil
          </h1>
          <p className="text-gray-500 font-light">
            Información de tu cuenta de Instagram
          </p>
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

            <RawDataToggle profileData={profileData} />
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
