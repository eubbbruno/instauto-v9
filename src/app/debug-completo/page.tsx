"use client";

import { useAuth } from '@/contexts/AuthContextNew';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugCompleto() {
  const { user, loading, isInitialized } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [supabaseData, setSupabaseData] = useState<any>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);

  useEffect(() => {
    const loadSupabaseData = async () => {
      if (!user) return;
      
      try {
        // Buscar dados do usuário atual
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const { data: workshop } = await supabase
          .from('workshops')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        const { data: driver } = await supabase
          .from('drivers')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        setSupabaseData({ profile, workshop, driver });

        // Buscar todos os profiles para debug
        const { data: allProfilesData } = await supabase
          .from('profiles')
          .select(`
            *,
            workshops(*),
            drivers(*)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        setAllProfiles(allProfilesData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    if (isInitialized) {
      loadSupabaseData();
    }
  }, [user, isInitialized]);

  const estruturaRotas = {
    "Dashboards Principais": [
      "/motorista - Dashboard do Motorista",
      "/oficina-basica - Dashboard Oficina FREE", 
      "/dashboard - Dashboard Oficina PRO"
    ],
    "Autenticação": [
      "/auth - Seleção de tipo",
      "/auth/motorista - Login Motorista",
      "/auth/oficina - Login Oficina",
      "/auth/callback - OAuth Callback"
    ],
    "Layouts Identificados": [
      "DashboardSidebar.tsx - Universal (CONFLITO)",
      "MotoristaSidebar.tsx - Específico Motorista", 
      "OficinaSidebar.tsx - Específico Oficina",
      "DynamicLayout.tsx - Sistema Unificado (CONFLITO)"
    ]
  };

  const getDashboardEsperado = () => {
    if (!user) return 'N/A';
    if (user.type === 'motorista') return '/motorista';
    if (user.type === 'oficina') {
      return user.planType === 'pro' ? '/dashboard' : '/oficina-basica';
    }
    return 'ERRO: Tipo desconhecido';
  };

  const resetarUsuario = async (email: string) => {
    try {
      // 1. Buscar usuário
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);

      if (!profiles || profiles.length === 0) {
        alert('Usuário não encontrado');
        return;
      }

      const userId = profiles[0].id;

      // 2. Deletar dados relacionados
      await supabase.from('workshops').delete().eq('profile_id', userId);
      await supabase.from('drivers').delete().eq('profile_id', userId);
      await supabase.from('profiles').delete().eq('id', userId);

      alert(`Usuário ${email} resetado com sucesso!`);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao resetar usuário:', error);
      alert('Erro ao resetar usuário');
    }
  };

  const testarLogin = (tipo: 'motorista' | 'oficina', plano?: 'free' | 'pro') => {
    const baseUrl = tipo === 'motorista' ? '/auth/motorista' : `/auth/oficina`;
    const planParam = plano ? `?plan=${plano}` : '';
    router.push(`${baseUrl}${planParam}`);
  };

  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">🔍 Debug Completo - Carregando...</h1>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p>⏳ Aguardando inicialização do contexto...</p>
            <p>Loading: {loading ? 'true' : 'false'}</p>
            <p>IsInitialized: {isInitialized ? 'true' : 'false'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">🔍 Debug Completo do Sistema</h1>
          
          {/* Status Atual */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">📊 Estado do Contexto</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Loading:</strong> {loading ? '🔄 true' : '✅ false'}</p>
                <p><strong>IsInitialized:</strong> {isInitialized ? '✅ true' : '❌ false'}</p>
                <p><strong>User:</strong> {user ? '✅ Logado' : '❌ Não logado'}</p>
                <p><strong>Pathname:</strong> {pathname}</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-green-900">👤 Dados do Usuário</h2>
              {user ? (
                <div className="space-y-2 text-sm">
                  <p><strong>Nome:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Tipo:</strong> {user.type}</p>
                  <p><strong>Plan Type:</strong> {user.planType || 'N/A'}</p>
                  <p><strong>Dashboard Esperado:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">{getDashboardEsperado()}</span></p>
                  <p><strong>Dashboard Atual:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">{pathname}</span></p>
                  <p><strong>✅ Correto?</strong> {pathname === getDashboardEsperado() ? '✅ SIM' : '❌ NÃO - REDIRECIONAMENTO NECESSÁRIO'}</p>
                </div>
              ) : (
                <p className="text-gray-600">Usuário não logado</p>
              )}
            </div>
          </div>

          {/* Estrutura de Rotas */}
          <div className="bg-amber-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-900">🗂️ Estrutura de Rotas</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(estruturaRotas).map(([categoria, rotas]) => (
                <div key={categoria} className="bg-white p-4 rounded border">
                  <h3 className="font-semibold mb-2 text-gray-800">{categoria}</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {rotas.map((rota, i) => (
                      <li key={i} className="font-mono text-xs">{rota}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Dados do Supabase */}
          {supabaseData && (
            <div className="bg-purple-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4 text-purple-900">🗄️ Dados do Supabase (Usuário Atual)</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border">
                  <h3 className="font-semibold mb-2">Profile</h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(supabaseData.profile, null, 2)}
                  </pre>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h3 className="font-semibold mb-2">Workshop</h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(supabaseData.workshop, null, 2)}
                  </pre>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h3 className="font-semibold mb-2">Driver</h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(supabaseData.driver, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Todos os Profiles */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">👥 Últimos 10 Usuários do Sistema</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Plan Type</th>
                    <th className="p-2 text-left">Criado</th>
                    <th className="p-2 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {allProfiles.map((profile) => (
                    <tr key={profile.id} className="border-b">
                      <td className="p-2 font-mono text-xs">{profile.email}</td>
                      <td className="p-2">{profile.type}</td>
                      <td className="p-2">{profile.workshops?.[0]?.plan_type || 'N/A'}</td>
                      <td className="p-2">{new Date(profile.created_at).toLocaleDateString()}</td>
                      <td className="p-2">
                        <button 
                          onClick={() => resetarUsuario(profile.email)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Resetar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ações de Teste */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-indigo-900">🧪 Ações de Teste</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button 
                onClick={() => testarLogin('motorista')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                🚗 Testar Login Motorista
              </button>
              <button 
                onClick={() => testarLogin('oficina', 'free')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                🔧 Testar Login Oficina FREE
              </button>
              <button 
                onClick={() => testarLogin('oficina', 'pro')}
                className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
              >
                👑 Testar Login Oficina PRO
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-2">🔄 Ações de Sistema</h3>
              <div className="space-x-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  🔄 Recarregar Página
                </button>
                <button 
                  onClick={() => router.push('/auth')}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  🏠 Ir para Auth
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}