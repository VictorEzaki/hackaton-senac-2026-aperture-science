import { useState } from "react";
import {
  Search,
  MapPin,
  BadgeCheck,
  FileText,
  Heart,
  Filter,
  Package,
  Truck,
  Leaf,
  Award,
  ThumbsUp,
  Clock,
  X,
  ChevronDown,
  Building2,
  Zap,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  Plus,
  Star,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  User,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "busca"
  | "resultados"
  | "perfil"
  | "login"
  | "cadastro-empresa"
  | "cadastro-fornecedor";

interface Supplier {
  id: string;
  name: string;
  initials: string;
  category: string;
  subcategory: string;
  location: string;
  state: string;
  rating: number;
  reviews: number;
  verified: boolean;
  esg: boolean;
  matchScore: number;
  deliveryDays: string;
  priceRange: string;
  description: string;
  tags: string[];
  employees: string;
  founded: string;
  certifications: string[];
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUPPLIERS: Supplier[] = [
  {
    id: "1",
    name: "EcoPack Embalagens",
    initials: "EP",
    category: "Embalagens",
    subcategory: "Embalagens Sustentáveis",
    location: "Joinville",
    state: "SC",
    rating: 4.9,
    reviews: 143,
    verified: true,
    esg: true,
    matchScore: 97,
    deliveryDays: "5–8 dias",
    priceRange: "R$ 0,45–2,80 / un",
    description:
      "Especialistas em embalagens biodegradáveis e recicláveis para e-commerce e varejo. Certificação FSC e ISO 14001.",
    tags: ["Biodegradável", "FSC", "ISO 14001", "E-commerce"],
    employees: "120–180",
    founded: "2011",
    certifications: ["FSC", "ISO 14001", "ABNT NBR"],
    color: "#0F6E56",
  },
  {
    id: "2",
    name: "GreenBox Soluções",
    initials: "GB",
    category: "Embalagens",
    subcategory: "Caixas e Papelão",
    location: "Blumenau",
    state: "SC",
    rating: 4.7,
    reviews: 89,
    verified: true,
    esg: true,
    matchScore: 93,
    deliveryDays: "3–5 dias",
    priceRange: "R$ 0,30–1,90 / un",
    description:
      "Fabricante de caixas de papelão ondulado com linha eco. Entrega expressa para toda Santa Catarina e Paraná.",
    tags: ["Papelão Ondulado", "Entrega Expressa", "Reciclável"],
    employees: "80–120",
    founded: "2015",
    certifications: ["ISO 9001", "ABNT"],
    color: "#185FA5",
  },
  {
    id: "3",
    name: "Flexpack Indústria",
    initials: "FP",
    category: "Embalagens",
    subcategory: "Embalagens Flexíveis",
    location: "Florianópolis",
    state: "SC",
    rating: 4.5,
    reviews: 61,
    verified: false,
    esg: false,
    matchScore: 81,
    deliveryDays: "7–12 dias",
    priceRange: "R$ 0,20–1,10 / un",
    description:
      "Embalagens plásticas flexíveis, sacos, bobinas e bags. Produção sob demanda com prazo competitivo.",
    tags: ["Plástico Flexível", "Sacos", "Bobinas"],
    employees: "40–80",
    founded: "2009",
    certifications: ["ISO 9001"],
    color: "#6B7280",
  },
  {
    id: "4",
    name: "MetalTec Indústria",
    initials: "MT",
    category: "Metalurgia",
    subcategory: "Peças e Componentes",
    location: "São Paulo",
    state: "SP",
    rating: 4.8,
    reviews: 212,
    verified: true,
    esg: false,
    matchScore: 74,
    deliveryDays: "10–15 dias",
    priceRange: "Sob consulta",
    description:
      "Fabricação de peças metálicas sob medida. Usinagem CNC, estamparia e injeção. 30 anos de mercado.",
    tags: ["CNC", "Estamparia", "Aço Inox"],
    employees: "200–350",
    founded: "1993",
    certifications: ["ISO 9001", "ISO 45001"],
    color: "#BA7517",
  },
];

const REVIEWS = [
  {
    company: "Grupo Natura Alimentos",
    reviewer: "Carlos M.",
    role: "Gerente de Compras",
    rating: 5,
    date: "15 mai 2025",
    text: "Excelente parceiro. Entrega sempre no prazo, produto de alta qualidade e atendimento impecável. Já fechamos 3 pedidos e todos acima das expectativas.",
    helpful: 28,
  },
  {
    company: "Loggi Express",
    reviewer: "Fernanda R.",
    role: "Diretora de Operações",
    rating: 5,
    date: "02 abr 2025",
    text: "A EcoPack nos ajudou a reduzir nossa pegada de carbono em 40%. Material resistente e preço justo. Recomendo fortemente para qualquer empresa que busca sustentabilidade.",
    helpful: 41,
  },
  {
    company: "Casa & Cia Varejo",
    reviewer: "Roberto A.",
    role: "Comprador Sênior",
    rating: 4,
    date: "18 mar 2025",
    text: "Ótimo produto e fornecedor confiável. Única ressalva é o prazo de entrega que às vezes estica um pouco além do prometido, mas a qualidade compensa.",
    helpful: 15,
  },
];

// ─── Shared Components ────────────────────────────────────────────────────────

function Avatar({
  initials,
  color,
  size = "md",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
  };
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.round(rating)
              ? "fill-amber-500 text-amber-500"
              : "text-gray-200"
          }`}
        />
      ))}
      <span className="text-sm font-semibold text-foreground ml-0.5">
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}

function MatchBar({ score }: { score: number }) {
  const color =
    score >= 90 ? "#0F6E56" : score >= 75 ? "#185FA5" : "#BA7517";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold" style={{ color }}>
        {score}% match
      </span>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Nav({
  screen,
  setScreen,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
}) {
  const [cadastroOpen, setCadastroOpen] = useState(false);

  const navItems: { id: Screen; label: string }[] = [
    { id: "busca", label: "Buscar" },
    { id: "resultados", label: "Catálogo" },
  ];

  const isAuthScreen = ["login", "cadastro-empresa", "cadastro-fornecedor"].includes(screen);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setScreen("busca")}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight">
            SupplyNet
          </span>
        </button>

        {/* Nav links */}
        {!isAuthScreen && (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Auth actions */}
        <div className="flex items-center gap-2">
          {isAuthScreen ? (
            <button
              onClick={() => setScreen("busca")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          ) : (
            <>
              <button
                onClick={() => setScreen("login")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                Entrar
              </button>

              {/* Cadastrar dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCadastroOpen((v) => !v)}
                  className="flex items-center gap-1.5 bg-primary hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Cadastrar
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {cadastroOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setCadastroOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-20">
                      <button
                        onClick={() => {
                          setScreen("cadastro-empresa");
                          setCadastroOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Sou Empresa
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Busco fornecedores
                            </p>
                          </div>
                        </div>
                      </button>
                      <div className="h-px bg-border mx-3" />
                      <button
                        onClick={() => {
                          setScreen("cadastro-fornecedor");
                          setCadastroOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <Package className="w-4 h-4 text-teal-700" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Sou Fornecedor
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Quero me cadastrar
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Screen: Login ────────────────────────────────────────────────────────────

function LoginScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<"empresa" | "fornecedor">("empresa");

  return (
    <main className="min-h-[calc(100vh-56px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-primary p-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">SupplyNet</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            O ecossistema inteligente de fornecedores B2B
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">
            Conectamos empresas a fornecedores qualificados com match inteligente, reputação verificada e cotações em minutos.
          </p>
          <div className="space-y-3">
            {[
              { icon: ShieldCheck, label: "12.400+ fornecedores verificados" },
              { icon: Zap, label: "Match por IA em segundos" },
              { icon: Award, label: "Sistema de reputação transparente" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-blue-100">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-blue-300 text-xs">© 2025 SupplyNet. Todos os direitos reservados.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-foreground mb-1">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground mb-7">
            Não tem conta?{" "}
            <button
              onClick={() => setScreen("cadastro-empresa")}
              className="text-primary font-semibold hover:underline"
            >
              Cadastre-se grátis
            </button>
          </p>

          {/* Tab selector */}
          <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6">
            {(["empresa", "fornecedor"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  tab === t
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {t === "empresa" ? "Sou Empresa" : "Sou Fornecedor"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                E-mail corporativo
              </label>
              <input
                type="email"
                placeholder="seu@empresa.com.br"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Senha</label>
                <button className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white pr-10"
                />
                <button
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              Entrar na plataforma
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">ou continue com</span>
            </div>
          </div>

          <button className="w-full border border-border rounded-xl py-3 text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </button>
        </div>
      </div>
    </main>
  );
}

// ─── Screen: Cadastro Empresa ─────────────────────────────────────────────────

function CadastroEmpresaScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const steps = ["Dados da empresa", "Responsável", "Preferências"];

  return (
    <main className="min-h-[calc(100vh-56px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 bg-primary p-10">
        <div />
        <div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight mb-3">
            Encontre fornecedores ideais para o seu negócio
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">
            Acesso gratuito a milhares de fornecedores verificados. Match inteligente com IA. Cotações em minutos.
          </p>
          <div className="space-y-3">
            {["Busca por linguagem natural", "Match por IA personalizado", "Fornecedores verificados", "Cotações estruturadas"].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                <span className="text-sm text-blue-100">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-300 text-xs">Cadastro gratuito · Sem cartão de crédito</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Steps */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  i + 1 < step
                    ? "bg-teal-500 text-white"
                    : i + 1 === step
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i + 1 === step ? "text-foreground" : "text-muted-foreground"}`}>
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px ${i + 1 < step ? "bg-teal-400" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">
            {step === 1 && "Dados da empresa"}
            {step === 2 && "Responsável pelo cadastro"}
            {step === 3 && "Preferências de busca"}
          </h1>
          <p className="text-sm text-muted-foreground mb-7">
            Já tem conta?{" "}
            <button onClick={() => setScreen("login")} className="text-primary font-semibold hover:underline">
              Entrar
            </button>
          </p>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground block mb-1.5">Razão social *</label>
                  <input placeholder="Nome completo da empresa" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">CNPJ *</label>
                  <input placeholder="00.000.000/0001-00" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Porte da empresa</label>
                  <select className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white text-foreground">
                    <option value="">Selecione</option>
                    <option>MEI</option>
                    <option>Micro</option>
                    <option>Pequena</option>
                    <option>Média</option>
                    <option>Grande</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground block mb-1.5">Setor de atuação *</label>
                  <select className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white text-foreground">
                    <option value="">Selecione o setor</option>
                    <option>Alimentício</option>
                    <option>Automotivo</option>
                    <option>Construção Civil</option>
                    <option>E-commerce / Varejo</option>
                    <option>Indústria Geral</option>
                    <option>Saúde</option>
                    <option>Tecnologia</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Estado *</label>
                  <select className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white text-foreground">
                    <option value="">UF</option>
                    {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                      <option key={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Cidade *</label>
                  <input placeholder="Sua cidade" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2">
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Nome *</label>
                  <input placeholder="Seu nome" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Sobrenome *</label>
                  <input placeholder="Seu sobrenome" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground block mb-1.5">Cargo</label>
                  <input placeholder="Ex: Gerente de Compras" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground block mb-1.5">E-mail corporativo *</label>
                  <input type="email" placeholder="seu@empresa.com.br" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground block mb-1.5">Telefone</label>
                  <input placeholder="(00) 00000-0000" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Senha *</label>
                  <input type="password" placeholder="Mín. 8 caracteres" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Confirmar senha *</label>
                  <input type="password" placeholder="Repita a senha" className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-border py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                  Voltar
                </button>
                <button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Quais categorias de fornecedor você busca? (selecione todas que se aplicam)
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Embalagens", "Metalurgia", "Polímeros", "Fixadores", "Logística", "Matéria-Prima", "Equipamentos", "Serviços Industriais", "TI / Software", "Limpeza"].map((cat) => (
                    <CategoryChip key={cat} label={cat} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Regiões de interesse
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Sul", "Sudeste", "Centro-Oeste", "Nordeste", "Norte", "Todo o Brasil"].map((r) => (
                    <CategoryChip key={r} label={r} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Volume de compras mensal estimado
                </label>
                <select className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white text-foreground">
                  <option>Até R$ 10 mil</option>
                  <option>R$ 10k – R$ 50k</option>
                  <option>R$ 50k – R$ 200k</option>
                  <option>Acima de R$ 200k</option>
                </select>
              </div>
              <div className="flex items-start gap-2.5 p-3 bg-secondary border border-blue-100 rounded-xl">
                <input type="checkbox" id="terms" className="mt-0.5 accent-primary" />
                <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                  Concordo com os <span className="text-primary font-semibold">Termos de Uso</span> e a{" "}
                  <span className="text-primary font-semibold">Política de Privacidade</span> da SupplyNet.
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-border py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                  Voltar
                </button>
                <button
                  onClick={() => setScreen("busca")}
                  className="flex-1 bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Criar conta gratuita
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function CategoryChip({ label }: { label: string }) {
  const [selected, setSelected] = useState(false);
  return (
    <button
      onClick={() => setSelected((v) => !v)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        selected
          ? "bg-primary text-white border-primary"
          : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Screen: Cadastro Fornecedor ──────────────────────────────────────────────

function CadastroFornecedorScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    razaoSocial: "",
    nome_fantasia: "",
    cnpj: "",
    email: "",
    telefone: "",
    senha: "",
    descricao: "",
    tempo_mercado: "",
    website: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = ["Empresa", "Contato", "Perfil"];
  const inputClass =
    "w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white";

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const isValidUrl = (value: string) => {
    if (!value.trim()) return true;

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = (targetStep = step) => {
    if (targetStep === 1) {
      if (!formData.razaoSocial.trim() || !formData.nome_fantasia.trim() || !formData.cnpj.trim()) {
        setError("Preencha razão social, nome fantasia e CNPJ para continuar.");
        return false;
      }
    }

    if (targetStep === 2) {
      if (!formData.email.trim() || !formData.telefone.trim() || !formData.senha.trim()) {
        setError("Preencha e-mail, telefone e senha para continuar.");
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Informe um e-mail válido.");
        return false;
      }

      if (formData.senha.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        return false;
      }
    }

    if (targetStep === 3) {
      if (!formData.descricao.trim() || !formData.tempo_mercado.trim()) {
        setError("Preencha a descrição e o tempo de mercado para criar o perfil.");
        return false;
      }

      if (!isValidUrl(formData.website)) {
        setError("Informe um site válido, incluindo http:// ou https://.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const goToStep = (nextStep: number) => {
    if (nextStep > step && !validateStep(step)) return;
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    setIsSubmitting(true);
    setError("");

    const payload = {
      razaoSocial: formData.razaoSocial.trim(),
      nome_fantasia: formData.nome_fantasia.trim(),
      cnpj: formData.cnpj.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone.trim(),
      senha: formData.senha,
      descricao: formData.descricao.trim(),
      tempo_mercado: formData.tempo_mercado.trim(),
      website: formData.website.trim(),
    };

    try {
      const response = await fetch("/api/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.erro || "Não foi possível cadastrar o fornecedor.");
        return;
      }

      setScreen("busca");
    } catch {
      setError("Não foi possível conectar com a API. Tente novamente em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-56px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 bg-[#0F6E56] p-10">
        <div />
        <div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight mb-3">
            Mostre seu negócio para milhares de compradores
          </h2>
          <p className="text-green-200 text-sm leading-relaxed mb-8">
            Crie seu perfil completo e seja encontrado por empresas que precisam exatamente do que você oferece.
          </p>
          <div className="space-y-3">
            {[
              "Perfil público otimizado",
              "Match automático com compradores",
              "Sistema de avaliação e reputação",
              "Receba RFQs diretamente",
              "Destaque por certificações ESG",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                <span className="text-sm text-green-100">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-green-300 text-xs">Plano gratuito disponível · Upgrade quando quiser</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Steps */}
          <div className="flex items-center gap-1.5 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  i + 1 < step
                    ? "bg-teal-500 text-white"
                    : i + 1 === step
                    ? "bg-[#0F6E56] text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i + 1 === step ? "text-foreground" : "text-muted-foreground"}`}>
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px ${i + 1 < step ? "bg-teal-400" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">
            {step === 1 && "Dados da empresa"}
            {step === 2 && "Contato e acesso"}
            {step === 3 && "Perfil público"}
          </h1>
          <p className="text-sm text-muted-foreground mb-7">
            Já tem conta?{" "}
            <button onClick={() => setScreen("login")} className="text-primary font-semibold hover:underline">
              Entrar
            </button>
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Razão social *</label>
                <input
                  value={formData.razaoSocial}
                  onChange={(event) => updateField("razaoSocial", event.target.value)}
                  placeholder="Tech Solutions Industria e Comercio LTDA"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Nome fantasia *</label>
                <input
                  value={formData.nome_fantasia}
                  onChange={(event) => updateField("nome_fantasia", event.target.value)}
                  placeholder="Tech Solutions"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">CNPJ *</label>
                <input
                  value={formData.cnpj}
                  onChange={(event) => updateField("cnpj", event.target.value)}
                  placeholder="12.345.678/0001-90"
                  className={inputClass}
                />
              </div>
              <button onClick={() => goToStep(2)} className="w-full bg-[#0F6E56] hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">E-mail *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="contato@techsolutions.com.br"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Telefone *</label>
                <input
                  value={formData.telefone}
                  onChange={(event) => updateField("telefone", event.target.value)}
                  placeholder="(47) 99999-9999"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Senha *</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(event) => updateField("senha", event.target.value)}
                  placeholder="Mín. 6 caracteres"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => goToStep(1)} className="flex-1 border border-border py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors">Voltar</button>
                <button onClick={() => goToStep(3)} className="flex-1 bg-[#0F6E56] hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">Continuar</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Descrição da empresa *</label>
                <textarea
                  value={formData.descricao}
                  onChange={(event) => updateField("descricao", event.target.value)}
                  placeholder="Fornecedor especializado em soluções tecnológicas para pequenas e médias empresas."
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Tempo de mercado *</label>
                <input
                  value={formData.tempo_mercado}
                  onChange={(event) => updateField("tempo_mercado", event.target.value)}
                  placeholder="5 anos"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Site da empresa</label>
                <input
                  value={formData.website}
                  onChange={(event) => updateField("website", event.target.value)}
                  placeholder="https://www.techsolutions.com.br"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => goToStep(2)} className="flex-1 border border-border py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors">Voltar</button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#0F6E56] hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {isSubmitting ? "Criando..." : "Criar perfil gratuito"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Screen: Busca Inteligente ────────────────────────────────────────────────

function BuscaScreen({
  setScreen,
  setQuery,
}: {
  setScreen: (s: Screen) => void;
  setQuery: (q: string) => void;
}) {
  const [input, setInput] = useState("");
  const suggestions = [
    "Embalagens sustentáveis em Santa Catarina",
    "Fornecedor de fixadores com entrega rápida",
    "Metalurgia certificada ISO no Sul",
    "Polímeros para indústria alimentícia SP",
    "Fornecedor ESG de papelão ondulado",
  ];

  const handleSearch = (q: string) => {
    setQuery(q);
    setScreen("resultados");
  };

  return (
    <main className="min-h-[calc(100vh-56px)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-secondary text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-8 border border-blue-100">
          <Zap className="w-3 h-3" />
          Match inteligente com IA
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-3xl mb-4">
          Encontre o fornecedor{" "}
          <span className="text-primary">ideal</span> para o seu negócio
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-10">
          Descreva o que você precisa em linguagem natural. Nossa IA encontra os fornecedores com maior compatibilidade com sua demanda.
        </p>

        <div className="w-full max-w-2xl">
          <div className="bg-white border-2 border-border rounded-2xl shadow-sm hover:border-primary/30 focus-within:border-primary transition-colors p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) handleSearch(input.trim());
                }
              }}
              placeholder="Ex: Preciso de fornecedor de embalagens sustentáveis em Santa Catarina com entrega rápida..."
              rows={3}
              className="w-full resize-none border-0 outline-none text-base text-foreground placeholder:text-muted-foreground bg-transparent"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors">
                  <MapPin className="w-3 h-3" /> Localização
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors">
                  <Package className="w-3 h-3" /> Categoria
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors">
                  <Leaf className="w-3 h-3" /> ESG
                </button>
              </div>
              <button
                onClick={() => input.trim() && handleSearch(input.trim())}
                className="bg-primary hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Buscar
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                  handleSearch(s);
                }}
                className="text-xs text-muted-foreground hover:text-primary bg-white hover:bg-secondary border border-border hover:border-primary/30 px-3 py-1.5 rounded-full transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-white py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "12.400+", label: "Fornecedores cadastrados" },
            { value: "89 categorias", label: "Segmentos industriais" },
            { value: "4.8 / 5", label: "Satisfação média" },
            { value: "94%", label: "Match de qualidade" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-12 px-6 max-w-5xl mx-auto w-full">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
          Categorias em destaque
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { icon: Package, label: "Embalagens" },
            { icon: Building2, label: "Metalurgia" },
            { icon: Leaf, label: "ESG / Verde" },
            { icon: Truck, label: "Logística" },
            { icon: Award, label: "Fixadores" },
            { icon: Globe, label: "Polímeros" },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => handleSearch(cat.label)}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-border rounded-xl hover:border-primary/40 hover:bg-secondary transition-all group"
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-foreground">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

// ─── Screen: Resultados / Catálogo ────────────────────────────────────────────

function ResultadosScreen({
  query,
  setQuery,
  setActiveSupplier,
  setScreen,
}: {
  query: string;
  setQuery: (q: string) => void;
  setActiveSupplier: (id: string) => void;
  setScreen: (s: Screen) => void;
}) {
  const [localQuery, setLocalQuery] = useState(query);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("match");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyESG, setOnlyESG] = useState(false);

  const filters = ["Todos", "Embalagens", "Metalurgia", "Polímeros", "Fixadores", "Logística"];

  const sorted = [...SUPPLIERS]
    .filter((s) => !onlyVerified || s.verified)
    .filter((s) => !onlyESG || s.esg)
    .filter((s) => activeFilter === "Todos" || s.category === activeFilter)
    .sort((a, b) =>
      sortBy === "match" ? b.matchScore - a.matchScore : b.rating - a.rating
    );

  const openPerfil = (id: string) => {
    setActiveSupplier(id);
    setScreen("perfil");
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQuery(localQuery)}
            className="flex-1 border-0 outline-none text-sm text-foreground bg-transparent"
            placeholder="Refine sua busca..."
          />
          {localQuery && (
            <button
              onClick={() => setLocalQuery("")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-3 text-sm font-medium hover:border-primary/40 transition-colors">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      {query && (
        <div className="mb-6 p-4 bg-secondary border border-blue-100 rounded-xl flex items-start gap-3">
          <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-0.5">
              Busca analisada pela IA
            </p>
            <p className="text-sm text-muted-foreground">
              "{query}" — exibindo {sorted.length} fornecedores mais compatíveis,
              ranqueados por localização, reputação, sustentabilidade e prazo.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white border border-border rounded-xl p-4 sticky top-20">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Categoria
            </p>
            <div className="space-y-1 mb-5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                    activeFilter === f
                      ? "bg-secondary text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Qualificação
              </p>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-foreground">Somente verificados</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyESG}
                  onChange={(e) => setOnlyESG(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-foreground">Práticas ESG</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {sorted.length} fornecedores encontrados
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Ordenar por</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-border rounded-lg px-2 py-1 bg-white outline-none"
              >
                <option value="match">Melhor match</option>
                <option value="rating">Avaliação</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {sorted.map((supplier, idx) => (
              <div
                key={supplier.id}
                className="bg-white border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => openPerfil(supplier.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <Avatar initials={supplier.initials} color={supplier.color} size="lg" />
                    {idx === 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        #1
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          {supplier.name}
                        </h3>
                        {supplier.verified && (
                          <span
                            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: "#E6F7F3", color: "#0F6E56" }}
                          >
                            <BadgeCheck className="w-3 h-3" /> Verificado
                          </span>
                        )}
                        {supplier.esg && (
                          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-green-50 text-green-700">
                            <Leaf className="w-3 h-3" /> ESG
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {supplier.subcategory}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {supplier.location}, {supplier.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        {supplier.deliveryDays}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {supplier.description}
                    </p>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <StarRating rating={supplier.rating} count={supplier.reviews} />
                        <span className="text-xs text-muted-foreground">
                          {supplier.priceRange}
                        </span>
                      </div>
                      <div className="w-48 flex-shrink-0">
                        <MatchBar score={supplier.matchScore} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Screen: Perfil do Fornecedor ─────────────────────────────────────────────

function PerfilScreen({
  supplierId,
  setScreen,
}: {
  supplierId: string;
  setScreen: (s: Screen) => void;
}) {
  const supplier = SUPPLIERS.find((s) => s.id === supplierId) ?? SUPPLIERS[0];
  const [activeTab, setActiveTab] = useState("sobre");
  const tabs = ["sobre", "produtos", "avaliações", "portfólio", "esg"];

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      {/* Back breadcrumb */}
      <button
        onClick={() => setScreen("resultados")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
      </button>

      {/* Banner */}
      <div
        className="h-36 rounded-2xl mb-0 overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${supplier.color}22 0%, ${supplier.color}55 100%)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header card */}
      <div className="bg-white border border-border rounded-2xl p-6 -mt-px mb-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="-mt-12 relative">
            <Avatar initials={supplier.initials} color={supplier.color} size="xl" />
            {supplier.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                <BadgeCheck className="w-5 h-5" style={{ color: "#0F6E56" }} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl font-bold text-foreground">{supplier.name}</h1>
                  {supplier.verified && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: "#E6F7F3", color: "#0F6E56" }}
                    >
                      Verificado
                    </span>
                  )}
                  {supplier.esg && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-green-50 text-green-700">
                      ESG
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {supplier.subcategory} · {supplier.location}, {supplier.state} · Desde{" "}
                  {supplier.founded}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <StarRating rating={supplier.rating} count={supplier.reviews} />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    {supplier.deliveryDays}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {supplier.employees} funcionários
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                  <Heart className="w-4 h-4" /> Favoritar
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                  <FileText className="w-4 h-4" /> Solicitar Cotação
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-border">
          {[
            { label: "Confiabilidade", value: "98%", icon: ShieldCheck, color: "#0F6E56" },
            { label: "Entregas no prazo", value: "94%", icon: Truck, color: "#185FA5" },
            { label: "Tempo de resposta", value: "< 4h", icon: Clock, color: "#BA7517" },
            { label: "Clientes ativos", value: "47", icon: Building2, color: "#6B7280" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="text-center p-3 bg-muted rounded-xl">
                <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: m.color }} />
                <div className="text-lg font-bold text-foreground">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`capitalize flex-1 min-w-[80px] px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === t
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "avaliações"
              ? `Avaliações (${supplier.reviews})`
              : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "sobre" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3">Sobre a empresa</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {supplier.description} Com mais de{" "}
                {new Date().getFullYear() - parseInt(supplier.founded)} anos de experiência,
                a {supplier.name} se consolida como referência em qualidade e confiabilidade
                no setor de {supplier.category.toLowerCase()}.
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3">Categorias de produto</h3>
              <div className="flex flex-wrap gap-2">
                {supplier.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-3 text-sm">Certificações</h4>
              <div className="space-y-2">
                {supplier.certifications.map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <Award className="w-4 h-4" style={{ color: "#BA7517" }} />
                    <span className="text-sm text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-3 text-sm">Contato</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  contato@{supplier.name.toLowerCase().replace(/\s+/g, "")}.com.br
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" /> (47) 3300-0000
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-3.5 h-3.5" />
                  www.{supplier.name.toLowerCase().replace(/\s+/g, "")}.com.br
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "avaliações" && (
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-xl p-5 flex gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground">
                {supplier.rating.toFixed(1)}
              </div>
              <StarRating rating={supplier.rating} />
              <p className="text-xs text-muted-foreground mt-1">{supplier.reviews} avaliações</p>
            </div>
            <div className="flex-1 min-w-[200px] space-y-2">
              {[
                { label: "Qualidade", pct: 96 },
                { label: "Prazo de entrega", pct: 91 },
                { label: "Comunicação", pct: 98 },
                { label: "Custo-benefício", pct: 88 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-8">
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {r.reviewer[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">
                        {r.company}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        via {r.reviewer} · {r.role}
                      </span>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{r.text}</p>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" /> Útil ({r.helpful})
              </button>
            </div>
          ))}
        </div>
      )}

      {(activeTab === "produtos" || activeTab === "portfólio" || activeTab === "esg") && (
        <div className="bg-white border border-border rounded-xl p-8 text-center text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Conteúdo em breve</p>
          <p className="text-sm mt-1">
            O fornecedor ainda não adicionou informações nesta seção.
          </p>
        </div>
      )}
    </main>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("busca");
  const [query, setQuery] = useState("");
  const [activeSupplierId, setActiveSupplierId] = useState("1");

  const renderScreen = () => {
    switch (screen) {
      case "busca":
        return <BuscaScreen setScreen={setScreen} setQuery={setQuery} />;
      case "resultados":
        return (
          <ResultadosScreen
            query={query}
            setQuery={setQuery}
            setActiveSupplier={setActiveSupplierId}
            setScreen={setScreen}
          />
        );
      case "perfil":
        return <PerfilScreen supplierId={activeSupplierId} setScreen={setScreen} />;
      case "login":
        return <LoginScreen setScreen={setScreen} />;
      case "cadastro-empresa":
        return <CadastroEmpresaScreen setScreen={setScreen} />;
      case "cadastro-fornecedor":
        return <CadastroFornecedorScreen setScreen={setScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav screen={screen} setScreen={setScreen} />
      {renderScreen()}
    </div>
  );
}
