'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContextNew';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function DebugAuthPage() {
  const { user, loading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkAuthState = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setDebugInfo(prev => ({ ...prev, supabaseConfigured: false }));
        return;
      }

      try {
        // Verificar sessão Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        setSupabaseSession(session);

        // Verificar user do Supabase
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();

        // Se tem sessão, buscar profile
        let profile = null;
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          profile = profileData;
        }

        setDebugInfo({
          supabaseConfigured: true,
          hasSession: !!session,
          sessionUser: session?.user || null,
          supabaseUser: supabaseUser || null,
          profile: profile,
          error: error?.message || null,
          localStorage: typeof window !== 'undefined' ? localStorage.getItem('instauto_user') : null
        });

      } catch (error) {
        console.error('Erro no debug:', error);
        setDebugInfo(prev => ({ ...prev, error: String(error) }));
      }
    };

    checkAuthState();

    // Escutar mudanças de auth
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 [DEBUG] Auth state changed:', event, session);
        checkAuthState();
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug de Autenticação</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contexto Auth */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">📱 Contexto Auth</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? '✅' : '❌'}</p>
              <p><strong>User:</strong> {user ? '✅' : '❌'}</p>
              {user && (
                <div className="ml-4 space-y-1">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Nome:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Tipo:</strong> {user.type}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sessão Supabase */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🔐 Sessão Supabase</h2>
            <div className="space-y-2">
              <p><strong>Configurado:</strong> {debugInfo.supabaseConfigured ? '✅' : '❌'}</p>
              <p><strong>Tem Sessão:</strong> {debugInfo.hasSession ? '✅' : '❌'}</p>
              {supabaseSession && (
                <div className="ml-4 space-y-1">
                  <p><strong>User ID:</strong> {supabaseSession.user?.id}</p>
                  <p><strong>Email:</strong> {supabaseSession.user?.email}</p>
                  <p><strong>Provider:</strong> {supabaseSession.user?.app_metadata?.provider}</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile do Banco */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">👤 Profile do Banco</h2>
            <div className="space-y-2">
              <p><strong>Tem Profile:</strong> {debugInfo.profile ? '✅' : '❌'}</p>
              {debugInfo.profile && (
                <div className="ml-4 space-y-1">
                  <p><strong>Nome:</strong> {debugInfo.profile.name}</p>
                  <p><strong>Email:</strong> {debugInfo.profile.email}</p>
                  <p><strong>Tipo:</strong> {debugInfo.profile.type}</p>
                </div>
              )}
            </div>
          </div>

          {/* LocalStorage */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">💾 LocalStorage</h2>
            <div className="space-y-2">
              <p><strong>Tem dados:</strong> {debugInfo.localStorage ? '✅' : '❌'}</p>
              {debugInfo.localStorage && (
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {debugInfo.localStorage}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Ações de Debug */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-red-600">🛠️ Ações de Debug</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.location.href = '/auth/motorista'}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login Motorista (OAuth)
            </button>
            <button
              onClick={() => window.location.href = '/auth/oficina'}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Login Oficina (OAuth)
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                if (supabase) supabase.auth.signOut();
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Limpar Tudo
            </button>
          </div>
        </div>

        {/* Raw Debug Data */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">📊 Raw Debug Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify({ 
              contextUser: user, 
              contextLoading: loading,
              supabaseSession,
              debugInfo 
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 