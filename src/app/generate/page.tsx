"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FullProfileData, GeneratedWebsite } from "@/types/instagram";
import AnalyzedProfileCard from "@/components/generate/AnalyzedProfileCard";
import BrowserPreview from "@/components/generate/BrowserPreview";
import ActionButtons from "@/components/generate/ActionButtons";

export default function GeneratePage() {
  const router = useRouter();

  const [profileData, setProfileData] = useState<FullProfileData | null>(null);
  const [generatedSite, setGeneratedSite] = useState<GeneratedWebsite | null>(null);

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Load data from sessionStorage
  useEffect(() => {
    const storedSite = sessionStorage.getItem("generatedSite");
    const storedProfile = sessionStorage.getItem("profileData");

    if (!storedSite || !storedProfile) {
      router.push("/profile");
      return;
    }

    setGeneratedSite(JSON.parse(storedSite));
    setProfileData(JSON.parse(storedProfile));
  }, [router]);

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
      const response = await fetch("/api/github/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchName: profileData.profile.username,
          instagramUsername: profileData.profile.username,
          templateCode: generatedSite.generated_html,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setPublishError(data.error);
      } else {
        let successMsg = `¡Publicado exitosamente en la rama ${data.branch}!`;

        if (data.deployment?.success) {
          successMsg += `\n\n✅ Deployment completado en Vercel`;
          const url = data.deployment.alias
            ? `https://${data.deployment.alias}`
            : data.deployment.deploymentURL
              ? `https://${data.deployment.deploymentURL}`
              : null;
          setPublishedUrl(url);
        } else if (data.deployment?.error) {
          successMsg += `\n\n⚠️ Advertencia: El código se publicó en GitHub pero el deployment en Vercel falló:\n${data.deployment.error}`;
        } else if (data.deployment) {
          successMsg += `\n\n⚠️ Deployment iniciado pero aún no completado`;
        }

        setPublishSuccess(successMsg);
      }
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
    sessionStorage.clear();
    router.push("/");
  };

  if (!generatedSite || !profileData) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Instagram Web Generator
        </h1>

        <div className="space-y-6">
          <AnalyzedProfileCard analyzedProfile={generatedSite.analyzed_profile} />

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Preview de tu Web
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
          <div className="flex justify-center gap-4">
            <button
              onClick={handleBackToProfile}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Volver a generar
            </button>
            <button
              onClick={handleConnectAnother}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Conectar otra cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
