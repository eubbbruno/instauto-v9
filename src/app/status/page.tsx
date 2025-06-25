"use client";

import { useState, useEffect } from 'react';

export default function StatusPage() {
  const [status, setStatus] = useState({
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    timestamp: new Date().toLocaleString()
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          📊 Status do Projeto Instauto
        </h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-900 mb-2">Configuração Supabase</h2>
            <p className="text-blue-800">
              <strong>URL:</strong> {status.supabaseUrl ? '✅ Configurado' : '❌ Não encontrado'}
            </p>
            <p className="text-blue-800">
              <strong>Anon Key:</strong> {status.supabaseKey ? '✅ Configurado' : '❌ Não encontrado'}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-semibold text-green-900 mb-2">Sistema</h2>
            <p className="text-green-800">
              <strong>Timestamp:</strong> {status.timestamp}
            </p>
            <p className="text-green-800">
              <strong>Environment:</strong> {process.env.NODE_ENV}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-900 mb-2">Navegação</h2>
            <div className="flex space-x-4">
              <a href="/test-auth" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Teste Auth
              </a>
              <a href="/test-supabase" className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                Teste Supabase
              </a>
              <a href="/auth" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 