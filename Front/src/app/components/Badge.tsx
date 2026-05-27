interface BadgeProps {
  children: React.ReactNode;
  variant?: 'verified' | 'premium' | 'pending';
  className?: string;
}

export function Badge({ children, variant = 'verified', className = '' }: BadgeProps) {
  const variantStyles = {
    verified: 'bg-[#0F6E56] text-white',
    premium: 'bg-primary text-primary-foreground',
    pending: 'bg-[#BA7517] text-white',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
