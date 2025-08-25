'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  CreditCardIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface UserProfile {
  nome: string
  email: string
  telefone: string
  cpf: string
  endereco: {
    cep: string
    rua: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
  nascimento: string
  avatar?: string
}

interface NotificationSettings {
  agendamentos: boolean
  promocoes: boolean
  lembretes: boolean
  whatsapp: boolean
  email: boolean
  push: boolean
}

interface PrivacySettings {
  perfilPublico: boolean
  localizacao: boolean
  historico: boolean
  avaliacoes: boolean
}

export default function ConfiguracoesClient() {
  const [activeTab, setActiveTab] = useState('perfil')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Mock data
  const [profile, setProfile] = useState<UserProfile>({
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    endereco: {
      cep: '01234-567',
      rua: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    nascimento: '1990-05-15'
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    agendamentos: true,
    promocoes: false,
    lembretes: true,
    whatsapp: true,
    email: true,
    push: true
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    perfilPublico: true,
    localizacao: true,
    historico: false,
    avaliacoes: true
  })

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Aqui seria feita a chamada para a API
    console.log('Perfil salvo:', profile)
  }

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePrivacyChange = (key: keyof PrivacySettings) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: UserIcon },
    { id: 'notificacoes', label: 'Notificações', icon: BellIcon },
    { id: 'privacidade', label: 'Privacidade', icon: ShieldCheckIcon },
    { id: 'pagamento', label: 'Pagamento', icon: CreditCardIcon }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="motorista"
        userName="Motorista"
        userEmail="motorista@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">⚙️ Configurações</h1>
              <p className="text-gray-600">Gerencie suas preferências e dados pessoais</p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Tabs */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap border-b border-gray-200">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                <div className="p-6">
                  {/* Tab: Perfil */}
                  {activeTab === 'perfil' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {/* Avatar Section */}
                      <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                        <div className="relative">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {profile.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                            <CameraIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{profile.nome}</h3>
                          <p className="text-gray-600">{profile.email}</p>
                          <p className="text-sm text-gray-500">Membro desde Janeiro 2024</p>
                        </div>
                      </div>

                      {/* Dados Pessoais */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
                          <button
                            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                              isEditing 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isEditing ? (
                              <>
                                <CheckIcon className="h-4 w-4" />
                                Salvar
                              </>
                            ) : (
                              <>
                                <PencilIcon className="h-4 w-4" />
                                Editar
                              </>
                            )}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                            <input
                              type="text"
                              value={profile.nome}
                              onChange={(e) => setProfile(prev => ({ ...prev, nome: e.target.value }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                            <input
                              type="tel"
                              value={profile.telefone}
                              onChange={(e) => setProfile(prev => ({ ...prev, telefone: e.target.value }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                            <input
                              type="text"
                              value={profile.cpf}
                              disabled
                              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">CPF não pode ser alterado</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                            <input
                              type="date"
                              value={profile.nascimento}
                              onChange={(e) => setProfile(prev => ({ ...prev, nascimento: e.target.value }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Endereço */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                            <input
                              type="text"
                              value={profile.endereco.cep}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                endereco: { ...prev.endereco, cep: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                            <input
                              type="text"
                              value={profile.endereco.rua}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                endereco: { ...prev.endereco, rua: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                            <input
                              type="text"
                              value={profile.endereco.numero}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                endereco: { ...prev.endereco, numero: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                            <input
                              type="text"
                              value={profile.endereco.complemento}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                endereco: { ...prev.endereco, complemento: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                            <input
                              type="text"
                              value={profile.endereco.bairro}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                endereco: { ...prev.endereco, bairro: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                            <input
                              type="text"
                              value={profile.endereco.cidade}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                endereco: { ...prev.endereco, cidade: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select
                              value={profile.endereco.estado}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                endereco: { ...prev.endereco, estado: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <option value="SP">São Paulo</option>
                              <option value="RJ">Rio de Janeiro</option>
                              <option value="MG">Minas Gerais</option>
                              {/* Adicionar outros estados */}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Alterar Senha */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Digite sua nova senha"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              >
                                {showPassword ? (
                                  <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                            <input
                              type="password"
                              placeholder="Confirme sua nova senha"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Alterar Senha
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Notificações */}
                  {activeTab === 'notificacoes' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificação</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'agendamentos' as keyof NotificationSettings, label: 'Confirmações de Agendamento', desc: 'Receba notificações quando seus agendamentos forem confirmados' },
                            { key: 'promocoes' as keyof NotificationSettings, label: 'Promoções e Ofertas', desc: 'Fique por dentro das melhores ofertas das oficinas' },
                            { key: 'lembretes' as keyof NotificationSettings, label: 'Lembretes de Manutenção', desc: 'Receba lembretes para manutenção preventiva do seu veículo' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900">{item.label}</h4>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                              </div>
                              <button
                                onClick={() => handleNotificationChange(item.key)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  notifications[item.key] ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Canais de Comunicação</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'whatsapp' as keyof NotificationSettings, label: 'WhatsApp', desc: 'Receba notificações via WhatsApp', icon: DevicePhoneMobileIcon },
                            { key: 'email' as keyof NotificationSettings, label: 'Email', desc: 'Receba notificações por email', icon: UserIcon },
                            { key: 'push' as keyof NotificationSettings, label: 'Push Notifications', desc: 'Notificações no seu dispositivo', icon: BellIcon }
                          ].map((item) => {
                            const IconComponent = item.icon
                            return (
                              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <IconComponent className="h-6 w-6 text-gray-600" />
                                  <div>
                                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleNotificationChange(item.key)}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    notifications[item.key] ? 'bg-blue-600' : 'bg-gray-200'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Privacidade */}
                  {activeTab === 'privacidade' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Privacidade</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'perfilPublico' as keyof PrivacySettings, label: 'Perfil Público', desc: 'Permitir que oficinas vejam seu perfil básico' },
                            { key: 'localizacao' as keyof PrivacySettings, label: 'Compartilhar Localização', desc: 'Permitir que oficinas vejam sua localização para sugestões' },
                            { key: 'historico' as keyof PrivacySettings, label: 'Histórico Visível', desc: 'Permitir que oficinas vejam seu histórico de serviços' },
                            { key: 'avaliacoes' as keyof PrivacySettings, label: 'Avaliações Públicas', desc: 'Suas avaliações serão visíveis para outros usuários' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900">{item.label}</h4>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                              </div>
                              <button
                                onClick={() => handlePrivacyChange(item.key)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  privacy[item.key] ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    privacy[item.key] ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2">Zona de Perigo</h4>
                        <p className="text-sm text-red-700 mb-4">As ações abaixo são irreversíveis. Tenha cuidado.</p>
                        <div className="space-y-3">
                          <button className="w-full text-left px-4 py-3 bg-white border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors">
                            Exportar Dados Pessoais
                          </button>
                          <button className="w-full text-left px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                            <TrashIcon className="h-5 w-5" />
                            Excluir Conta Permanentemente
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Pagamento */}
                  {activeTab === 'pagamento' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pagamento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Cartão 1 */}
                          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                  VISA
                                </div>
                                <div>
                                  <p className="font-medium">•••• •••• •••• 1234</p>
                                  <p className="text-sm text-gray-600">Exp: 12/26</p>
                                </div>
                              </div>
                              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                                Principal
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 text-sm bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors">
                                Editar
                              </button>
                              <button className="flex-1 text-sm bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 transition-colors">
                                Remover
                              </button>
                            </div>
                          </div>

                          {/* Cartão 2 */}
                          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                  MASTER
                                </div>
                                <div>
                                  <p className="font-medium">•••• •••• •••• 5678</p>
                                  <p className="text-sm text-gray-600">Exp: 08/25</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 text-sm bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors">
                                Editar
                              </button>
                              <button className="flex-1 text-sm bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 transition-colors">
                                Remover
                              </button>
                            </div>
                          </div>

                          {/* Adicionar Cartão */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <CreditCardIcon className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-600">Adicionar Novo Cartão</p>
                            <p className="text-xs text-gray-500">Visa, Mastercard, Elo</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">PIX</h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                              PIX
                            </div>
                            <div>
                              <p className="font-medium text-green-800">PIX Habilitado</p>
                              <p className="text-sm text-green-600">Pagamentos instantâneos disponíveis</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Pagamentos</h3>
                        <div className="space-y-3">
                          {[
                            { data: '15/01/2025', oficina: 'AutoCenter Premium', valor: 325, metodo: 'Cartão ••••1234' },
                            { data: '28/12/2024', oficina: 'Mecânica Silva', valor: 140, metodo: 'PIX' },
                            { data: '15/12/2024', oficina: 'Super Mecânica', valor: 215, metodo: 'Dinheiro' }
                          ].map((pagamento, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{pagamento.oficina}</p>
                                <p className="text-sm text-gray-600">{pagamento.data} • {pagamento.metodo}</p>
                              </div>
                              <span className="font-bold text-green-600">R$ {pagamento.valor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
