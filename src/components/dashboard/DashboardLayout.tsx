'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContextNew';
import { SharedSidebar } from './SharedSidebar';
import { Bell, Search, Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  type: 'motorista' | 'oficina';
  planType?: 'free' | 'pro';
  currentPath?: string;
}

export function DashboardLayout({ children, type, planType, currentPath }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Determinar tipo de sidebar
  const getSidebarType = () => {
    if (type === 'motorista') return 'motorista';
    if (type === 'oficina') {
      return planType === 'pro' ? 'oficinaPro' : 'oficinaFree';
    }
    return 'motorista';
  };

  const sidebarType = getSidebarType();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SharedSidebar
        type={sidebarType}
        userName={user.name}
        userEmail={user.email}
        currentPath={currentPath}
        onLogout={logout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {type === 'motorista' ? 'Dashboard Motorista' : 
                 planType === 'pro' ? 'Dashboard Oficina PRO' : 'Dashboard Oficina FREE'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}