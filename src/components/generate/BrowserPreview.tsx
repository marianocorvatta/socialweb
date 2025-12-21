interface BrowserPreviewProps {
  html: string;
  username: string | null;
  previewUrl: string;
}

export default function BrowserPreview({
  html,
  username,
  previewUrl,
}: BrowserPreviewProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-gray-200 bg-white">
      <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-500 text-center">
            {username}.com
          </div>
        </div>
      </div>
      <iframe
        srcDoc={html}
        className="w-full"
        style={{ height: "80vh", minHeight: "600px" }}
        title="Website Preview"
      />
    </div>
  );
}
