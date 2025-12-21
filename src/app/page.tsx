"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface InstagramProfile {
  user_id: string | null;
  username: string | null;
  name: string | null;
  biography: string | null;
  website: string | null;
  profile_picture_url: string | null;
  followers_count: number | null;
  follows_count: number | null;
  media_count: number | null;
  account_type: string | null;
}

interface InstagramMedia {
  id: string;
  caption: string | null;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string | null;
  thumbnail_url: string | null;
  permalink: string | null;
  timestamp: string | null;
}

interface FullProfileData {
  profile: InstagramProfile;
  media: InstagramMedia[];
  access_token: string;
  fetched_at: string;
}

interface AnalyzedProfile {
  business_name: string;
  tagline: string;
  bio: string;
  services: string[];
  keywords_seo: string[];
  locations: string[];
  style: string;
  target_audience: string;
  category: string;
}

interface GeneratedWebsite {
  analyzed_profile: AnalyzedProfile;
  generated_html: string;
  generated_at: string;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const [profileData, setProfileData] = useState<FullProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [generatedSite, setGeneratedSite] = useState<GeneratedWebsite | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

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

      const data = await response.json();

      if (data.error) {
        setGenerateError(data.error);
      } else {
        setGeneratedSite(data);
      }
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGenerating(false);
    }
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
          // Set the published URL for the button
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

  const getPreviewUrl = () => {
    if (!generatedSite) return "";
    const base64 = Buffer.from(generatedSite.generated_html).toString("base64");
    return `/api/preview-website?html=${encodeURIComponent(base64)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Instagram Web Generator
        </h1>

        {/* Initial state - no token, no error */}
        {!token && !error && !profileData && (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-6">
              Conecta tu cuenta de Instagram para generar tu web
            </p>
            <a
              href="/api/auth/instagram"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Conectar con Instagram
            </a>
          </div>
        )}

        {/* Loading Instagram data */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando datos de Instagram...</p>
          </div>
        )}

        {/* Error state */}
        {(error || fetchError) && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <pre className="text-red-600 text-sm whitespace-pre-wrap overflow-x-auto">
              {error || fetchError}
            </pre>
            <a
              href="/"
              className="inline-block mt-4 text-red-600 hover:text-red-800 underline"
            >
              Intentar de nuevo
            </a>
          </div>
        )}

        {/* Profile loaded - show generate button */}
        {profileData && !loading && !generatedSite && (
          <div className="space-y-6">
            {/* Profile summary card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                {profileData.profile.profile_picture_url && (
                  <img
                    src={profileData.profile.profile_picture_url}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {profileData.profile.name || profileData.profile.username}
                  </h2>
                  <p className="text-gray-500">@{profileData.profile.username}</p>
                  <p className="text-sm text-gray-400">
                    {profileData.profile.media_count} posts | {profileData.profile.account_type}
                  </p>
                </div>
              </div>

              {profileData.profile.biography && (
                <p className="text-gray-600 mb-4">{profileData.profile.biography}</p>
              )}

              <p className="text-sm text-gray-500">
                {profileData.media.length} posts cargados para análisis
              </p>
            </div>

            {/* Generate button */}
            <div className="text-center">
              <button
                onClick={handleGenerateWebsite}
                disabled={generating}
                className="inline-block bg-linear-to-r from-green-500 to-teal-500 text-white font-semibold py-3 px-8 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Generando con IA...
                  </span>
                ) : (
                  "Generar mi Web"
                )}
              </button>
              {generating && (
                <p className="mt-2 text-sm text-gray-500">
                  Esto puede tardar hasta 1 minuto...
                </p>
              )}
            </div>

            {generateError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-semibold mb-2">Error al generar</h3>
                <p className="text-red-600 text-sm">{generateError}</p>
              </div>
            )}

            {/* Raw data toggle */}
            <details className="bg-gray-50 border border-gray-200 rounded-lg">
              <summary className="p-4 cursor-pointer text-gray-600 hover:text-gray-800">
                Ver datos crudos de Instagram
              </summary>
              <div className="p-4 pt-0 space-y-4">
                <pre className="bg-white p-4 rounded border text-xs overflow-x-auto whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {JSON.stringify(profileData.profile, null, 2)}
                </pre>
                <pre className="bg-white p-4 rounded border text-xs overflow-x-auto whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {JSON.stringify(profileData.media.slice(0, 5), null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

        {/* Generated website result */}
        {generatedSite && (
          <div className="space-y-6">
            {/* Analyzed profile */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Perfil Analizado por IA
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre del negocio</p>
                  <p className="font-medium">{generatedSite.analyzed_profile.business_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Categoría</p>
                  <p className="font-medium">{generatedSite.analyzed_profile.category}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Tagline</p>
                  <p className="font-medium">{generatedSite.analyzed_profile.tagline}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Bio generada</p>
                  <p className="text-gray-700">{generatedSite.analyzed_profile.bio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Servicios</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {generatedSite.analyzed_profile.services.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Keywords SEO</p>
                  <div className="flex flex-wrap gap-1">
                    {generatedSite.analyzed_profile.keywords_seo.map((k, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Público objetivo</p>
                  <p className="text-gray-700">{generatedSite.analyzed_profile.target_audience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estilo</p>
                  <p className="text-gray-700">{generatedSite.analyzed_profile.style}</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Preview de tu Web
                </h2>
                <div className="flex gap-3">
                  <a
                    href={getPreviewUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Pantalla completa
                  </a>
                  <button
                    onClick={handleDownloadHTML}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar HTML
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {publishing ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        Publicando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Publicar
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-gray-200 bg-white">
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-500 text-center">
                      {profileData?.profile.username}.com
                    </div>
                  </div>
                </div>
                <iframe
                  srcDoc={generatedSite.generated_html}
                  className="w-full"
                  style={{ height: "80vh", minHeight: "600px" }}
                  title="Website Preview"
                />
              </div>

              {/* Publish feedback messages */}
              {publishSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-800 font-medium whitespace-pre-line">{publishSuccess}</p>
                  {publishedUrl && (
                    <a
                      href={publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ver mi web publicada
                    </a>
                  )}
                </div>
              )}
              {publishError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-800 font-semibold mb-2">Error al publicar</h3>
                  <p className="text-red-600 text-sm">{publishError}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setGeneratedSite(null)}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Volver a generar
              </button>
              <a href="/" className="text-gray-600 hover:text-gray-800 underline">
                Conectar otra cuenta
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
