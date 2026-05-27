import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Tag } from './Tag';
import { StarRating } from './StarRating';
import { MetricCard } from './MetricCard';
import { Button } from './Button';
import { MapPin, Award } from 'lucide-react';
import { useState } from 'react';

export function SupplierProfile() {
  const [activeTab, setActiveTab] = useState('sobre');

  const capabilities = [
    'Usinagem CNC',
    'Tratamento Térmico',
    'Soldagem TIG/MIG',
    'Corte a Laser',
    'Dobra de Chapas',
    'Pintura Industrial',
    'Galvanização',
    'Certificação ISO 9001',
  ];

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-primary to-primary/70 relative"></div>

      {/* Profile Header */}
      <div className="px-6">
        <div className="relative -mt-8 mb-6">
          <Avatar name="Metal Tec Indústria" size={64} className="ring-4 ring-background" />
        </div>

        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="mb-2">Metal Tec Indústria</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin size={16} />
                <span>São Bernardo do Campo, SP • Metalurgia</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="verified">Verificado</Badge>
                <Badge variant="premium">ISO 9001</Badge>
                <Badge variant="premium">CNPJ Verificado</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary">Contatar</Button>
              <Button variant="outline">Conectar</Button>
              <Button variant="icon">
                <Award size={18} />
              </Button>
            </div>
          </div>
          <StarRating rating={5} showCount count={127} />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard label="Pedidos atendidos" value="2.847" />
          <MetricCard label="Prazo médio" value="7 dias" />
          <MetricCard label="Taxa de recompra" value="94%" />
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <div className="flex gap-8">
            {['sobre', 'produtos', 'avaliações', 'conexões'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sobre' && (
          <div className="grid grid-cols-2 gap-6 pb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="mb-4">Sobre a empresa</h3>
              <p className="text-muted-foreground leading-relaxed">
                A Metal Tec Indústria atua há mais de 25 anos no segmento de metalurgia,
                oferecendo soluções completas em usinagem, soldagem e tratamento de metais.
                Atendemos diversos setores industriais com excelência e pontualidade.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Nossa equipe técnica especializada e maquinário de última geração garantem
                produtos de alta qualidade que atendem às normas mais rigorosas do mercado.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="mb-4">Capacidades técnicas</h3>
              <div className="flex flex-wrap gap-2">
                {capabilities.map((capability, index) => (
                  <Tag key={index}>{capability}</Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
