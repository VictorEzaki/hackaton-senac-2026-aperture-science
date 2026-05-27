import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'icon';
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

export function Button({ children, variant = 'primary', onClick, className = '', icon }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-colors font-medium';

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2',
    outline: 'border border-border text-foreground hover:bg-muted px-4 py-2',
    icon: 'text-muted-foreground hover:bg-muted p-2',
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {icon}
      {children}
    </button>
  );
}
