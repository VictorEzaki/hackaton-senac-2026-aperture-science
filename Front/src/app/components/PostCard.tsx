import { Avatar } from './Avatar';
import { Tag } from './Tag';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

interface PostCardProps {
  supplierName: string;
  timestamp: string;
  content: string;
  tags: string[];
  likes?: number;
  comments?: number;
}

export function PostCard({ supplierName, timestamp, content, tags, likes = 0, comments = 0 }: PostCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={supplierName} size={40} />
        <div>
          <h4 className="font-medium text-card-foreground">{supplierName}</h4>
          <p className="text-sm text-muted-foreground">{timestamp}</p>
        </div>
      </div>
      <p className="text-card-foreground mb-3">{content}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
      </div>
      <div className="flex items-center gap-6 pt-3 border-t border-border text-muted-foreground">
        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <ThumbsUp size={18} />
          <span className="text-sm">{likes}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <MessageCircle size={18} />
          <span className="text-sm">{comments}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
