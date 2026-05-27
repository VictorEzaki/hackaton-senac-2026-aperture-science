interface AvatarProps {
  name: string;
  size?: 28 | 32 | 40 | 48 | 64;
  className?: string;
}

export function Avatar({ name, size = 40, className = '' }: AvatarProps) {
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    28: 'w-7 h-7 text-[11px]',
    32: 'w-8 h-8 text-xs',
    40: 'w-10 h-10 text-sm',
    48: 'w-12 h-12 text-base',
    64: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
