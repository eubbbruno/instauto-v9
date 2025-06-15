'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugWorkshops() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testQueries = async () => {
      try {
        console.log('🔍 Testando conexão com Supabase...');
        
        // Teste 1: Verificar se a tabela workshops existe
        const { data: workshopsData, error: workshopsError } = await supabase
          .from('workshops')
          .select('*')
          .limit(10);

        console.log('📊 Workshops data:', workshopsData);
        console.log('❌ Workshops error:', workshopsError);

        // Teste 2: Verificar se a tabela profiles existe
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('type', 'oficina')
          .limit(10);

        console.log('👤 Profiles data:', profilesData);
        console.log('❌ Profiles error:', profilesError);

        // Teste 3: Query com JOIN
        const { data: joinData, error: joinError } = await supabase
          .from('workshops')
          .select(`
            *,
            profiles (
              name,
              email,
              phone
            )
          `)
          .limit(10);

        console.log('🔗 Join data:', joinData);
        console.log('❌ Join error:', joinError);

        setData({
          workshops: workshopsData,
          workshopsError,
          profiles: profilesData,
          profilesError,
          join: joinData,
          joinError
        });

      } catch (err) {
        console.error('💥 Erro geral:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    testQueries();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Testando queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Workshops</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800">Erro:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Workshops */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tabela Workshops</h2>
            {data?.workshopsError ? (
              <div className="text-red-600">
                <strong>Erro:</strong> {data.workshopsError.message}
              </div>
            ) : (
              <div>
                <p className="text-green-600 mb-2">
                  <strong>Sucesso!</strong> Encontrados {data?.workshops?.length || 0} registros
                </p>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(data?.workshops, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Profiles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tabela Profiles (Oficinas)</h2>
            {data?.profilesError ? (
              <div className="text-red-600">
                <strong>Erro:</strong> {data.profilesError.message}
              </div>
            ) : (
              <div>
                <p className="text-green-600 mb-2">
                  <strong>Sucesso!</strong> Encontrados {data?.profiles?.length || 0} registros
                </p>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(data?.profiles, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Join */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Query com JOIN</h2>
            {data?.joinError ? (
              <div className="text-red-600">
                <strong>Erro:</strong> {data.joinError.message}
              </div>
            ) : (
              <div>
                <p className="text-green-600 mb-2">
                  <strong>Sucesso!</strong> Encontrados {data?.join?.length || 0} registros
                </p>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(data?.join, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 