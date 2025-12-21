"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FullProfileData, GeneratedWebsite } from "@/types/instagram";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import ProfileCard from "@/components/profile/ProfileCard";
import RawDataToggle from "@/components/profile/RawDataToggle";

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [profileData, setProfileData] = useState<FullProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push("/?error=" + encodeURIComponent("No authentication token"));
    }
  }, [token, router]);

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
    return <Spinner size="md" message="Cargando datos de Instagram..." />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Instagram Web Generator
        </h1>

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

            <div className="text-center">
              <Button
                variant="green-teal"
                onClick={handleGenerateWebsite}
                disabled={generating}
                loading={generating}
              >
                {generating ? "Generando con IA..." : "Generar mi Web"}
              </Button>
              {generating && (
                <p className="mt-2 text-sm text-gray-500">
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
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Spinner size="md" message="Cargando..." />}>
      <ProfileContent />
    </Suspense>
  );
}
