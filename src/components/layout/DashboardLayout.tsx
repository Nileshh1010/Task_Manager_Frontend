import React from 'react';
import { Outlet } from 'react-router-dom'; // This is used to render nested routes
import { useAuth } from '@/context/AuthContext'; // Auth context to get user info
import Sidebar from './Sidebar'; // Sidebar component

const DashboardLayout = () => {
  const { user } = useAuth(); // Get user from Auth context
  
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar Component */}
      <Sidebar />

      <main className="flex-1 overflow-auto p-6">
        {/* Container for the page content */}
        <div className="max-w-6xl mx-auto">
          {/* Outlet for nested routes */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
