import { Home, Search, MessageSquare, LayoutDashboard, User } from 'lucide-react';

interface NavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function Navigation({ activeScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'feed', label: 'Início', icon: Home },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SN</span>
              </div>
              <h1 className="text-xl text-primary">SupplyNet</h1>
            </div>

            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
