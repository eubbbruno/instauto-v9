"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  BellIcon,
  ClockIcon,
  ShieldCheckIcon,
  PhotoIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

// Tipo para dados do perfil
type ProfileData = {
  name: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  photo?: string;
  createdAt: string;
  lastLogin: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  twoFactorEnabled: boolean;
};

// Dados mockados para o perfil
const mockProfileData: ProfileData = {
  name: "Carlos Oliveira",
  email: "carlos.oliveira@instauto.com.br",
  phone: "(11) 98765-4321",
  role: "Administrador",
  company: "Auto Mecânica Silva",
  photo: "https://randomuser.me/api/portraits/men/32.jpg",
  createdAt: "2022-03-15T10:30:00Z",
  lastLogin: "2023-10-20T08:45:00Z",
  notifications: {
    email: true,
    sms: true,
    push: false
  },
  twoFactorEnabled: false
};

export default function PerfilPage() {
  const [profile, setProfile] = useState<ProfileData>(mockProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(mockProfileData);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'notifications'>('info');
  
  // Função para atualizar o perfil
  const updateProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };
  
  // Função para cancelar a edição
  const cancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  
  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie suas informações pessoais e configurações</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna da esquerda - Foto e informações básicas */}
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 text-center border-b border-gray-100">
              <div className="relative inline-block mb-4">
                {profile.photo ? (
                  <img 
                    src={profile.photo} 
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    <UserCircleIcon className="h-16 w-16 text-blue-600" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                  <PhotoIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
              <p className="text-gray-500 text-sm">{profile.role}</p>
              <p className="text-gray-500 text-sm">{profile.company}</p>
              
              <div className="mt-4 text-sm">
                <p className="flex items-center justify-center text-gray-600 mb-2">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {profile.email}
                </p>
                <p className="flex items-center justify-center text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {profile.phone}
                </p>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Editar Perfil
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>Membro desde</span>
                <span className="font-medium">{formatDate(profile.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Último acesso</span>
                <span className="font-medium">{formatDate(profile.lastLogin)}</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800">Links Rápidos</h3>
            </div>
            <div className="p-2">
              <a href="#" className="block p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 text-sm">
                <div className="flex justify-between items-center">
                  <span>Histórico de atividades</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </a>
              <a href="#" className="block p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 text-sm">
                <div className="flex justify-between items-center">
                  <span>Preferências de notificações</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </a>
              <a href="#" className="block p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 text-sm">
                <div className="flex justify-between items-center">
                  <span>Segurança da conta</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </a>
              <a href="#" className="block p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 text-sm">
                <div className="flex justify-between items-center">
                  <span>Gerenciar assinatura</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Coluna da direita - Informações detalhadas */}
        <div className="lg:col-span-3">
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Tabs de navegação */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'info'
                      ? 'border-[#0047CC] text-[#0047CC]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('info')}
                >
                  <UserCircleIcon className="h-5 w-5 inline-block mr-2 -mt-0.5" />
                  Informações Pessoais
                </button>
                <button
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'security'
                      ? 'border-[#0047CC] text-[#0047CC]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('security')}
                >
                  <ShieldCheckIcon className="h-5 w-5 inline-block mr-2 -mt-0.5" />
                  Segurança
                </button>
                <button
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'notifications'
                      ? 'border-[#0047CC] text-[#0047CC]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <BellIcon className="h-5 w-5 inline-block mr-2 -mt-0.5" />
                  Notificações
                </button>
              </nav>
            </div>
            
            {/* Conteúdo das tabs */}
            <div className="p-6">
              {/* Tab de Informações Pessoais */}
              {activeTab === 'info' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Informações Pessoais</h3>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                          </label>
                          <input
                            type="text"
                            value={editedProfile.name}
                            onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail
                          </label>
                          <input
                            type="email"
                            value={editedProfile.email}
                            onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone
                          </label>
                          <input
                            type="tel"
                            value={editedProfile.phone}
                            onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cargo
                          </label>
                          <input
                            type="text"
                            value={editedProfile.role}
                            onChange={(e) => setEditedProfile({...editedProfile, role: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Empresa
                        </label>
                        <input
                          type="text"
                          value={editedProfile.company}
                          onChange={(e) => setEditedProfile({...editedProfile, company: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex space-x-3 pt-2">
                        <button
                          onClick={updateProfile}
                          className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors flex items-center"
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Nome Completo</h4>
                          <p className="text-gray-800">{profile.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">E-mail</h4>
                          <p className="text-gray-800">{profile.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Telefone</h4>
                          <p className="text-gray-800">{profile.phone}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Cargo</h4>
                          <p className="text-gray-800">{profile.role}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Empresa</h4>
                        <p className="text-gray-800">{profile.company}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Tab de Segurança */}
              {activeTab === 'security' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Segurança da Conta</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-medium text-gray-800 flex items-center">
                            <KeyIcon className="h-5 w-5 mr-2 text-gray-500" />
                            Senha
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Sua senha foi alterada pela última vez há 30 dias.
                          </p>
                        </div>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          Alterar Senha
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-medium text-gray-800 flex items-center">
                            <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-500" />
                            Autenticação de dois fatores
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {profile.twoFactorEnabled 
                              ? "A autenticação de dois fatores está ativada."
                              : "Adicione uma camada extra de segurança à sua conta."}
                          </p>
                        </div>
                        <button className={`px-3 py-1.5 ${
                          profile.twoFactorEnabled 
                            ? "bg-red-100 text-red-700 hover:bg-red-200" 
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                          } rounded-lg text-sm font-medium transition-colors`}>
                          {profile.twoFactorEnabled ? "Desativar" : "Ativar"}
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-medium text-gray-800 flex items-center">
                            <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                            Sessões ativas
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Você tem 2 sessões ativas no momento.
                          </p>
                        </div>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          Gerenciar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tab de Notificações */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Preferências de Notificações</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-800">E-mail</h4>
                          <p className="text-sm text-gray-500 mt-1">Receba notificações por e-mail</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={profile.notifications.email}
                            onChange={() => {
                              setProfile({
                                ...profile,
                                notifications: {
                                  ...profile.notifications,
                                  email: !profile.notifications.email
                                }
                              });
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0047CC]"></div>
                        </label>
                      </div>
                      
                      <div className="mt-4 space-y-2 pl-4">
                        <div className="flex items-center">
                          <input 
                            id="email-orders" 
                            type="checkbox" 
                            className="h-4 w-4 text-[#0047CC] border-gray-300 rounded focus:ring-[#0047CC]"
                            disabled={!profile.notifications.email}
                          />
                          <label htmlFor="email-orders" className={`ml-2 text-sm ${profile.notifications.email ? 'text-gray-700' : 'text-gray-400'}`}>
                            Novos agendamentos e ordens de serviço
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            id="email-marketing" 
                            type="checkbox" 
                            className="h-4 w-4 text-[#0047CC] border-gray-300 rounded focus:ring-[#0047CC]"
                            disabled={!profile.notifications.email}
                          />
                          <label htmlFor="email-marketing" className={`ml-2 text-sm ${profile.notifications.email ? 'text-gray-700' : 'text-gray-400'}`}>
                            Novidades e atualizações
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-800">SMS</h4>
                          <p className="text-sm text-gray-500 mt-1">Receba notificações por SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={profile.notifications.sms}
                            onChange={() => {
                              setProfile({
                                ...profile,
                                notifications: {
                                  ...profile.notifications,
                                  sms: !profile.notifications.sms
                                }
                              });
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0047CC]"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-800">Notificações no navegador</h4>
                          <p className="text-sm text-gray-500 mt-1">Receba notificações push no navegador</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={profile.notifications.push}
                            onChange={() => {
                              setProfile({
                                ...profile,
                                notifications: {
                                  ...profile.notifications,
                                  push: !profile.notifications.push
                                }
                              });
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0047CC]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 