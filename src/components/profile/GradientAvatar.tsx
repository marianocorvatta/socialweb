interface GradientAvatarProps {
  src: string | null;
  alt: string;
  size?: number;
}

export default function GradientAvatar({
  src,
  alt,
  size = 20,
}: GradientAvatarProps) {
  if (!src) return null;

  return (
    <div className="shrink-0 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-[3px]">
      <img
        src={src}
        alt={alt}
        className={`w-${size} h-${size} rounded-full border-2 border-white`}
        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      />
    </div>
  );
}
