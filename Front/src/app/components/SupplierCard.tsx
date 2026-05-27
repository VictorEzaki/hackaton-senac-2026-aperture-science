import { Avatar } from './Avatar';
import { Tag } from './Tag';
import { Badge } from './Badge';
import { StarRating } from './StarRating';
import { Clock, Package } from 'lucide-react';

interface SupplierCardProps {
  name: string;
  city: string;
  category: string;
  rating: number;
  tags: string[];
  minOrder?: string;
  deliveryTime?: string;
  verified?: boolean;
}

export function SupplierCard({ name, city, category, rating, tags, minOrder, deliveryTime, verified }: SupplierCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={name} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-card-foreground truncate">{name}</h3>
            {verified && <Badge variant="verified">Verificado</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{city} • {category}</p>
          <div className="mt-1">
            <StarRating rating={rating} size={14} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
      </div>
      {(minOrder || deliveryTime) && (
        <div className="flex items-center justify-between pt-3 border-t border-border text-sm text-muted-foreground">
          {minOrder && (
            <div className="flex items-center gap-1.5">
              <Package size={14} />
              <span>{minOrder}</span>
            </div>
          )}
          {deliveryTime && (
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{deliveryTime}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
