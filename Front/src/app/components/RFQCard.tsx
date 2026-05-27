import { Button } from './Button';

interface RFQCardProps {
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export function RFQCard({ itemName, quantity, unit, unitPrice, total }: RFQCardProps) {
  return (
    <div className="bg-accent rounded-xl border border-primary/20 p-4 max-w-md">
      <h4 className="font-medium text-card-foreground mb-3">Solicitação de Cotação</h4>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Item:</span>
          <span className="font-medium">{itemName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Quantidade:</span>
          <span className="font-medium">{quantity} {unit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Preço unitário:</span>
          <span className="font-medium">R$ {unitPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="font-medium">Total:</span>
          <span className="font-medium text-primary">R$ {total.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" className="flex-1">Aceitar</Button>
        <Button variant="outline" className="flex-1">Negociar</Button>
      </div>
    </div>
  );
}
