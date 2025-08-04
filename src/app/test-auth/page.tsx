'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestAuth() {
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      // 1. Verificar usuário do Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      console.log('👤 Supabase User:', user);
      console.log('❌ User Error:', userError);
      
      setSupabaseUser(user);

      if (user) {
        // 2. Buscar profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            workshops(plan_type),
            drivers(*)
          `)
          .eq('id', user.id)
          .single();

        console.log('📋 Profile Data:', profileData);
        console.log('❌ Profile Error:', profileError);
        
        setProfile(profileData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('💥 Erro geral:', error);
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/test-auth`
      }
    });
    
    if (error) {
      console.error('Erro no login:', error);
      alert('Erro no login: ' + error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🔄 Carregando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">🧪 Test Auth - Diagnóstico Simples</h1>
        
        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">📊 Status Atual</h2>
          <div className="space-y-2">
            <p><strong>Usuário Supabase:</strong> {supabaseUser ? '✅ Logado' : '❌ Não logado'}</p>
            <p><strong>Profile:</strong> {profile ? '✅ Encontrado' : '❌ Não encontrado'}</p>
            <p><strong>Tipo:</strong> {profile?.type || 'N/A'}</p>
            <p><strong>Plan Type:</strong> {profile?.workshops?.[0]?.plan_type || 'N/A'}</p>
          </div>
        </div>

        {/* Dados do Supabase User */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">👤 Supabase User</h2>
          <pre className="text-xs bg-white p-4 rounded overflow-auto">
            {JSON.stringify(supabaseUser, null, 2)}
          </pre>
        </div>

        {/* Dados do Profile */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📋 Profile Data</h2>
          <pre className="text-xs bg-white p-4 rounded overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>

        {/* Ações */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🎯 Ações</h2>
          <div className="space-x-4 space-y-2">
            {!supabaseUser ? (
              <button 
                onClick={signInWithGoogle}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                🔑 Login com Google
              </button>
            ) : (
              <button 
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                🚪 Logout
              </button>
            )}
            
            <button 
              onClick={loadAuthData}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              🔄 Recarregar Dados
            </button>
            
            <a 
              href="/auth/motorista" 
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              🚗 Auth Motorista
            </a>
            
            <a 
              href="/auth/oficina" 
              className="inline-block bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
            >
              🔧 Auth Oficina
            </a>
          </div>
        </div>

        {/* Dashboard Links */}
        {profile && (
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🎯 Dashboards</h2>
            <div className="space-x-4">
              <a 
                href="/motorista" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                🚗 Dashboard Motorista
              </a>
              
              <a 
                href="/oficina-basica" 
                className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                🔧 Dashboard Oficina FREE
              </a>
              
              <a 
                href="/dashboard" 
                className="inline-block bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
              >
                👑 Dashboard Oficina PRO
              </a>
            </div>
          </div>
        )}

        {/* Console */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📺 Console</h2>
          <p className="text-sm text-gray-600">Abra o Console do navegador (F12) para ver logs detalhados</p>
        </div>
      </div>
    </div>
  );
}