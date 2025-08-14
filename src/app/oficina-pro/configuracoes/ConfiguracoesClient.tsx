'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  Cog6ToothIcon,
  BuildingStorefrontIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ChartBarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  PhotoIcon,
  CameraIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  CurrencyDollarIcon,
  StarIcon,
  LockClosedIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  StarIcon as CrownIcon
} from '@heroicons/react/24/outline'

export default function ConfiguracoesClient() {
  const [activeTab, setActiveTab] = useState('empresa')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Estados dos formulários
  const [configuracoes, setConfiguracoes] = useState({
    empresa: {
      nome: 'AutoCenter Premium Pro',
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'AutoCenter Premium LTDA',
      endereco: {
        cep: '01234-567',
        rua: 'Av. Tecnologia Premium',
        numero: '1500',
        complemento: 'Complexo Automotivo',
        bairro: 'Vila Empresarial',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      contato: {
        telefone: '(11) 3333-4444',
        whatsapp: '11999994444',
        email: 'contato@autocenterpremium.com.br',
        site: 'www.autocenterpremium.com.br'
      },
      horarioFuncionamento: {
        segunda: { abertura: '07:00', fechamento: '19:00', fechado: false },
        terca: { abertura: '07:00', fechamento: '19:00', fechado: false },
        quarta: { abertura: '07:00', fechamento: '19:00', fechado: false },
        quinta: { abertura: '07:00', fechamento: '19:00', fechado: false },
        sexta: { abertura: '07:00', fechamento: '19:00', fechado: false },
        sabado: { abertura: '08:00', fechamento: '16:00', fechado: false },
        domingo: { abertura: '09:00', fechamento: '15:00', fechado: false }
      }
    },
    usuario: {
      nome: 'Carlos Roberto Silva',
      email: 'carlos@autocenterpremium.com.br',
      telefone: '(11) 99999-8888',
      cargo: 'Gerente Geral',
      avatar: '',
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    },
    notificacoes: {
      email: {
        agendamentos: true,
        pagamentos: true,
        avaliacoes: true,
        marketing: false,
        sistema: true
      },
      push: {
        agendamentos: true,
        mensagens: true,
        urgencias: true,
        promocoes: false
      },
      whatsapp: {
        confirmacoes: true,
        lembretes: true,
        promocoes: false
      }
    },
    privacidade: {
      perfilPublico: true,
      mostrarTelefone: true,
      mostrarWhatsapp: true,
      mostrarEndereco: true,
      aceitarAvaliacoes: true,
      dataSharing: false
    },
    pagamentos: {
      metodoPrincipal: 'pix',
      pixKey: 'autocenterpremium@pix.com',
      banco: 'Banco do Brasil',
      agencia: '1234-5',
      conta: '67890-1',
      parcelamento: true,
      taxaCartao: 3.5
    },
    integracoes: {
      googleMaps: true,
      whatsappBusiness: true,
      mercadoPago: true,
      analytics: true,
      crm: false,
      erp: false
    },
    seo: {
      titulo: 'AutoCenter Premium Pro - Oficina Especializada SP',
      descricao: 'Centro automotivo premium com 25 anos de experiência. Serviços especializados com garantia total.',
      palavrasChave: ['oficina premium', 'centro automotivo', 'são paulo', 'especializada'],
      analytics: 'GA-XXXXXXXXX',
      pixelFacebook: 'FB-XXXXXXXXX'
    }
  })

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: BuildingStorefrontIcon },
    { id: 'usuario', label: 'Usuário', icon: UserIcon },
    { id: 'notificacoes', label: 'Notificações', icon: BellIcon },
    { id: 'privacidade', label: 'Privacidade', icon: ShieldCheckIcon },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCardIcon },
    { id: 'integracoes', label: 'Integrações', icon: GlobeAltIcon },
    { id: 'seo', label: 'SEO & Marketing', icon: ChartBarIcon },
    { id: 'plano', label: 'Plano PRO', icon: CrownIcon }
  ]

  const handleSave = () => {
    setIsEditing(false)
    console.log('Configurações salvas:', configuracoes)
  }

  const renderToggle = (value: boolean, onChange: (val: boolean) => void, disabled = false) => (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        value ? 'bg-amber-600' : 'bg-gray-200'
      } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-pro"
        userName="AutoCenter PRO"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Cog6ToothIcon className="h-8 w-8 text-amber-500" />
                Configurações PRO
              </h1>
              <p className="text-gray-600">Configurações avançadas e personalizações do seu negócio</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <CrownIcon className="w-4 h-4" />
                Plano PRO
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 flex items-center gap-2 transition-all"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 flex items-center gap-2 transition-all"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Salvar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 flex items-center gap-2 transition-all"
                >
                  <PencilIcon className="w-5 h-5" />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Tabs */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-amber-500 text-amber-600 bg-amber-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        {tab.label}
                        {tab.id === 'plano' && (
                          <CrownIcon className="h-4 w-4 text-amber-500" />
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="p-6">
                  {/* Tab: Empresa */}
                  {activeTab === 'empresa' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações da Empresa</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Fantasia</label>
                            <input
                              type="text"
                              value={configuracoes.empresa.nome}
                              disabled={!isEditing}
                              onChange={(e) => setConfiguracoes(prev => ({
                                ...prev,
                                empresa: { ...prev.empresa, nome: e.target.value }
                              }))}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                            <input
                              type="text"
                              value={configuracoes.empresa.cnpj}
                              disabled
                              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">CNPJ não pode ser alterado</p>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social</label>
                            <input
                              type="text"
                              value={configuracoes.empresa.razaoSocial}
                              disabled={!isEditing}
                              onChange={(e) => setConfiguracoes(prev => ({
                                ...prev,
                                empresa: { ...prev.empresa, razaoSocial: e.target.value }
                              }))}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Endereço */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">📍 Endereço</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                            <input
                              type="text"
                              value={configuracoes.empresa.endereco.cep}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                            <input
                              type="text"
                              value={configuracoes.empresa.endereco.rua}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                            <input
                              type="text"
                              value={configuracoes.empresa.endereco.numero}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                            <input
                              type="text"
                              value={configuracoes.empresa.endereco.complemento}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                            <input
                              type="text"
                              value={configuracoes.empresa.endereco.bairro}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contato */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">📞 Contato</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                            <input
                              type="tel"
                              value={configuracoes.empresa.contato.telefone}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                            <input
                              type="tel"
                              value={configuracoes.empresa.contato.whatsapp}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                              type="email"
                              value={configuracoes.empresa.contato.email}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                            <input
                              type="url"
                              value={configuracoes.empresa.contato.site}
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Usuário */}
                  {activeTab === 'usuario' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Dados Pessoais</h3>
                        
                        <div className="flex items-start gap-6 mb-6">
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                              {configuracoes.usuario.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            {isEditing && (
                              <button className="mt-2 text-sm bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors">
                                Alterar Foto
                              </button>
                            )}
                          </div>
                          
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                              <input
                                type="text"
                                value={configuracoes.usuario.nome}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Cargo/Função</label>
                              <input
                                type="text"
                                value={configuracoes.usuario.cargo}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                              <input
                                type="email"
                                value={configuracoes.usuario.email}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                              <input
                                type="tel"
                                value={configuracoes.usuario.telefone}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Segurança */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">🔒 Segurança</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={configuracoes.usuario.senhaAtual}
                                disabled={!isEditing}
                                placeholder={isEditing ? "Digite sua senha atual" : "••••••••"}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                            <input
                              type="password"
                              value={configuracoes.usuario.novaSenha}
                              disabled={!isEditing}
                              placeholder={isEditing ? "Nova senha" : "••••••••"}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                            <input
                              type="password"
                              value={configuracoes.usuario.confirmarSenha}
                              disabled={!isEditing}
                              placeholder={isEditing ? "Confirme a nova senha" : "••••••••"}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Autenticação de Dois Fatores (2FA)</span>
                          </div>
                          <p className="text-sm text-blue-700 mt-1">
                            Adicione uma camada extra de segurança à sua conta
                          </p>
                          <button className="mt-2 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                            Configurar 2FA
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Notificações */}
                  {activeTab === 'notificacoes' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferências de Notificação</h3>
                        
                        <div className="space-y-6">
                          {/* Email */}
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                              Email
                            </h4>
                            <div className="space-y-3">
                              {[
                                { key: 'agendamentos', label: 'Novos agendamentos e alterações' },
                                { key: 'pagamentos', label: 'Confirmações de pagamento' },
                                { key: 'avaliacoes', label: 'Novas avaliações de clientes' },
                                { key: 'marketing', label: 'Dicas e novidades do InstaAuto' },
                                { key: 'sistema', label: 'Atualizações do sistema' }
                              ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="text-gray-700">{item.label}</span>
                                  {renderToggle(
                                    configuracoes.notificacoes.email[item.key as keyof typeof configuracoes.notificacoes.email],
                                    (val) => setConfiguracoes(prev => ({
                                      ...prev,
                                      notificacoes: {
                                        ...prev.notificacoes,
                                        email: { ...prev.notificacoes.email, [item.key]: val }
                                      }
                                    }))
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Push */}
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <DevicePhoneMobileIcon className="h-5 w-5 text-green-500" />
                              Push Notifications
                            </h4>
                            <div className="space-y-3">
                              {[
                                { key: 'agendamentos', label: 'Agendamentos urgentes' },
                                { key: 'mensagens', label: 'Novas mensagens de clientes' },
                                { key: 'urgencias', label: 'Solicitações de emergência' },
                                { key: 'promocoes', label: 'Oportunidades de negócio' }
                              ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="text-gray-700">{item.label}</span>
                                  {renderToggle(
                                    configuracoes.notificacoes.push[item.key as keyof typeof configuracoes.notificacoes.push],
                                    (val) => setConfiguracoes(prev => ({
                                      ...prev,
                                      notificacoes: {
                                        ...prev.notificacoes,
                                        push: { ...prev.notificacoes.push, [item.key]: val }
                                      }
                                    }))
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* WhatsApp */}
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <PhoneIcon className="h-5 w-5 text-green-600" />
                              WhatsApp Business
                            </h4>
                            <div className="space-y-3">
                              {[
                                { key: 'confirmacoes', label: 'Confirmações de agendamento' },
                                { key: 'lembretes', label: 'Lembretes para clientes' },
                                { key: 'promocoes', label: 'Campanhas promocionais' }
                              ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="text-gray-700">{item.label}</span>
                                  {renderToggle(
                                    configuracoes.notificacoes.whatsapp[item.key as keyof typeof configuracoes.notificacoes.whatsapp],
                                    (val) => setConfiguracoes(prev => ({
                                      ...prev,
                                      notificacoes: {
                                        ...prev.notificacoes,
                                        whatsapp: { ...prev.notificacoes.whatsapp, [item.key]: val }
                                      }
                                    }))
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Privacidade */}
                  {activeTab === 'privacidade' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações de Privacidade</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-4">🔍 Visibilidade Pública</h4>
                            <div className="space-y-4">
                              {[
                                { key: 'perfilPublico', label: 'Perfil público da oficina', desc: 'Aparecer nos resultados de busca' },
                                { key: 'mostrarTelefone', label: 'Mostrar telefone', desc: 'Exibir número de telefone no perfil' },
                                { key: 'mostrarWhatsapp', label: 'Mostrar WhatsApp', desc: 'Permitir contato direto via WhatsApp' },
                                { key: 'mostrarEndereco', label: 'Mostrar endereço completo', desc: 'Exibir endereço detalhado' },
                                { key: 'aceitarAvaliacoes', label: 'Aceitar avaliações', desc: 'Permitir que clientes avaliem os serviços' }
                              ].map((item) => (
                                <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                  <div>
                                    <span className="font-medium text-gray-900">{item.label}</span>
                                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                  </div>
                                  {renderToggle(
                                    configuracoes.privacidade[item.key as keyof typeof configuracoes.privacidade],
                                    (val) => setConfiguracoes(prev => ({
                                      ...prev,
                                      privacidade: { ...prev.privacidade, [item.key]: val }
                                    }))
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-4">🛡️ Proteção de Dados</h4>
                            <div className="space-y-4">
                              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <span className="font-medium text-gray-900">Compartilhamento de dados para análises</span>
                                  <p className="text-sm text-gray-600 mt-1">Permitir uso de dados anônimos para melhorias do sistema</p>
                                </div>
                                {renderToggle(
                                  configuracoes.privacidade.dataSharing,
                                  (val) => setConfiguracoes(prev => ({
                                    ...prev,
                                    privacidade: { ...prev.privacidade, dataSharing: val }
                                  }))
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                              <span className="font-medium text-blue-800">Conformidade LGPD</span>
                            </div>
                            <p className="text-sm text-blue-700">
                              Todas as suas configurações de privacidade estão em conformidade com a Lei Geral de Proteção de Dados (LGPD).
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Plano PRO */}
                  {activeTab === 'plano' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                          <CrownIcon className="h-6 w-6 text-amber-500" />
                          Plano PRO
                        </h3>
                        
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xl font-bold mb-2">🎉 Você está no Plano PRO!</h4>
                              <p className="text-amber-100">
                                Aproveite todos os recursos premium para fazer seu negócio crescer
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">R$ 89</p>
                              <p className="text-amber-100">por mês</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">✨ Recursos Ativos</h4>
                            <ul className="space-y-2 text-sm">
                              {[
                                'Mensagens ilimitadas',
                                'Relatórios avançados',
                                'Galeria ilimitada',
                                'SEO e marketing',
                                'Integrações premium',
                                'Suporte prioritário',
                                'Analytics detalhadas',
                                'Templates profissionais'
                              ].map((recurso, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                  <span className="text-gray-700">{recurso}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">📊 Uso Atual</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Mensagens este mês</span>
                                  <span className="font-medium">1.247 / Ilimitado</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Relatórios gerados</span>
                                  <span className="font-medium">45 / Ilimitado</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Fotos na galeria</span>
                                  <span className="font-medium">89 / Ilimitado</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 mb-4">⚙️ Gerenciar Assinatura</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Próxima cobrança</p>
                              <p className="font-bold text-gray-900">15/02/2025</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Método de pagamento</p>
                              <p className="font-bold text-gray-900">PIX automático</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Status</p>
                              <p className="font-bold text-green-600">Ativo</p>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex gap-3">
                            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                              Alterar Método de Pagamento
                            </button>
                            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                              Baixar Faturas
                            </button>
                            <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                              Cancelar Assinatura
                            </button>
                          </div>
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
