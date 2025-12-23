"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface LinkedInProfile {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  picture: string;
  locale: string;
}

function LinkedInProfileContent() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams.get("token");

  const [token, setToken] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<LinkedInProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Save token from URL
  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else if (!token) {
      router.push("/?error=" + encodeURIComponent("No LinkedIn token"));
    }
  }, [tokenFromUrl, token, router]);

  // Fetch LinkedIn profile data
  useEffect(() => {
    if (token && !profileData && !isLoadingProfile) {
      setIsLoadingProfile(true);
      setFetchError(null);

      fetch(`/api/linkedin/profile?access_token=${encodeURIComponent(token)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setProfileData(data.profile);
        })
        .catch((err) => {
          setFetchError(err.message);
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    }
  }, [token, profileData, isLoadingProfile]);

  if (!token) {
    return null; // Will redirect
  }

  if (isLoadingProfile && !profileData) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="md" message="Cargando datos de LinkedIn..." />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
            Perfil de LinkedIn
          </h1>
          <p className="text-gray-500 font-light">
            Datos obtenidos de tu cuenta de LinkedIn
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
            {/* Profile Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                {profileData.picture && (
                  <img
                    src={profileData.picture}
                    alt={profileData.name}
                    className="w-24 h-24 rounded-full border-2 border-blue-500"
                  />
                )}

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-medium text-gray-900 mb-1">
                    {profileData.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{profileData.email}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nombre:</span>
                      <p className="font-medium">{profileData.given_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Apellido:</span>
                      <p className="font-medium">{profileData.family_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email verificado:</span>
                      <p className="font-medium">
                        {profileData.email_verified ? "Sí" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Idioma:</span>
                      <p className="font-medium">{profileData.locale}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Alert */}
            <Alert variant="info">
              <p className="font-medium">Datos de LinkedIn conectados exitosamente</p>
              <p className="text-sm mt-2">
                Esta información puede ser utilizada para enriquecer la generación de tu sitio web.
                Para continuar, también necesitas conectar tu cuenta de Instagram.
              </p>
            </Alert>

            {/* Actions */}
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
              <h3 className="text-xl font-light text-gray-800 mb-4">
                Siguiente paso
              </h3>
              <Button
                variant="green-teal"
                onClick={() => router.push("/")}
                className="shadow-lg hover:shadow-xl"
              >
                Conectar Instagram
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}

export default function LinkedInProfilePage() {
  return (
    <Suspense fallback={<Spinner size="md" message="Cargando..." />}>
      <LinkedInProfileContent />
    </Suspense>
  );
}
