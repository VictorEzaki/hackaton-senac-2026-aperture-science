interface MetricCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function MetricCard({ label, value, className = '' }: MetricCardProps) {
  return (
    <div className={`bg-card rounded-xl border border-border p-4 ${className}`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-medium text-card-foreground">{value}</p>
    </div>
  );
}
