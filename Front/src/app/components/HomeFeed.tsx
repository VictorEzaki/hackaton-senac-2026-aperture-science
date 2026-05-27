import { Avatar } from './Avatar';
import { PostCard } from './PostCard';
import { Button } from './Button';
import { Users, Eye, Bookmark } from 'lucide-react';

export function HomeFeed() {
  const posts = [
    {
      supplierName: 'Metal Tec Indústria',
      timestamp: 'Há 2 horas',
      content: 'Acabamos de lançar nossa nova linha de chapas de aço inox 304 com acabamento espelhado. Estoque disponível para pronta entrega!',
      tags: ['Metalurgia', 'Aço Inox', 'Pronta Entrega'],
      likes: 24,
      comments: 8,
    },
    {
      supplierName: 'Plásticos Lima',
      timestamp: 'Há 5 horas',
      content: 'Promoção especial: 15% de desconto em todas as resinas PVC para pedidos acima de 500kg. Válido até o final do mês.',
      tags: ['Polímeros', 'PVC', 'Promoção'],
      likes: 42,
      comments: 15,
    },
    {
      supplierName: 'Vedações Elite',
      timestamp: 'Há 1 dia',
      content: 'Certificação ISO 9001 renovada! Continuamos comprometidos com a excelência na fabricação de vedações industriais.',
      tags: ['Borrachas', 'Certificação', 'Qualidade'],
      likes: 67,
      comments: 22,
    },
  ];

  const suggestedSuppliers = [
    { name: 'Aço Certo', category: 'Metalurgia' },
    { name: 'Ferromax', category: 'Fixadores' },
    { name: 'Química Brasil', category: 'Química' },
  ];

  const followedCategories = ['Metalurgia', 'Polímeros', 'Fixadores', 'Borrachas', 'Embalagem'];

  return (
    <div className="flex gap-6 max-w-[1440px] mx-auto p-6">
      {/* Left Sidebar */}
      <div className="w-60 flex-shrink-0">
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <div className="flex flex-col items-center text-center mb-4">
            <Avatar name="Indústria Brasil" size={64} className="mb-3" />
            <h3 className="font-medium text-card-foreground">Indústria Brasil</h3>
            <p className="text-sm text-muted-foreground">São Paulo, SP</p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users size={14} />
              <span>124 seguindo</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Eye size={14} />
              <span>856 visualizações</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bookmark size={16} className="text-muted-foreground" />
            <h4 className="font-medium text-card-foreground">Categorias seguidas</h4>
          </div>
          <div className="space-y-2">
            {followedCategories.map((category, index) => (
              <div key={index} className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Feed */}
      <div className="flex-1 max-w-[660px] space-y-4">
        {posts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="w-[280px] flex-shrink-0">
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="font-medium text-card-foreground mb-4">Fornecedores sugeridos</h4>
          <div className="space-y-4">
            {suggestedSuppliers.map((supplier, index) => (
              <div key={index} className="flex items-start gap-3">
                <Avatar name={supplier.name} size={40} />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm text-card-foreground truncate">{supplier.name}</h5>
                  <p className="text-xs text-muted-foreground">{supplier.category}</p>
                  <Button variant="outline" className="mt-2 text-xs px-3 py-1">
                    + Seguir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
