
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-yellow-50 flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
