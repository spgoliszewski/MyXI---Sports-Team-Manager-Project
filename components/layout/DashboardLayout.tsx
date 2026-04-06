import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout, getTeam } from '@/lib/storage';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const team = getTeam();

  useEffect(() => {
    // Apply theme on mount and when team changes
    if (team?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Apply primary color from team if present
    if (team?.colors?.primary) {
      const hexToHsl = (hex: string) => {
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16) / 255;
        const g = parseInt(h.substring(2, 4), 16) / 255;
        const b = parseInt(h.substring(4, 6), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let hh = 0, s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: hh = (g - b) / d + (g < b ? 6 : 0); break;
            case g: hh = (b - r) / d + 2; break;
            case b: hh = (r - g) / d + 4; break;
          }
          hh = hh / 6;
        }
        return [Math.round(hh * 360), Math.round(s * 100), Math.round(l * 100)];
      };
      try {
        const [h, s, l] = hexToHsl(team.colors.primary);
        document.documentElement.style.setProperty('--primary', `${h} ${s}% ${l}%`);
        const fg = l > 60 ? '0 0% 9%' : '0 0% 98%';
        document.documentElement.style.setProperty('--primary-foreground', fg);
      } catch (e) {
        // ignore
      }
    }
  }, [team?.theme, team?.colors?.primary]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/players', icon: Users, label: 'Players' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/team-settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {team?.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg">{team?.abbreviation || 'TM'}</span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{team?.name || 'Team Manager'}</h1>
                <p className="text-xs text-muted-foreground">Soccer Management System</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
