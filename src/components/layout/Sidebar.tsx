import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, HeartPulse, Settings, FileText, Bot, X } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Real-time Signals', href: '/signals', icon: Activity },
  { name: 'Sensor Status', href: '/status', icon: HeartPulse },
  { name: 'Device Settings', href: '/settings', icon: Settings },
  { name: 'Data Logs', href: '/logs', icon: FileText },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContent: React.FC = () => (
  <div className="flex flex-col h-0 flex-1">
    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-background">
      <Bot className="h-8 w-8 text-primary" />
      <span className="ml-3 text-xl font-semibold text-primary">NeuraBand</span>
    </div>
    <div className="flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => `
              ${isActive ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-accent/50 hover:text-white'}
              group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
            `}
          >
            <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-background transition-transform ease-in-out duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <SidebarContent />
        </div>
        
        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
      </div>

      {/* Static sidebar for desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-background pt-5 border-r border-muted overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
