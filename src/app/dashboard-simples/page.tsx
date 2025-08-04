'use client';

import { useAuth } from '@/contexts/AuthContextNew';

export default function DashboardSimples() {
  const { user, profile, loading } = useAuth();

  console.log('🎯 [DASHBOARD SIMPLES] Estado:', {
    loading,
    user: !!user,
    profile: !!profile,
    userType: user?.type,
    userPlanType: user?.planType
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">🔄 Carregando...</p>
          <p className="mt-2 text-sm text-gray-500">Inicializando dashboard simples...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ [DASHBOARD SIMPLES] Sem usuário, redirecionando...');
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">❌ Usuário não carregado!</p>
          <p className="text-sm text-gray-600 mb-4">
            Loading: {loading ? 'true' : 'false'}<br/>
            User: {user ? 'carregado' : 'null'}<br/>
            Profile: {profile ? 'carregado' : 'null'}
          </p>
          <a href="/test-auth" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            🔄 Voltar para Test Auth
          </a>
        </div>
      </div>
    );
  }

  if (!profile) {
    console.log('❌ [DASHBOARD SIMPLES] Sem profile, mas tem user...');
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-orange-600 mb-4">⚠️ Profile não carregado!</p>
          <p className="text-sm text-gray-600 mb-4">
            User carregado: {user.name} ({user.email})<br/>
            Tipo: {user.type}<br/>
            Plan Type: {user.planType || 'N/A'}<br/>
            Profile: null
          </p>
          <a href="/test-auth" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            🔄 Voltar para Test Auth
          </a>
        </div>
      </div>
    );
  }

  console.log('✅ [DASHBOARD SIMPLES] Tudo carregado, renderizando dashboard...');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-green-600 mb-6">
            ✅ Dashboard Simples Funcionando!
          </h1>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded">
              <h2 className="font-semibold mb-2">👤 Dados do Usuário</h2>
              <div className="text-sm space-y-1">
                <p><strong>Nome:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Tipo:</strong> {user.type}</p>
                <p><strong>Plan Type:</strong> {user.planType || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <h2 className="font-semibold mb-2">📋 Dados do Profile</h2>
              <div className="text-sm space-y-1">
                <p><strong>ID:</strong> {profile.id}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Nome:</strong> {profile.name}</p>
                <p><strong>Tipo:</strong> {profile.type}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-100 rounded border border-green-300">
            <p className="text-green-800 font-semibold">🎉 SUCESSO!</p>
            <p className="text-green-700">
              Se você está vendo esta página, significa que o AuthContextNew está funcionando!
              O problema deve estar na lógica de redirecionamento do /new-dashboard.
            </p>
          </div>

          <div className="mt-6 space-x-4">
            <a href="/test-auth" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              🔄 Test Auth
            </a>
            <a href="/debug-new-auth" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              🔍 Debug New Auth
            </a>
            <a href="/new-dashboard" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              🚀 New Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}