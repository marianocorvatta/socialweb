interface ProfileStatsProps {
  postsCount: number | null;
  followersCount: number | null;
}

export default function ProfileStats({
  postsCount,
  followersCount,
}: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-4 mt-2 text-sm">
      <span className="text-gray-700">
        <span className="font-semibold text-gray-900">{postsCount}</span> posts
      </span>
      <span className="text-gray-700">
        <span className="font-semibold text-gray-900">
          {followersCount?.toLocaleString() || 0}
        </span>{" "}
        seguidores
      </span>
    </div>
  );
}
