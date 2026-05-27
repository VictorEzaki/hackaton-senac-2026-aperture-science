import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  showCount?: boolean;
  count?: number;
  size?: number;
}

export function StarRating({ rating, maxRating = 5, showCount = false, count, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => (
          <Star
            key={index}
            size={size}
            className={index < rating ? 'fill-[#BA7517] text-[#BA7517]' : 'fill-none text-gray-300'}
          />
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-sm text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
}
