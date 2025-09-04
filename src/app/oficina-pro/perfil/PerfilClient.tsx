'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import RouteGuard from '@/components/auth/RouteGuard'
import { 
  BuildingStorefrontIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ChartBarIcon,
  BellIcon,
  PlusIcon,
  TrashIcon,
  GlobeAltIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface OficinaProfilePro {
  nomeOficina: string
  cnpj: string
  endereco: {
    cep: string
    rua: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
  contato: {
    telefone: string
    whatsapp: string
    email: string
    site: string
    redesSociais: {
      instagram?: string
      facebook?: string
      linkedin?: string
    }
  }
  horarioFuncionamento: {
    segunda: { abertura: string, fechamento: string, fechado: boolean }
    terca: { abertura: string, fechamento: string, fechado: boolean }
    quarta: { abertura: string, fechamento: string, fechado: boolean }
    quinta: { abertura: string, fechamento: string, fechado: boolean }
    sexta: { abertura: string, fechamento: string, fechado: boolean }
    sabado: { abertura: string, fechamento: string, fechado: boolean }
    domingo: { abertura: string, fechamento: string, fechado: boolean }
  }
  especialidades: string[]
  descricao: string
  descricaoDetalhada: string
  fotos: string[]
  videos: string[]
  certificacoes: string[]
  premios: string[]
  equipamentos: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

const mockProfilePro: OficinaProfilePro = {
  nomeOficina: 'AutoCenter Premium Pro',
  cnpj: '98.765.432/0001-10',
  endereco: {
    cep: '01234-567',
    rua: 'Av. Tecnologia',
    numero: '1500',
    complemento: 'Complexo Automotivo',
    bairro: 'Vila Industrial',
    cidade: 'São Paulo',
    estado: 'SP'
  },
  contato: {
    telefone: '(11) 3333-4444',
    whatsapp: '11999994444',
    email: 'contato@autocenterpremium.com.br',
    site: 'www.autocenterpremium.com.br',
    redesSociais: {
      instagram: '@autocenterpremium',
      facebook: 'AutoCenterPremium',
      linkedin: 'company/autocenter-premium'
    }
  },
  horarioFuncionamento: {
    segunda: { abertura: '07:00', fechamento: '19:00', fechado: false },
    terca: { abertura: '07:00', fechamento: '19:00', fechado: false },
    quarta: { abertura: '07:00', fechamento: '19:00', fechado: false },
    quinta: { abertura: '07:00', fechamento: '19:00', fechado: false },
    sexta: { abertura: '07:00', fechamento: '19:00', fechado: false },
    sabado: { abertura: '08:00', fechamento: '16:00', fechado: false },
    domingo: { abertura: '09:00', fechamento: '15:00', fechado: false }
  },
  especialidades: [
    'Mecânica avançada', 'Eletrônica automotiva', 'Injeção eletrônica', 
    'Ar condicionado', 'Freios ABS', 'Suspensão a ar', 'Cambio automático',
    'Motor turbo', 'Diagnóstico computadorizado', 'Reprogramação ECU'
  ],
  descricao: 'Centro automotivo premium com tecnologia de ponta e atendimento especializado.',
  descricaoDetalhada: 'O AutoCenter Premium Pro é referência em excelência automotiva, oferecendo serviços especializados com equipamentos de última geração. Nossa equipe altamente qualificada atende veículos nacionais e importados com garantia total. Mais de 25 anos no mercado, certificações internacionais e milhares de clientes satisfeitos.',
  fotos: ['oficina1.jpg', 'oficina2.jpg', 'oficina3.jpg', 'oficina4.jpg', 'oficina5.jpg'],
  videos: ['video1.mp4', 'video2.mp4'],
  certificacoes: ['ISO 9001:2015', 'Bosch Car Service', 'Mercedes-Benz Certified', 'BMW Service Partner'],
  premios: ['Melhor Oficina 2023 - SINDIPEÇAS', 'Excelência em Atendimento - PROCON'],
  equipamentos: ['Scanner OBD2 Profissional', 'Bancada de Teste de Injetores', 'Alinhador 3D', 'Balanceadora Digital'],
  seo: {
    metaTitle: 'AutoCenter Premium Pro - Oficina Especializada em SP',
    metaDescription: 'Centro automotivo premium com tecnologia de ponta. Mecânica, eletrônica e diagnóstico especializado. 25 anos de experiência.',
    keywords: ['oficina mecanica', 'centro automotivo', 'injecao eletronica', 'diagnostico', 'sao paulo']
  }
}

export default function PerfilClient() {
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [profile, setProfile] = useState<OficinaProfilePro>(mockProfilePro)
  const [activeTab, setActiveTab] = useState('dados')
  const [isEditing, setIsEditing] = useState(false)
  const [newEspecialidade, setNewEspecialidade] = useState('')
  const [newCertificacao, setNewCertificacao] = useState('')

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      setUser(session.user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setProfileData(profileData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // Stats avançadas
  const stats = {
    avaliacaoMedia: 4.9,
    totalAvaliacoes: 1247,
    clientesAtendidos: 15420,
    anosAtuando: 25,
    rankingCidade: 2,
    certificacoes: profile.certificacoes.length
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log('Perfil PRO salvo:', profile)
  }

  const addEspecialidade = () => {
    if (newEspecialidade.trim() && !profile.especialidades.includes(newEspecialidade)) {
      setProfile(prev => ({
        ...prev,
        especialidades: [...prev.especialidades, newEspecialidade.trim()]
      }))
      setNewEspecialidade('')
    }
  }

  const removeEspecialidade = (especialidade: string) => {
    setProfile(prev => ({
      ...prev,
      especialidades: prev.especialidades.filter(esp => esp !== especialidade)
    }))
  }

  const addCertificacao = () => {
    if (newCertificacao.trim() && !profile.certificacoes.includes(newCertificacao)) {
      setProfile(prev => ({
        ...prev,
        certificacoes: [...prev.certificacoes, newCertificacao.trim()]
      }))
      setNewCertificacao('')
    }
  }

  const removeCertificacao = (certificacao: string) => {
    setProfile(prev => ({
      ...prev,
      certificacoes: prev.certificacoes.filter(cert => cert !== certificacao)
    }))
  }

  const tabs = [
    { id: 'dados', label: 'Dados Básicos', icon: BuildingStorefrontIcon },
    { id: 'funcionamento', label: 'Funcionamento', icon: ClockIcon },
    { id: 'galeria', label: 'Galeria PRO', icon: PhotoIcon },
    { id: 'certificacoes', label: 'Certificações', icon: ShieldCheckIcon },
    { id: 'seo', label: 'SEO & Marketing', icon: ChartBarIcon },
    { id: 'visibilidade', label: 'Visibilidade', icon: EyeIcon }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <RouteGuard allowedUserTypes={['oficina-pro']}>
      <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-pro"
        userName={profileData?.name || user?.email?.split('@')[0] || 'Oficina PRO'}
        userEmail={user?.email || 'email@email.com'}
        onLogout={logout}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">👑 Perfil PRO da Oficina</h1>
              <p className="text-gray-600">Gestão completa e avançada do seu perfil profissional</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <TrophyIcon className="w-4 h-4" />
                Plano PRO
              </div>
              <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium">
                #2 no Ranking
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Preview Card Avançado */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview do Perfil Público PRO</h3>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <div className="flex items-start gap-6">
                      {/* Logo/Avatar PRO */}
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                          {profile.nomeOficina.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          PRO
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-2xl font-bold text-gray-900">{profile.nomeOficina}</h4>
                          <div className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                            <TrophyIcon className="w-3 h-3" />
                            PRO
                          </div>
                          <div className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">
                            #{stats.rankingCidade} na cidade
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          {renderStars(Math.round(stats.avaliacaoMedia))}
                          <span className="text-lg font-bold text-gray-700">{stats.avaliacaoMedia}</span>
                          <span className="text-sm text-gray-500">({stats.totalAvaliacoes} avaliações)</span>
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                            Verificado ✓
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{profile.endereco.bairro}, {profile.endereco.cidade} - {profile.endereco.estado}</span>
                          <span className="mx-2">•</span>
                          <span>{stats.anosAtuando} anos de experiência</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{profile.descricaoDetalhada}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {profile.especialidades.slice(0, 5).map((esp, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-100 text-xs text-amber-700 font-medium">
                              {esp}
                            </span>
                          ))}
                          {profile.especialidades.length > 5 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-600">
                              +{profile.especialidades.length - 5} mais
                            </span>
                          )}
                        </div>

                        {/* Certificações destaque */}
                        <div className="flex items-center gap-2">
                          <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">
                            {profile.certificacoes.length} Certificações
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-600">ISO 9001 • Bosch • Mercedes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Avançadas */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-600">{stats.avaliacaoMedia}</p>
                      <p className="text-sm text-gray-600">Avaliação</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-600">{stats.totalAvaliacoes}</p>
                      <p className="text-sm text-gray-600">Reviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-600">{stats.clientesAtendidos.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Clientes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-600">{stats.anosAtuando}</p>
                      <p className="text-sm text-gray-600">Anos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-600">#{stats.rankingCidade}</p>
                      <p className="text-sm text-gray-600">Ranking</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-600">{stats.certificacoes}</p>
                      <p className="text-sm text-gray-600">Certificações</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
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
                      </button>
                    )
                  })}
                </div>

                <div className="p-6">
                  {/* Tab: Dados Básicos */}
                  {activeTab === 'dados' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Informações Completas</h3>
                        <button
                          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            isEditing 
                              ? 'bg-amber-600 text-white hover:bg-amber-700' 
                              : 'bg-amber-600 text-white hover:bg-amber-700'
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Oficina</label>
                          <input
                            type="text"
                            value={profile.nomeOficina}
                            onChange={(e) => setProfile(prev => ({ ...prev, nomeOficina: e.target.value }))}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                          <input
                            type="text"
                            value={profile.cnpj}
                            disabled
                            className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">CNPJ não pode ser alterado</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            value={profile.contato.email}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              contato: { ...prev.contato, email: e.target.value }
                            }))}
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
                            value={profile.contato.telefone}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              contato: { ...prev.contato, telefone: e.target.value }
                            }))}
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
                            value={profile.contato.whatsapp}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              contato: { ...prev.contato, whatsapp: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Site Oficial</label>
                          <input
                            type="url"
                            value={profile.contato.site}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              contato: { ...prev.contato, site: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Redes Sociais PRO */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociais (PRO)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                            <input
                              type="text"
                              value={profile.contato.redesSociais.instagram || ''}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                contato: { 
                                  ...prev.contato, 
                                  redesSociais: { ...prev.contato.redesSociais, instagram: e.target.value }
                                }
                              }))}
                              disabled={!isEditing}
                              placeholder="@usuario"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                            <input
                              type="text"
                              value={profile.contato.redesSociais.facebook || ''}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                contato: { 
                                  ...prev.contato, 
                                  redesSociais: { ...prev.contato.redesSociais, facebook: e.target.value }
                                }
                              }))}
                              disabled={!isEditing}
                              placeholder="NomeDaPagina"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                            <input
                              type="text"
                              value={profile.contato.redesSociais.linkedin || ''}
                              onChange={(e) => setProfile(prev => ({ 
                                ...prev, 
                                contato: { 
                                  ...prev.contato, 
                                  redesSociais: { ...prev.contato.redesSociais, linkedin: e.target.value }
                                }
                              }))}
                              disabled={!isEditing}
                              placeholder="company/empresa"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Descrições */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Resumida</label>
                          <textarea
                            value={profile.descricao}
                            onChange={(e) => setProfile(prev => ({ ...prev, descricao: e.target.value }))}
                            disabled={!isEditing}
                            rows={3}
                            maxLength={200}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                          <p className="text-xs text-gray-500 mt-1">Para listagens e busca rápida</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada (PRO)</label>
                          <textarea
                            value={profile.descricaoDetalhada}
                            onChange={(e) => setProfile(prev => ({ ...prev, descricaoDetalhada: e.target.value }))}
                            disabled={!isEditing}
                            rows={3}
                            maxLength={1000}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                          <p className="text-xs text-gray-500 mt-1">Até 1000 caracteres - aparece no perfil completo</p>
                        </div>
                      </div>

                      {/* Especialidades Ilimitadas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades (Ilimitadas - PRO)</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {profile.especialidades.map((esp, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">
                              <span>{esp}</span>
                              {isEditing && (
                                <button
                                  onClick={() => removeEspecialidade(esp)}
                                  className="text-amber-600 hover:text-amber-800"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {isEditing && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newEspecialidade}
                              onChange={(e) => setNewEspecialidade(e.target.value)}
                              placeholder="Nova especialidade"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              onKeyPress={(e) => e.key === 'Enter' && addEspecialidade()}
                            />
                            <button
                              onClick={addEspecialidade}
                              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                            >
                              Adicionar
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Funcionamento */}
                  {activeTab === 'funcionamento' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Horário de Funcionamento</h3>
                      
                      <div className="space-y-4">
                        {Object.entries(profile.horarioFuncionamento).map(([dia, horario]) => (
                          <div key={dia} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="w-24">
                              <span className="font-medium text-gray-900 capitalize">
                                {dia === 'segunda' ? 'Segunda' :
                                 dia === 'terca' ? 'Terça' :
                                 dia === 'quarta' ? 'Quarta' :
                                 dia === 'quinta' ? 'Quinta' :
                                 dia === 'sexta' ? 'Sexta' :
                                 dia === 'sabado' ? 'Sábado' : 'Domingo'}
                              </span>
                            </div>
                            
                            {horario.fechado ? (
                              <div className="flex items-center gap-4">
                                <span className="text-red-600 font-medium">Fechado</span>
                                <button className="text-amber-600 hover:text-amber-800 text-sm">
                                  Abrir
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <input
                                  type="time"
                                  value={horario.abertura}
                                  className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <span className="text-gray-500">às</span>
                                <input
                                  type="time"
                                  value={horario.fechamento}
                                  className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button className="text-red-600 hover:text-red-800 text-sm">
                                  Fechar
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Dica PRO:</h4>
                        <p className="text-sm text-blue-700">
                          Horários especiais aparecem destacados na busca. Considere atendimento aos finais de semana para atrair mais clientes!
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Galeria PRO */}
                  {activeTab === 'galeria' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Galeria Profissional</h3>
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                          Fotos e Vídeos Ilimitados
                        </div>
                      </div>
                      
                      {/* Fotos */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">Fotos da Oficina</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {Array.from({ length: 8 }, (_, i) => (
                            <div key={i} className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] border-2 border-dashed border-gray-300 hover:border-amber-400 transition-colors">
                              <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-xs text-gray-600 text-center">Foto {i + 1}</p>
                              <button className="mt-2 text-xs bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors">
                                {i < 5 ? 'Alterar' : 'Adicionar'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Vídeos PRO */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">Vídeos Promocionais (PRO)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {Array.from({ length: 3 }, (_, i) => (
                            <div key={i} className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[150px] border-2 border-dashed border-gray-300 hover:border-amber-400 transition-colors">
                              <PlayIcon className="h-12 w-12 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 text-center">Vídeo {i + 1}</p>
                              <p className="text-xs text-gray-500 text-center mb-3">Máx 2 minutos</p>
                              <button className="text-xs bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors">
                                {i === 0 ? 'Alterar' : 'Adicionar'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-semibold text-amber-800 mb-2">🎥 Dicas para Vídeos PRO:</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                          <li>• Mostre sua equipe trabalhando</li>
                          <li>• Destaque equipamentos modernos</li>
                          <li>• Inclua depoimentos de clientes</li>
                          <li>• Use boa qualidade de áudio e vídeo</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Certificações */}
                  {activeTab === 'certificacoes' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Certificações e Reconhecimentos</h3>
                      
                      {/* Certificações */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">Certificações Técnicas</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {profile.certificacoes.map((cert, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm">
                              <ShieldCheckIcon className="h-4 w-4" />
                              <span>{cert}</span>
                              {isEditing && (
                                <button
                                  onClick={() => removeCertificacao(cert)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {isEditing && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCertificacao}
                              onChange={(e) => setNewCertificacao(e.target.value)}
                              placeholder="Nova certificação"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              onKeyPress={(e) => e.key === 'Enter' && addCertificacao()}
                            />
                            <button
                              onClick={addCertificacao}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Adicionar
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Prêmios */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">Prêmios e Reconhecimentos</h4>
                        <div className="space-y-3">
                          {profile.premios.map((premio, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <TrophyIcon className="h-6 w-6 text-yellow-600" />
                              <span className="font-medium text-gray-800">{premio}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Equipamentos */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">Equipamentos Especializados</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {profile.equipamentos.map((equipamento, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-800">{equipamento}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: SEO & Marketing */}
                  {activeTab === 'seo' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">SEO & Marketing Digital</h3>
                        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm font-medium">
                          Recursos Avançados PRO
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Título (SEO)</label>
                          <input
                            type="text"
                            value={profile.seo.metaTitle}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              seo: { ...prev.seo, metaTitle: e.target.value }
                            }))}
                            maxLength={60}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Até 60 caracteres - aparece no Google</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Descrição (SEO)</label>
                          <textarea
                            value={profile.seo.metaDescription}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              seo: { ...prev.seo, metaDescription: e.target.value }
                            }))}
                            maxLength={160}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Até 160 caracteres - descrição no Google</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Palavras-chave</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {profile.seo.keywords.map((keyword, idx) => (
                              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                                {keyword}
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Digite uma palavra-chave e pressione Enter"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                        <h4 className="font-semibold text-purple-800 mb-3">📈 Análise de Performance</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">2.847</p>
                            <p className="text-sm text-purple-700">Visualizações mês</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">456</p>
                            <p className="text-sm text-purple-700">Cliques no site</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">89</p>
                            <p className="text-sm text-purple-700">Contatos gerados</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">16%</p>
                            <p className="text-sm text-purple-700">Taxa conversão</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Visibilidade */}
                  {activeTab === 'visibilidade' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Configurações de Visibilidade PRO</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <h4 className="font-medium text-gray-900">Perfil Público Premium</h4>
                            <p className="text-sm text-gray-600">Aparecer em destaque nos resultados</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-amber-600 transition-colors duration-200 ease-in-out focus:outline-none">
                            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <h4 className="font-medium text-gray-900">Ranking Premium</h4>
                            <p className="text-sm text-gray-600">Aparecer no topo dos resultados de busca</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-amber-600 transition-colors duration-200 ease-in-out focus:outline-none">
                            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <h4 className="font-medium text-gray-900">Badge Verificado</h4>
                            <p className="text-sm text-gray-600">Selo de oficina verificada e confiável</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-amber-600 transition-colors duration-200 ease-in-out focus:outline-none">
                            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <h4 className="font-medium text-gray-900">Análises Avançadas</h4>
                            <p className="text-sm text-gray-600">Relatórios detalhados de visualizações e conversões</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-amber-600 transition-colors duration-200 ease-in-out focus:outline-none">
                            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                          </button>
                        </div>
                      </div>

                      {/* Estatísticas PRO */}
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
                        <h4 className="text-xl font-bold mb-4">📊 Sua Performance PRO</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold">2.1k</p>
                            <p className="text-amber-100">Visualizações</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold">89%</p>
                            <p className="text-amber-100">Rank Score</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold">#2</p>
                            <p className="text-amber-100">Posição</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold">4.9</p>
                            <p className="text-amber-100">Avaliação</p>
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
    </RouteGuard>
  )
}
