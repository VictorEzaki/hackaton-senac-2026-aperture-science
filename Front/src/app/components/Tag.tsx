interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className = '' }: TagProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[11px] ${className}`}>
      {children}
    </span>
  );
}
