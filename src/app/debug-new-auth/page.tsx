'use client';

import { useAuth } from '@/contexts/AuthContextNew';
import { useState, useEffect } from 'react';

export default function DebugNewAuth() {
  const { user, profile, loading, getDashboardPath } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Capturar logs do console
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('[NEW AUTH]') || message.includes('[NEW DASHBOARD]')) {
        setLogs(prev => [...prev, `LOG: ${message}`]);
      }
      originalLog(...args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('[NEW AUTH]') || message.includes('[NEW DASHBOARD]')) {
        setLogs(prev => [...prev, `ERROR: ${message}`]);
      }
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const testDashboardAccess = () => {
    if (user) {
      const path = getDashboardPath();
      console.log('🧪 [DEBUG] Testando acesso ao dashboard:', path);
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">🔍 Debug Novo Auth</h1>
        
        {/* Status Atual */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">📊 Status do AuthContextNew</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Loading:</strong> {loading ? '🔄 true' : '✅ false'}</p>
              <p><strong>User:</strong> {user ? '✅ Carregado' : '❌ null'}</p>
              <p><strong>Profile:</strong> {profile ? '✅ Carregado' : '❌ null'}</p>
            </div>
            <div>
              {user && (
                <>
                  <p><strong>Nome:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Tipo:</strong> {user.type}</p>
                  <p><strong>Plan Type:</strong> {user.planType || 'N/A'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dados Completos */}
        <div className="bg-blue-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">📋 Dados Completos</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">User Object:</h3>
              <pre className="text-xs bg-white p-3 rounded overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Profile Object:</h3>
              <pre className="text-xs bg-white p-3 rounded overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Dashboard Path */}
        <div className="bg-green-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">🎯 Dashboard Path</h2>
          <div className="space-y-2">
            <p><strong>Path calculado:</strong> {user ? getDashboardPath() : 'N/A'}</p>
            <button 
              onClick={testDashboardAccess}
              disabled={!user}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              🚀 Testar Acesso ao Dashboard
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-yellow-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">📝 Logs do Sistema</h2>
          <div className="bg-black text-green-400 p-4 rounded text-xs font-mono max-h-96 overflow-auto">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))
            ) : (
              <div>Aguardando logs...</div>
            )}
          </div>
          <button 
            onClick={() => setLogs([])}
            className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            🧹 Limpar Logs
          </button>
        </div>

        {/* Links de Teste */}
        <div className="bg-purple-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">🧪 Links de Teste</h2>
          <div className="space-x-4">
            <a href="/test-auth" className="text-blue-600 hover:underline">Test Auth</a>
            <a href="/new-dashboard" className="text-blue-600 hover:underline">New Dashboard</a>
            <a href="/new-dashboard?type=motorista" className="text-blue-600 hover:underline">Dashboard Motorista</a>
            <a href="/new-dashboard?type=oficina&plan=free" className="text-blue-600 hover:underline">Dashboard Oficina FREE</a>
            <a href="/new-dashboard?type=oficina&plan=pro" className="text-blue-600 hover:underline">Dashboard Oficina PRO</a>
          </div>
        </div>

        {/* Debug Manual */}
        <div className="bg-red-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">🔧 Debug Manual</h2>
          <div className="space-y-2">
            <p><strong>Loading State:</strong> {loading ? 'VERDADEIRO (bloqueando)' : 'FALSO (liberado)'}</p>
            <p><strong>User State:</strong> {user ? 'CARREGADO' : 'NULL (bloqueando)'}</p>
            <p><strong>Profile State:</strong> {profile ? 'CARREGADO' : 'NULL (bloqueando)'}</p>
            
            {!user && !loading && (
              <div className="bg-red-100 p-3 rounded border border-red-300">
                <p className="text-red-800 font-semibold">🚨 PROBLEMA IDENTIFICADO:</p>
                <p className="text-red-700">Loading = false mas User = null. O contexto não está carregando o usuário!</p>
              </div>
            )}
            
            {user && !profile && (
              <div className="bg-orange-100 p-3 rounded border border-orange-300">
                <p className="text-orange-800 font-semibold">⚠️ PROBLEMA IDENTIFICADO:</p>
                <p className="text-orange-700">User carregado mas Profile = null. Problema na query do banco!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}