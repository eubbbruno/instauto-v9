'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
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
  LockClosedIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface OficinaProfile {
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
    site?: string
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
  fotos: string[]
  certificacoes: string[]
}

const mockProfile: OficinaProfile = {
  nomeOficina: 'Oficina Silva & Filhos',
  cnpj: '12.345.678/0001-90',
  endereco: {
    cep: '01234-567',
    rua: 'Av. Principal',
    numero: '456',
    complemento: 'Galpão 2',
    bairro: 'Vila Nova',
    cidade: 'São Paulo',
    estado: 'SP'
  },
  contato: {
    telefone: '(11) 2222-3333',
    whatsapp: '11999993333',
    email: 'contato@oficinasilva.com.br',
    site: 'www.oficinasilva.com.br'
  },
  horarioFuncionamento: {
    segunda: { abertura: '08:00', fechamento: '18:00', fechado: false },
    terca: { abertura: '08:00', fechamento: '18:00', fechado: false },
    quarta: { abertura: '08:00', fechamento: '18:00', fechado: false },
    quinta: { abertura: '08:00', fechamento: '18:00', fechado: false },
    sexta: { abertura: '08:00', fechamento: '18:00', fechado: false },
    sabado: { abertura: '08:00', fechamento: '14:00', fechado: false },
    domingo: { abertura: '09:00', fechamento: '13:00', fechado: true }
  },
  especialidades: ['Mecânica geral', 'Elétrica automotiva', 'Ar condicionado', 'Freios', 'Suspensão'],
  descricao: 'Oficina familiar com mais de 30 anos de experiência no mercado. Atendemos com qualidade e preços justos.',
  fotos: ['oficina1.jpg', 'oficina2.jpg'],
  certificacoes: ['ISO 9001', 'Bosch Car Service']
}

