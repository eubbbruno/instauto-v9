'use client';

import { useAuthSimple } from '@/hooks/useAuthSimple';

export default function MotoristaSimples() {
  const { user, loading, getDashboardPath } = useAuthSimple();

  console.log('🚗 [MOTORISTA SIMPLES] Renderizando...', { user, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verificação super simples
  if (!user) {
    console.log('❌ [MOTORISTA SIMPLES] Sem usuário, redirecionando...');
    window.location.href = '/auth';
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Redirecionando para login...</p>
      </div>
    );
  }

  if (user.type !== 'motorista') {
    console.log('⚠️ [MOTORISTA SIMPLES] Tipo incorreto, redirecionando...', user.type);
    window.location.href = getDashboardPath();
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Redirecionando para dashboard correto...</p>
      </div>
    );
  }

  console.log('✅ [MOTORISTA SIMPLES] Usuário autorizado:', user.name);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Simples */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🚗</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Motorista</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {user.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={() => {
                  // Logout simples
                  import('@/lib/supabase').then(({ supabase }) => {
                    supabase.auth.signOut().then(() => {
                      window.location.href = '/auth';
                    });
                  });
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card de Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                <p className="text-green-600">Sistema funcionando!</p>
              </div>
            </div>
          </div>

          {/* Card de Garagem */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🚙</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Minha Garagem</h3>
                <p className="text-gray-600">Gerencie seus veículos</p>
              </div>
            </div>
            <div className="mt-4">
              <a 
                href="/motorista/garagem" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Ver Veículos
              </a>
            </div>
          </div>

          {/* Card de Busca */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🔍</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Buscar Oficinas</h3>
                <p className="text-gray-600">Encontre oficinas próximas</p>
              </div>
            </div>
            <div className="mt-4">
              <a 
                href="/motorista/buscar" 
                className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Buscar
              </a>
            </div>
          </div>

          {/* Card de Agendamentos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📅</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Agendamentos</h3>
                <p className="text-gray-600">Seus serviços agendados</p>
              </div>
            </div>
            <div className="mt-4">
              <a 
                href="/motorista/agendamentos" 
                className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Ver Agenda
              </a>
            </div>
          </div>

          {/* Card de Histórico */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📋</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Histórico</h3>
                <p className="text-gray-600">Serviços realizados</p>
              </div>
            </div>
            <div className="mt-4">
              <a 
                href="/motorista/historico" 
                className="inline-block bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
              >
                Ver Histórico
              </a>
            </div>
          </div>

          {/* Card de Configurações */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⚙️</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
                <p className="text-gray-600">Personalizar conta</p>
              </div>
            </div>
            <div className="mt-4">
              <a 
                href="/motorista/configuracoes" 
                className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Configurar
              </a>
            </div>
          </div>

        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">🐛 Debug Info</h3>
          <div className="text-sm space-y-1">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Tipo:</strong> {user.type}</p>
            <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Links de Teste */}
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">🧪 Links de Teste</h3>
          <div className="space-x-4">
            <a href="/test-auth" className="text-blue-600 hover:underline">Test Auth</a>
            <a href="/debug-completo" className="text-blue-600 hover:underline">Debug Completo</a>
            <a href="/auth" className="text-blue-600 hover:underline">Auth</a>
          </div>
        </div>
      </main>
    </div>
  );
}