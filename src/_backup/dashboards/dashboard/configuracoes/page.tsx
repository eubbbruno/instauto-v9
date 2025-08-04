"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cog6ToothIcon,
  BellIcon,
  UserIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  CheckIcon,
  TagIcon
} from "@heroicons/react/24/outline";

// Tipo para configurações
type ConfigSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  href: string;
};

export default function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState<string>('geral');
  
  // Seções de configurações
  const configSections: ConfigSection[] = [
    {
      id: "geral",
      title: "Configurações Gerais",
      icon: <Cog6ToothIcon className="h-6 w-6 text-gray-600" />,
      description: "Configurações básicas do sistema",
      href: "#geral"
    },
    {
      id: "empresa",
      title: "Dados da Empresa",
      icon: <BuildingStorefrontIcon className="h-6 w-6 text-gray-600" />,
      description: "Informações da sua oficina",
      href: "#empresa"
    },
    {
      id: "usuarios",
      title: "Usuários e Permissões",
      icon: <UserGroupIcon className="h-6 w-6 text-gray-600" />,
      description: "Gerencie sua equipe e permissões",
      href: "#usuarios"
    },
    {
      id: "financeiro",
      title: "Configurações Financeiras",
      icon: <CreditCardIcon className="h-6 w-6 text-gray-600" />,
      description: "Formas de pagamento e impostos",
      href: "#financeiro"
    },
    {
      id: "documentos",
      title: "Modelos de Documentos",
      icon: <DocumentTextIcon className="h-6 w-6 text-gray-600" />,
      description: "Personalize orçamentos e relatórios",
      href: "#documentos"
    },
    {
      id: "notificacoes",
      title: "Notificações",
      icon: <BellIcon className="h-6 w-6 text-gray-600" />,
      description: "Configure alertas e mensagens automáticas",
      href: "#notificacoes"
    },
    {
      id: "integracao",
      title: "Integrações",
      icon: <DevicePhoneMobileIcon className="h-6 w-6 text-gray-600" />,
      description: "WhatsApp, email e outros serviços",
      href: "#integracao"
    },
    {
      id: "seguranca",
      title: "Segurança",
      icon: <LockClosedIcon className="h-6 w-6 text-gray-600" />,
      description: "Senhas e autenticação",
      href: "#seguranca"
    }
  ];
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-500 text-sm mt-1">Personalize o sistema de acordo com suas necessidades</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna da esquerda - Menu de navegação */}
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="font-medium text-gray-800 flex items-center">
                <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-500" />
                Configurações
              </h3>
            </div>
            <div className="p-2">
              <nav className="space-y-1">
                {configSections.map((section) => (
                  <a
                    key={section.id}
                    href={section.href}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(section.id);
                    }}
                  >
                    <div className="flex items-center">
                      <div className={`mr-3 ${
                        activeSection === section.id ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {section.icon}
                      </div>
                      <div>
                        <span className={`block text-sm font-medium ${
                          activeSection === section.id ? 'text-blue-700' : 'text-gray-900'
                        }`}>{section.title}</span>
                        <span className="block text-xs text-gray-500">{section.description}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </nav>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-blue-50">
              <div className="flex items-center">
                <div className="mr-3 p-2 bg-blue-100 rounded-lg">
                  <TagIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Plano Pro</h4>
                  <p className="text-xs text-gray-500">Ativo até 15/12/2023</p>
                </div>
              </div>
              <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Gerenciar Assinatura
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Coluna da direita - Conteúdo da configuração selecionada */}
        <div className="lg:col-span-3">
          {/* Seção de Configurações Gerais */}
          {activeSection === 'geral' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Configurações Gerais</h2>
                  <p className="text-sm text-gray-500">Ajuste as configurações básicas do sistema</p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-800 mb-3">Preferências de Exibição</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <label htmlFor="dark-mode" className="block text-sm font-medium text-gray-700">
                            Modo Escuro
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Ativar tema escuro para o painel
                          </p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="dark-mode"
                            className="sr-only"
                          />
                          <div className="bg-gray-200 rounded-full w-12 h-6"></div>
                          <div className="absolute left-1 top-1 bg-white rounded-full w-4 h-4 transition-transform transform"></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                            Idioma
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Selecione o idioma padrão
                          </p>
                        </div>
                        <select
                          id="language"
                          className="rounded-lg border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">
                            Formato de Data
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Escolha como as datas serão exibidas
                          </p>
                        </div>
                        <select
                          id="date-format"
                          className="rounded-lg border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                          <option value="MM/dd/yyyy">MM/DD/AAAA</option>
                          <option value="yyyy-MM-dd">AAAA-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-800 mb-3">Página Inicial</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <label htmlFor="default-page" className="block text-sm font-medium text-gray-700">
                            Página Padrão
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Escolha qual página será exibida ao fazer login
                          </p>
                        </div>
                        <select
                          id="default-page"
                          className="rounded-lg border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="dashboard">Dashboard</option>
                          <option value="clientes">Clientes</option>
                          <option value="servicos">Serviços</option>
                          <option value="estoque">Estoque</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <label htmlFor="widgets" className="block text-sm font-medium text-gray-700">
                            Widgets Visíveis
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Configure quais informações aparecem no dashboard
                          </p>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Configurar
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Cancelar
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                      <CheckIcon className="h-5 w-5 mr-1" />
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Sincronização e Backup</h2>
                  <p className="text-sm text-gray-500">Gerencie suas cópias de segurança</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Último Backup</h4>
                      <p className="text-xs text-gray-500 mt-1">19/10/2023 às 03:15</p>
                    </div>
                    <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center">
                      <ArrowPathIcon className="h-5 w-5 mr-1" />
                      Executar Backup
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Backup Automático</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Realize backups diários automaticamente
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="auto-backup"
                        className="sr-only"
                        defaultChecked
                      />
                      <div className="bg-blue-600 rounded-full w-12 h-6"></div>
                      <div className="absolute right-1 top-1 bg-white rounded-full w-4 h-4 transition-transform transform"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Backups Anteriores</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Restaure ou baixe backups anteriores
                      </p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Ver histórico
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Seção de Dados da Empresa */}
          {activeSection === 'empresa' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-800">Dados da Empresa</h2>
                <p className="text-sm text-gray-500">Informações utilizadas em documentos e relatórios</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      defaultValue="Auto Mecânica Silva"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      defaultValue="12.345.678/0001-90"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      defaultValue="(11) 3456-7890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      defaultValue="(11) 98765-4321"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      defaultValue="contato@automecanicasilva.com.br"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    defaultValue="Av. Brasil, 1500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      defaultValue="São Paulo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                      <option value="RS">RS</option>
                      <option value="PR">PR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      defaultValue="01310-200"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo da Empresa
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="mr-4 flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      <BuildingStorefrontIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Alterar
                      </button>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG ou SVG. Máximo 1MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Cancelar
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                    <CheckIcon className="h-5 w-5 mr-1" />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Exibir mensagem para outras seções */}
          {activeSection !== 'geral' && activeSection !== 'empresa' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden p-6 text-center"
            >
              <div className="py-8">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  {configSections.find(s => s.id === activeSection)?.icon}
                </div>
                <h2 className="text-xl font-medium text-gray-800 mb-2">
                  {configSections.find(s => s.id === activeSection)?.title}
                </h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Esta seção de configurações está em desenvolvimento e estará disponível em breve.
                </p>
                <button
                  onClick={() => setActiveSection('geral')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-1" />
                  Voltar para Configurações Gerais
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 