export default function PerfilClient() {
  const [profile, setProfile] = useState<OficinaProfile>(mockProfile)
  const [activeTab, setActiveTab] = useState('dados')
  const [isEditing, setIsEditing] = useState(false)
  const [newEspecialidade, setNewEspecialidade] = useState('')

  // Stats mockadas
  const stats = {
    avaliacaoMedia: 4.2,
    totalAvaliacoes: 128,
    clientesAtendidos: 856,
    anosAtuando: 30
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log('Perfil salvo:', profile)
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

  const tabs = [
    { id: 'dados', label: 'Dados Básicos', icon: BuildingStorefrontIcon },
    { id: 'funcionamento', label: 'Funcionamento', icon: ClockIcon },
    { id: 'galeria', label: 'Galeria', icon: PhotoIcon },
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
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-free"
        userName="Oficina Silva"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">👤 Perfil da Oficina</h1>
              <p className="text-gray-600">Gerencie as informações da sua oficina (Plano FREE)</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                Plano FREE
              </div>
              <Link href="/oficina-free/upgrade">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center gap-2 transition-all">
                  <ArrowUpIcon className="w-5 h-5" />
                  Upgrade PRO
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Preview Card */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview do Perfil Público</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      {/* Logo/Avatar */}
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                        {profile.nomeOficina.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{profile.nomeOficina}</h4>
                          <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                            FREE
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(Math.round(stats.avaliacaoMedia))}
                          <span className="text-sm font-medium text-gray-700">{stats.avaliacaoMedia}</span>
                          <span className="text-sm text-gray-500">({stats.totalAvaliacoes} avaliações)</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{profile.endereco.bairro}, {profile.endereco.cidade} - {profile.endereco.estado}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{profile.descricao}</p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {profile.especialidades.slice(0, 3).map((esp, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-100 text-xs text-green-700">
                              {esp}
                            </span>
                          ))}
                          {profile.especialidades.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-600">
                              +{profile.especialidades.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.avaliacaoMedia}</p>
                      <p className="text-sm text-gray-600">Avaliação</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.totalAvaliacoes}</p>
                      <p className="text-sm text-gray-600">Avaliações</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.clientesAtendidos}</p>
                      <p className="text-sm text-gray-600">Clientes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.anosAtuando}</p>
                      <p className="text-sm text-gray-600">Anos</p>
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
                <div className="flex flex-wrap border-b border-gray-200">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                          activeTab === tab.id
                            ? 'border-green-500 text-green-600 bg-green-50'
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
                        <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>
                        <button
                          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            isEditing 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                              isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                          <input
                            type="url"
                            value={profile.contato.site || ''}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              contato: { ...prev.contato, site: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                              isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                          <div className="absolute inset-0 bg-gray-100/80 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <LockClosedIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">PRO</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                        <textarea
                          value={profile.descricao}
                          onChange={(e) => setProfile(prev => ({ ...prev, descricao: e.target.value }))}
                          disabled={!isEditing}
                          rows={3}
                          maxLength={200}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                        <p className="text-xs text-gray-500 mt-1">Máximo 200 caracteres (FREE)</p>
                      </div>

                      {/* Especialidades */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades (Máximo 5 - FREE)</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {profile.especialidades.map((esp, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                              <span>{esp}</span>
                              {isEditing && (
                                <button
                                  onClick={() => removeEspecialidade(esp)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {isEditing && profile.especialidades.length < 5 && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newEspecialidade}
                              onChange={(e) => setNewEspecialidade(e.target.value)}
                              placeholder="Nova especialidade"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              onKeyPress={(e) => e.key === 'Enter' && addEspecialidade()}
                            />
                            <button
                              onClick={addEspecialidade}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Adicionar
                            </button>
                          </div>
                        )}
                        
                        {profile.especialidades.length >= 5 && (
                          <p className="text-xs text-orange-600">Limite de 5 especialidades atingido. Upgrade para PRO para mais!</p>
                        )}
                      </div>

                      {/* Endereço */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h4>
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
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <option value="SP">São Paulo</option>
                              <option value="RJ">Rio de Janeiro</option>
                              <option value="MG">Minas Gerais</option>
                            </select>
                          </div>
                        </div>
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
                          <div key={dia} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <input
                                  type="time"
                                  value={horario.abertura}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <span className="text-gray-500">às</span>
                                <input
                                  type="time"
                                  value={horario.fechamento}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Galeria */}
                  {activeTab === 'galeria' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Galeria de Fotos</h3>
                        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg text-sm font-medium">
                          Máximo 3 fotos (FREE)
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Foto 1 */}
                        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300">
                          <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 text-center">Foto da fachada</p>
                          <button className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">
                            Adicionar
                          </button>
                        </div>

                        {/* Foto 2 */}
                        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300">
                          <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 text-center">Área de trabalho</p>
                          <button className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">
                            Adicionar
                          </button>
                        </div>

                        {/* Foto 3 */}
                        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300">
                          <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 text-center">Equipamentos</p>
                          <button className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">
                            Adicionar
                          </button>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Dicas para boas fotos:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Use boa iluminação natural</li>
                          <li>• Mantenha o ambiente organizado</li>
                          <li>• Mostre seus equipamentos e ferramentas</li>
                          <li>• Destaque a limpeza e organização</li>
                        </ul>
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
                      <h3 className="text-lg font-semibold text-gray-900">Configurações de Visibilidade</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Perfil Público</h4>
                            <p className="text-sm text-gray-600">Aparecer nos resultados de busca</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-green-600 transition-colors duration-200 ease-in-out focus:outline-none">
                            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Mostrar Telefone</h4>
                            <p className="text-sm text-gray-600">Exibir telefone no perfil público</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-green-600 transition-colors duration-200 ease-in-out focus:outline-none">
                            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg relative">
                          <div>
                            <h4 className="font-medium text-gray-900">Ranking Premium</h4>
                            <p className="text-sm text-gray-600">Aparecer no topo dos resultados</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none">
                            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
                          </button>
                          
                          <div className="absolute inset-0 bg-gray-100/80 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <LockClosedIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">PRO</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Upgrade Banner */}
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xl font-bold mb-2">🚀 Upgrade para PRO</h4>
                            <p className="text-green-100">Mais visibilidade, fotos ilimitadas, certificações e muito mais!</p>
                          </div>
                          <Link href="/oficina-free/upgrade">
                            <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                              Ver Planos
                            </button>
                          </Link>
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
