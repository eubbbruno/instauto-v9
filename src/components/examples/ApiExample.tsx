'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOficinas } from '@/hooks/useOficinas';
import { useAgendamentos } from '@/hooks/useAgendamentos';

export default function ApiExample() {
  const { 
    user, 
    isAuthenticated, 
    loading: authLoading, 
    login, 
    logout 
  } = useAuth();

  const { 
    oficinas, 
    loading: oficinasLoading, 
    fetchOficinas 
  } = useOficinas();

  const { 
    agendamentos, 
    loading: agendamentosLoading, 
    fetchAgendamentos,
    createAgendamento 
  } = useAgendamentos();

  const [loginForm, setLoginForm] = useState({
    email: 'motorista@test.com',
    senha: '123456',
    tipo: 'motorista' as const
  });

  const [agendamentoForm, setAgendamentoForm] = useState({
    oficinaId: '1',
    veiculoId: '1',
    servico: 'Troca de óleo',
    descricaoProblema: 'Óleo do motor precisa ser trocado',
    dataAgendamento: new Date(Date.now() + 86400000).toISOString(), // +1 dia
    observacoes: 'Preferência pela manhã'
  });

  // Buscar dados quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchOficinas();
      fetchAgendamentos();
    }
  }, [isAuthenticated, fetchOficinas, fetchAgendamentos]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(loginForm);
    if (result.success) {
      alert('Login realizado com sucesso!');
    } else {
      alert(`Erro no login: ${result.error}`);
    }
  };

  const handleCreateAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createAgendamento(agendamentoForm);
    if (result.success) {
      alert('Agendamento criado com sucesso!');
      setAgendamentoForm(prev => ({
        ...prev,
        dataAgendamento: new Date(Date.now() + 86400000).toISOString()
      }));
    } else {
      alert(`Erro ao criar agendamento: ${result.error}`);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verificando autenticação...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">API Test Dashboard</h1>

      {/* Seção de Autenticação */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Autenticação</h2>
        
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha:</label>
              <input
                type="password"
                value={loginForm.senha}
                onChange={(e) => setLoginForm(prev => ({ ...prev, senha: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo:</label>
              <select
                value={loginForm.tipo}
                onChange={(e) => setLoginForm(prev => ({ ...prev, tipo: e.target.value as 'motorista' | 'oficina' }))}
                className="w-full border rounded px-3 py-2"
              >
                <option value="motorista">Motorista</option>
                <option value="oficina">Oficina</option>
              </select>
            </div>
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-green-800">
                <strong>Usuário autenticado:</strong> {user?.nome} ({user?.email})
              </p>
              <p className="text-green-600">Tipo: {user?.tipo}</p>
            </div>
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Seção de Oficinas */}
      {isAuthenticated && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Oficinas</h2>
          
          {oficinasLoading ? (
            <p>Carregando oficinas...</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Total de oficinas: {oficinas.length}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {oficinas.map((oficina) => (
                  <div key={oficina.id} className="border rounded p-4">
                    <h3 className="font-medium">{oficina.nome}</h3>
                    <p className="text-sm text-gray-600">{oficina.endereco}</p>
                    <p className="text-sm text-gray-600">{oficina.cidade}, {oficina.estado}</p>
                    <p className="text-sm text-blue-600">
                      ⭐ {oficina.avaliacoes.media} ({oficina.avaliacoes.total} avaliações)
                    </p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Serviços: </span>
                      <span className="text-xs">{oficina.servicos.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seção de Agendamentos */}
      {isAuthenticated && user?.tipo === 'motorista' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Agendamentos</h2>
          
          {/* Formulário para criar agendamento */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Criar Novo Agendamento</h3>
            <form onSubmit={handleCreateAgendamento} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Oficina:</label>
                  <select
                    value={agendamentoForm.oficinaId}
                    onChange={(e) => setAgendamentoForm(prev => ({ ...prev, oficinaId: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    {oficinas.map((oficina) => (
                      <option key={oficina.id} value={oficina.id}>
                        {oficina.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Serviço:</label>
                  <input
                    type="text"
                    value={agendamentoForm.servico}
                    onChange={(e) => setAgendamentoForm(prev => ({ ...prev, servico: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição do Problema:</label>
                <textarea
                  value={agendamentoForm.descricaoProblema}
                  onChange={(e) => setAgendamentoForm(prev => ({ ...prev, descricaoProblema: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data e Hora:</label>
                <input
                  type="datetime-local"
                  value={agendamentoForm.dataAgendamento.slice(0, 16)}
                  onChange={(e) => setAgendamentoForm(prev => ({ ...prev, dataAgendamento: new Date(e.target.value).toISOString() }))}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button 
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Criar Agendamento
              </button>
            </form>
          </div>

          {/* Lista de agendamentos */}
          {agendamentosLoading ? (
            <p>Carregando agendamentos...</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Total de agendamentos: {agendamentos.length}
              </p>
              <div className="space-y-4">
                {agendamentos.map((agendamento) => (
                  <div key={agendamento.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{agendamento.servico}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        agendamento.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                        agendamento.status === 'confirmado' ? 'bg-yellow-100 text-yellow-800' :
                        agendamento.status === 'em_andamento' ? 'bg-orange-100 text-orange-800' :
                        agendamento.status === 'concluido' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agendamento.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{agendamento.descricaoProblema}</p>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(agendamento.dataAgendamento).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      🚗 {agendamento.veiculo.marca} {agendamento.veiculo.modelo} ({agendamento.veiculo.placa})
                    </p>
                    {agendamento.valorEstimado && (
                      <p className="text-sm text-green-600">
                        💰 Valor estimado: R$ {agendamento.valorEstimado.toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 