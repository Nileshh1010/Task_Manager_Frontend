import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
        "flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-secondary",
        active && "bg-secondary text-white font-medium"
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="bg-sidebar-background border-r border-sidebar-border w-64 h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-600 rounded-full p-2">
            <span className="font-bold text-xl text-white">T</span>
          </div>
          <h1 className="text-xl font-bold text-white">Task Flow</h1>
        </div>

        <nav className="space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            text="Dashboard" 
            to="/dashboard"
            active={location.pathname === '/dashboard'}
          />
          <Link
            to="/dashboard/tasks"
            className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md"
          >
            <CheckSquare size={20} />
            <span>Tasks</span>
          </Link>
          <Link
            to="/dashboard/notifications"
            className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md"
          >
            <Bell size={20} />
            <span>Notifications</span>
          </Link>
          {/* <SidebarItem 
            icon={<Settings className="h-5 w-5" />} 
            text="Settings" 
            to="/settings" 
            active={location.pathname === '/settings'}
          /> */}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md w-full"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;