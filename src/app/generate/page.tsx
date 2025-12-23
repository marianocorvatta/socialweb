"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInstagramStore } from "@/store/useInstagramStore";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import AnalyzedProfileCard from "@/components/generate/AnalyzedProfileCard";
import BrowserPreview from "@/components/generate/BrowserPreview";
import ActionButtons from "@/components/generate/ActionButtons";
import { useIsMobile } from "@/hooks/useMediaQuery";
import ProgressDots from "@/components/mobile/ProgressDots";
import InstagramGradientLoader from "@/components/mobile/InstagramGradientLoader";
import MobilePreviewView from "@/components/mobile/MobilePreviewView";

export default function GeneratePage() {
  const isMobile = useIsMobile();
  const router = useRouter();

  // Zustand store
  const { profileData, generatedSite, clearAll } = useInstagramStore();

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Redirect if no generated site
  useEffect(() => {
    if (!generatedSite || !profileData) {
      router.push("/profile");
    }
  }, [generatedSite, profileData, router]);

  const getPreviewUrl = () => {
    if (!generatedSite) return "";
    const base64 = Buffer.from(generatedSite.generated_html).toString("base64");
    return `/api/preview-website?html=${encodeURIComponent(base64)}`;
  };

  const handleDownloadHTML = () => {
    if (!generatedSite) return;

    const blob = new Blob([generatedSite.generated_html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profileData?.profile.username || "website"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePublish = async () => {
    if (!generatedSite || !profileData?.profile.username) return;

    setPublishing(true);
    setPublishError(null);
    setPublishSuccess(null);
    setPublishedUrl(null);

    try {
      // Create site in Supabase
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: generatedSite.generated_html,
          instagram_username: profileData.profile.username,
          instagram_user_id: profileData.profile.user_id,
          analyzed_profile: generatedSite.analyzed_profile,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setPublishError(data.error);
      } else if (data.success && data.site) {
        const successMsg = `¡Sitio publicado exitosamente!\n\nSlug: ${data.site.slug}`;
        setPublishSuccess(successMsg);
        setPublishedUrl(data.site.url);
      }

      // Commented out GitHub/Vercel publishing
      // const response = await fetch("/api/github/push", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     branchName: profileData.profile.username,
      //     instagramUsername: profileData.profile.username,
      //     templateCode: generatedSite.generated_html,
      //   }),
      // });

      // const data = await response.json();

      // if (data.error) {
      //   setPublishError(data.error);
      // } else {
      //   let successMsg = `¡Publicado exitosamente en la rama ${data.branch}!`;

      //   if (data.deployment?.success) {
      //     successMsg += `\n\n✅ Deployment completado en Vercel`;
      //     const url = data.deployment.alias
      //       ? `https://${data.deployment.alias}`
      //       : data.deployment.deploymentURL
      //         ? `https://${data.deployment.deploymentURL}`
      //         : null;
      //     setPublishedUrl(url);
      //   } else if (data.deployment?.error) {
      //     successMsg += `\n\n⚠️ Advertencia: El código se publicó en GitHub pero el deployment en Vercel falló:\n${data.deployment.error}`;
      //   } else if (data.deployment) {
      //     successMsg += `\n\n⚠️ Deployment iniciado pero aún no completado`;
      //   }

      //   setPublishSuccess(successMsg);
      // }
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setPublishing(false);
    }
  };

  const handleFullScreen = () => {
    window.open(getPreviewUrl(), "_blank");
  };

  const handleBackToProfile = () => {
    router.push("/profile");
  };

  const handleConnectAnother = () => {
    clearAll(); // Clear Zustand store
    router.push("/");
  };

  if (!generatedSite || !profileData) {
    return null; // Will redirect
  }

  // Vista Mobile
  if (isMobile) {
    return (
      <>
        <ProgressDots currentStep={3} />
        {publishing && <InstagramGradientLoader message="Publicando..." />}
        <MobilePreviewView
          html={generatedSite.generated_html}
          onPublish={handlePublish}
          publishing={publishing}
          publishedUrl={publishedUrl}
        />
      </>
    );
  }

  // Vista Desktop
  return (
    <ProtectedLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
            Preview de tu Web
          </h1>
          <p className="text-gray-500 font-light">
            Tu sitio web generado con inteligencia artificial
          </p>
        </div>

        <div className="space-y-6">
          <AnalyzedProfileCard analyzedProfile={generatedSite.analyzed_profile} />

          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-gray-800">
                Vista previa
              </h2>
              <ActionButtons
                onDownload={handleDownloadHTML}
                onPublish={handlePublish}
                onFullScreen={handleFullScreen}
                publishing={publishing}
                publishSuccess={publishSuccess}
                publishError={publishError}
                publishedUrl={publishedUrl}
              />
            </div>
            <BrowserPreview
              html={generatedSite.generated_html}
              username={profileData.profile.username}
              previewUrl={getPreviewUrl()}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-6 text-sm font-light">
            <button
              onClick={handleBackToProfile}
              className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Volver a generar
            </button>
            <button
              onClick={handleConnectAnother}
              className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Conectar otra cuenta
            </button>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
