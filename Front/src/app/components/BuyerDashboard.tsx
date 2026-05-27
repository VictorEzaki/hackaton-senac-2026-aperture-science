import { MetricCard } from './MetricCard';
import { Avatar } from './Avatar';
import { StarRating } from './StarRating';
import { Button } from './Button';

export function BuyerDashboard() {
  const quotations = [
    { item: 'Parafuso M8 x 40mm', supplier: 'Ferromax', status: 'Recebida', statusColor: 'bg-[#0F6E56]' },
    { item: 'Chapa Aço 1020 3mm', supplier: 'Metal Tec Indústria', status: 'Aguardando', statusColor: 'bg-[#BA7517]' },
    { item: 'Resina PVC K67', supplier: 'Plásticos Lima', status: 'Negociando', statusColor: 'bg-pink-500' },
    { item: 'O-ring NBR 70', supplier: 'Vedações Elite', status: 'Recebida', statusColor: 'bg-[#0F6E56]' },
    { item: 'Tinta Epóxi RAL 9010', supplier: 'Química Brasil', status: 'Aguardando', statusColor: 'bg-[#BA7517]' },
  ];

  const favoriteSuppliers = [
    { name: 'Metal Tec Indústria', rating: 5 },
    { name: 'Plásticos Lima', rating: 4 },
    { name: 'Vedações Elite', rating: 5 },
    { name: 'Ferromax', rating: 4 },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <MetricCard label="Cotações abertas" value={14} />
        <MetricCard label="Pedidos em andamento" value={7} />
        <MetricCard label="Fornecedores homologados" value={32} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Quotations Table */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="mb-4">Cotações recentes</h3>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Item</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Fornecedor</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((quote, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm font-medium">{quote.item}</td>
                    <td className="py-3 text-sm text-muted-foreground">{quote.supplier}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-white text-xs font-medium ${quote.statusColor}`}>
                        {quote.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Favorite Suppliers */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="mb-4">Fornecedores favoritos</h3>
          <div className="space-y-4">
            {favoriteSuppliers.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={supplier.name} size={40} />
                  <div>
                    <h4 className="font-medium text-sm">{supplier.name}</h4>
                    <StarRating rating={supplier.rating} size={14} />
                  </div>
                </div>
                <Button variant="primary" className="text-sm px-3 py-1.5">
                  Cotar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
