"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import {
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

type ConfigType = {
  notificacoes: {
    email: boolean;
    push: boolean;
    sms: boolean;
    agendamentos: boolean;
    promocoes: boolean;
    lembretes: boolean;
  };
  privacidade: {
    perfilPublico: boolean;
    localizacao: boolean;
    historico: boolean;
    avaliacoes: boolean;
  };
  preferencias: {
    idioma: string;
    tema: string;
    moeda: string;
    unidadeDistancia: string;
  };
};

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const [configuracoes, setConfiguracoes] = useState<ConfigType>({
    notificacoes: {
      email: true,
      push: true,
      sms: false,
      agendamentos: true,
      promocoes: false,
      lembretes: true
    },
    privacidade: {
      perfilPublico: false,
      localizacao: true,
      historico: false,
      avaliacoes: true
    },
    preferencias: {
      idioma: 'pt-BR',
      tema: 'claro',
      moeda: 'BRL',
      unidadeDistancia: 'km'
    }
  });

  const handleToggle = (categoria: keyof ConfigType, item: string) => {
    setConfiguracoes(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [item]: !(prev[categoria] as any)[item]
      }
    }));
  };

  const handleSelect = (categoria: keyof ConfigType, item: string, value: string) => {
    setConfiguracoes(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [item]: value
      }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">
          Personalize sua experiência no Instauto conforme suas preferências.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notificações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BellIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
              <p className="text-sm text-gray-600">Configure como quer receber alertas</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Email</h4>
                <p className="text-sm text-gray-600">Receber notificações por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.notificacoes.email}
                  onChange={() => handleToggle('notificacoes', 'email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Push</h4>
                <p className="text-sm text-gray-600">Notificações no navegador</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.notificacoes.push}
                  onChange={() => handleToggle('notificacoes', 'push')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">SMS</h4>
                <p className="text-sm text-gray-600">Mensagens de texto</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.notificacoes.sms}
                  onChange={() => handleToggle('notificacoes', 'sms')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <hr className="my-4" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Agendamentos</h4>
                <p className="text-sm text-gray-600">Confirmações e lembretes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.notificacoes.agendamentos}
                  onChange={() => handleToggle('notificacoes', 'agendamentos')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Promoções</h4>
                <p className="text-sm text-gray-600">Ofertas e descontos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.notificacoes.promocoes}
                  onChange={() => handleToggle('notificacoes', 'promocoes')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Privacidade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Privacidade</h3>
              <p className="text-sm text-gray-600">Controle suas informações</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Perfil Público</h4>
                <p className="text-sm text-gray-600">Visível para oficinas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.privacidade.perfilPublico}
                  onChange={() => handleToggle('privacidade', 'perfilPublico')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Localização</h4>
                <p className="text-sm text-gray-600">Permitir acesso à localização</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.privacidade.localizacao}
                  onChange={() => handleToggle('privacidade', 'localizacao')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Histórico Público</h4>
                <p className="text-sm text-gray-600">Mostrar histórico de serviços</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.privacidade.historico}
                  onChange={() => handleToggle('privacidade', 'historico')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Avaliações</h4>
                <p className="text-sm text-gray-600">Permitir avaliações públicas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.privacidade.avaliacoes}
                  onChange={() => handleToggle('privacidade', 'avaliacoes')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Preferências */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <GlobeAltIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Preferências</h3>
              <p className="text-sm text-gray-600">Personalize sua experiência</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              <select
                value={configuracoes.preferencias.idioma}
                onChange={(e) => handleSelect('preferencias', 'idioma', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <select
                value={configuracoes.preferencias.tema}
                onChange={(e) => handleSelect('preferencias', 'tema', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="claro">Claro</option>
                <option value="escuro">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moeda
              </label>
              <select
                value={configuracoes.preferencias.moeda}
                onChange={(e) => handleSelect('preferencias', 'moeda', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidade de Distância
              </label>
              <select
                value={configuracoes.preferencias.unidadeDistancia}
                onChange={(e) => handleSelect('preferencias', 'unidadeDistancia', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="km">Quilômetros</option>
                <option value="mi">Milhas</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Segurança */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <KeyIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Segurança</h3>
              <p className="text-sm text-gray-600">Proteja sua conta</p>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <KeyIcon className="h-5 w-5 text-gray-600 mr-3" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Alterar Senha</h4>
                  <p className="text-sm text-gray-600">Última alteração: há 30 dias</p>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600 mr-3" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Autenticação 2FA</h4>
                  <p className="text-sm text-gray-600">Adicionar camada extra de segurança</p>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <EyeIcon className="h-5 w-5 text-gray-600 mr-3" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Dispositivos Conectados</h4>
                  <p className="text-sm text-gray-600">Gerenciar sessões ativas</p>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Zona de Perigo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-red-200"
      >
        <div className="flex items-center mb-4">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <TrashIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">Zona de Perigo</h3>
            <p className="text-sm text-red-600">Ações irreversíveis</p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
            <div className="text-left">
              <h4 className="font-medium text-red-900">Exportar Dados</h4>
              <p className="text-sm text-red-600">Baixar uma cópia dos seus dados</p>
            </div>
            <div className="text-red-400">›</div>
          </button>

          <button className="w-full flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
            <div className="text-left">
              <h4 className="font-medium text-red-900">Excluir Conta</h4>
              <p className="text-sm text-red-600">Remover permanentemente sua conta</p>
            </div>
            <div className="text-red-400">›</div>
          </button>
        </div>
      </motion.div>

      {/* Botão Salvar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Salvar Configurações
        </button>
      </motion.div>
    </div>
  );
} 