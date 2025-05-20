
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/button';
import { LogOut, Menu, X } from 'lucide-react';

const AppHeader = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-20 border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-primary font-bold text-xl flex items-center">
          <span className="text-2xl mr-1">💸</span> SmartPay
        </Link>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
              <Link to="/transfer" className="hover:text-primary">Transfer</Link>
              {user.isAdmin && (
                <Link to="/admin" className="hover:text-primary">Admin</Link>
              )}
              <div className="flex items-center gap-4 ml-6">
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" /> 
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b shadow-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {user && (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="py-2 px-4 hover:bg-muted rounded-md">
                    Dashboard
                  </Link>
                  <Link to="/transfer" onClick={() => setIsMenuOpen(false)} className="py-2 px-4 hover:bg-muted rounded-md">
                    Transfer
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="py-2 px-4 hover:bg-muted rounded-md">
                      Admin
                    </Link>
                  )}
                  <div className="pt-4 mt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {user.name}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" /> 
                        Logout
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
