import { FullProfileData } from "@/types/instagram";

interface RawDataToggleProps {
  profileData: FullProfileData;
}

export default function RawDataToggle({ profileData }: RawDataToggleProps) {
  return (
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
  );
}
