"use client";

import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useEffect, useState } from 'react';
import { checkEnvironment } from '@/lib/env-check';

export default function TestAuthPage() {
  const { user, loading, isAuthenticated, isMotorista, isOfficina } = useAuth();
  const [envCheck, setEnvCheck] = useState<any>(null);

  useEffect(() => {
    const check = checkEnvironment();
    setEnvCheck(check);
    console.log('Environment check:', check);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Teste de Integração Supabase
          </h1>
          <p className="text-gray-600">
            Verificação completa da autenticação e configuração
          </p>
        </div>

        {/* Environment Check */}
        {envCheck && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔧 Configuração de Ambiente
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {envCheck.results.map((result: any) => (
                <div 
                  key={result.key}
                  className={`p-3 rounded-lg border ${
                    result.status === 'ok' ? 'bg-green-50 border-green-200' :
                    result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.name}</span>
                    <span className={`text-sm ${
                      result.status === 'ok' ? 'text-green-800' :
                      result.status === 'warning' ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>
                      {result.status === 'ok' ? '✅ Configurado' :
                       result.status === 'warning' ? '⚠️ Opcional' :
                       '❌ Obrigatório'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`mt-4 p-4 rounded-lg ${
              envCheck.isReady ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${envCheck.isReady ? 'text-green-800' : 'text-red-800'}`}>
                {envCheck.isReady ? '✅ Ambiente configurado corretamente!' : '❌ Configuração incompleta!'}
              </p>
              {!envCheck.isReady && (
                <p className="text-red-700 text-sm mt-1">
                  Verifique o arquivo .env.local na raiz do projeto.
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Auth Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔐 Status da Autenticação
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Status */}
            <div className="space-y-3">
              <div className={`p-4 rounded-lg ${loading ? 'bg-blue-50 border-blue-200' : 
                isAuthenticated ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
                <h3 className="font-medium mb-2">Status Atual</h3>
                <p><strong>Carregando:</strong> {loading ? '⏳ Sim' : '✅ Não'}</p>
                <p><strong>Autenticado:</strong> {isAuthenticated ? '✅ Sim' : '❌ Não'}</p>
                <p><strong>Tipo:</strong> {isMotorista ? '🚗 Motorista' : isOfficina ? '🔧 Oficina' : '❓ Não definido'}</p>
              </div>
            </div>

            {/* User Data */}
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium mb-2">Dados do Usuário</h3>
                {user ? (
                  <div className="space-y-1 text-sm">
                    <p><strong>ID:</strong> {user.id.substring(0, 8)}...</p>
                    <p><strong>Nome:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Tipo:</strong> {user.type}</p>
                    {user.phone && <p><strong>Telefone:</strong> {user.phone}</p>}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">Nenhum usuário logado</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🚀 Ações de Teste
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="/auth" 
              className="block bg-blue-600 text-white text-center px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔑 Login/Cadastro
            </a>
            <a 
              href="/test-supabase" 
              className="block bg-purple-600 text-white text-center px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔗 Teste Conexão
            </a>
            <a 
              href="/motorista" 
              className="block bg-green-600 text-white text-center px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              🚗 Dashboard Motorista
            </a>
            <a 
              href="/oficina-basica" 
              className="block bg-orange-600 text-white text-center px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              🔧 Dashboard Oficina
            </a>
          </div>

          {!envCheck?.isReady && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">⚠️ Configuração Necessária</h3>
              <p className="text-yellow-700 text-sm mb-3">
                Para testar a autenticação, você precisa configurar as variáveis de ambiente do Supabase.
              </p>
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Crie o arquivo .env.local na raiz do projeto:</p>
                <pre className="mt-2 p-2 bg-yellow-100 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 