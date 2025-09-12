import { Star } from "lucide-react";

export default function RatingStars({ rating=0, count=0, size=16 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} size={size} className="text-amber-500 fill-amber-500" />
        ))}
        {half && <Star size={size} className="text-amber-500" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} size={size} className="text-gray-300" />
        ))}
      </div>
      <span className="text-sm text-gray-600">({count})</span>
    </div>
  );
}
