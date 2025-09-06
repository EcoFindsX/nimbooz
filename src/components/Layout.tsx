import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, User, MessageCircle, History, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ecofindsLogo from '@/assets/ecofinds-logo.png';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/feed' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: PlusCircle, label: 'Sell', path: '/add-product' },
    { icon: MessageCircle, label: 'Messages', path: '/chats' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/' || location.pathname === '/auth';

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  if (isAuthPage) {
    return <div>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/feed" className="flex items-center space-x-2">
            <img src={ecofindsLogo} alt="EcoFinds" className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">EcoFinds</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/my-listings" className="text-sm font-medium text-foreground hover:text-primary">
              My Listings
            </Link>
            {user && (
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center space-y-1 p-2 ${
                location.pathname === path
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile navigation */}
      <div className="md:hidden h-16" />
    </div>
  );
};

export default Layout;