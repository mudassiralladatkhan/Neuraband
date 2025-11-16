import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const pageTitles: { [key: string]: string } = {
  '/': "Dashboard",
  '/signals': "Real-time Signals",
  '/status': "Sensor Status",
  '/settings': "Device Settings",
  '/logs': "Data Logs"
};

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] || "Dashboard";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="relative z-10 flex-shrink-0 h-16 bg-background flex items-center shadow-sm border-b border-muted">
      <button
        type="button"
        className="px-4 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-muted/50 border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-accent">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </button>
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-full hover:bg-accent" title="Logout">
            <LogOut className="h-6 w-6 text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
