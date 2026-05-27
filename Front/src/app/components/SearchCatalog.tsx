import { SupplierCard } from './SupplierCard';
import { Search, ChevronDown } from 'lucide-react';

export function SearchCatalog() {
  const suppliers = [
    {
      name: 'Metal Tec Indústria',
      city: 'São Bernardo, SP',
      category: 'Metalurgia',
      rating: 5,
      tags: ['Aço Inox', 'Usinagem', 'Soldagem'],
      minOrder: 'Mín. 100kg',
      deliveryTime: '7-10 dias',
      verified: true,
    },
    {
      name: 'Plásticos Lima',
      city: 'Jundiaí, SP',
      category: 'Polímeros',
      rating: 4,
      tags: ['PVC', 'Resinas', 'Pronta Entrega'],
      minOrder: 'Mín. 500kg',
      deliveryTime: '3-5 dias',
      verified: true,
    },
    {
      name: 'Aço Certo',
      city: 'Guarulhos, SP',
      category: 'Metalurgia',
      rating: 5,
      tags: ['Chapas', 'Barras', 'Perfis'],
      minOrder: 'Mín. 200kg',
      deliveryTime: '5-7 dias',
      verified: false,
    },
    {
      name: 'Ferromax',
      city: 'Campinas, SP',
      category: 'Fixadores',
      rating: 4,
      tags: ['Parafusos', 'Porcas', 'Arruelas'],
      minOrder: 'Mín. 1000 pçs',
      deliveryTime: '2-4 dias',
      verified: true,
    },
    {
      name: 'Vedações Elite',
      city: 'Santo André, SP',
      category: 'Borrachas',
      rating: 5,
      tags: ['O-rings', 'Retentores', 'Juntas'],
      minOrder: 'Mín. 50 pçs',
      deliveryTime: '4-6 dias',
      verified: true,
    },
    {
      name: 'Química Brasil',
      city: 'São Paulo, SP',
      category: 'Química',
      rating: 4,
      tags: ['Solventes', 'Adesivos', 'Tintas'],
      minOrder: 'Mín. 20L',
      deliveryTime: '5-8 dias',
      verified: false,
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-6">
      {/* Filter Bar */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Buscar fornecedores, produtos..."
              className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2.5 bg-input-background border border-border rounded-lg text-sm cursor-pointer hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Categoria</option>
              <option>Metalurgia</option>
              <option>Polímeros</option>
              <option>Fixadores</option>
              <option>Borrachas</option>
              <option>Química</option>
            </select>
            <select className="px-4 py-2.5 bg-input-background border border-border rounded-lg text-sm cursor-pointer hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Estado</option>
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Minas Gerais</option>
            </select>
            <select className="px-4 py-2.5 bg-input-background border border-border rounded-lg text-sm cursor-pointer hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Avaliação</option>
              <option>5 estrelas</option>
              <option>4+ estrelas</option>
              <option>3+ estrelas</option>
            </select>
            <select className="px-4 py-2.5 bg-input-background border border-border rounded-lg text-sm cursor-pointer hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Certificações</option>
              <option>ISO 9001</option>
              <option>ISO 14001</option>
              <option>CNPJ Verificado</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          <span className="font-medium text-foreground">{suppliers.length}</span> fornecedores encontrados
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-4">
        {suppliers.map((supplier, index) => (
          <SupplierCard key={index} {...supplier} />
        ))}
      </div>
    </div>
  );
}
