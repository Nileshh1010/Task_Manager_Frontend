
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  text, 
  to, 
  active = false,
  onClick
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-yellow-100",
        active && "bg-yellow-100 text-yellow-900 font-medium"
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        {icon}
      </div>
      <span>{text}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  return (
    <div className="bg-white border-r w-64 h-screen flex flex-col">
      <div className="flex items-center h-16 px-4 border-b">
        <div className="flex items-center">
          <div className="bg-yellow-400 rounded-full p-2 mr-2">
            <span className="font-bold text-xl">T</span>
          </div>
          <span className="font-bold text-xl">Task Flow</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            text="Dashboard" 
            to="/dashboard" 
            active={location.pathname === '/dashboard'}
          />
          <SidebarItem 
            icon={<CheckSquare className="h-5 w-5" />} 
            text="My tasks" 
            to="/tasks" 
            active={location.pathname === '/tasks'}
          />
          <SidebarItem 
            icon={<Bell className="h-5 w-5" />} 
            text="Notifications" 
            to="/notifications" 
            active={location.pathname === '/notifications'}
          />
        </nav>
      </div>
      <div className="border-t py-4 px-3">
        <nav className="space-y-1">
          <SidebarItem 
            icon={<Settings className="h-5 w-5" />} 
            text="Settings" 
            to="/settings" 
            active={location.pathname === '/settings'}
          />
          <SidebarItem 
            icon={<LogOut className="h-5 w-5" />} 
            text="Log out" 
            to="/login"
            onClick={logout}
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
