'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import RouteGuard from '@/components/auth/RouteGuard'
import { 
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  LockClosedIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface WorkshopData {
  name: string
  email: string
  phone: string
  cnpj: string
  description: string
  address: {
    street: string
    number: string
    city: string
    state: string
    zip_code: string
    neighborhood: string
  }
  business_hours: {
    monday: { open: string, close: string, closed: boolean }
    tuesday: { open: string, close: string, closed: boolean }
    wednesday: { open: string, close: string, closed: boolean }
    thursday: { open: string, close: string, closed: boolean }
    friday: { open: string, close: string, closed: boolean }
    saturday: { open: string, close: string, closed: boolean }
    sunday: { open: string, close: string, closed: boolean }
  }
  services: string[]
  price_range: 'economico' | 'medio' | 'premium'
  specialties: string[]
  avatar_url?: string
}

export default function PerfilClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [workshopData, setWorkshopData] = useState<WorkshopData>({
    name: '',
    email: '',
    phone: '',
    cnpj: '',
    description: '',
    address: {
      street: '',
      number: '',
      city: '',
      state: '',
      zip_code: '',
      neighborhood: ''
    },
    business_hours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '08:00', close: '12:00', closed: false },
      sunday: { open: '08:00', close: '12:00', closed: true }
    },
    services: [],
    price_range: 'medio',
    specialties: []
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  })

  const availableServices = [
    'Troca de óleo', 'Revisão preventiva', 'Freios', 'Suspensão', 
    'Motor', 'Câmbio', 'Ar condicionado', 'Elétrica', 'Pneus', 
    'Alinhamento', 'Balanceamento', 'Injeção eletrônica'
  ]

  const availableSpecialties = [
    'Carros nacionais', 'Carros importados', 'Motos', 'Caminhões',
    'Diesel', 'Flex', 'Elétricos', 'Híbridos'
  ]

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      setUser(session.user)

      // Carregar profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setProfile(profileData)

      // Carregar dados da oficina
      const { data: workshopData } = await supabase
        .from('workshops')
        .select('*')
        .eq('profile_id', session.user.id)
        .single()

      if (workshopData) {
        setWorkshopData({
          name: profileData?.name || '',
          email: profileData?.email || '',
          phone: workshopData.phone || '',
          cnpj: workshopData.cnpj || '',
          description: workshopData.description || '',
          address: workshopData.address || {
            street: '', number: '', city: '', state: '', zip_code: '', neighborhood: ''
          },
          business_hours: workshopData.business_hours || {
            monday: { open: '08:00', close: '18:00', closed: false },
            tuesday: { open: '08:00', close: '18:00', closed: false },
            wednesday: { open: '08:00', close: '18:00', closed: false },
            thursday: { open: '08:00', close: '18:00', closed: false },
            friday: { open: '08:00', close: '18:00', closed: false },
            saturday: { open: '08:00', close: '12:00', closed: false },
            sunday: { open: '08:00', close: '12:00', closed: true }
          },
          services: workshopData.services || [],
          price_range: workshopData.price_range || 'medio',
          specialties: workshopData.specialties || [],
          avatar_url: profileData?.avatar_url
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar dados do perfil' })
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)

      // Atualizar profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: workshopData.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (profileError) throw profileError

      // Atualizar workshops
      const { error: workshopError } = await supabase
        .from('workshops')
        .upsert({
          profile_id: user?.id,
          phone: workshopData.phone,
          cnpj: workshopData.cnpj,
          description: workshopData.description,
          address: workshopData.address,
          business_hours: workshopData.business_hours,
          services: workshopData.services,
          price_range: workshopData.price_range,
          specialties: workshopData.specialties,
          plan_type: 'free',
          updated_at: new Date().toISOString()
        })

      if (workshopError) throw workshopError

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      setIsEditing(false)
      
      setTimeout(() => setMessage(null), 3000)
      
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setMessage({ type: 'error', text: 'Erro ao salvar perfil. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ type: 'error', text: 'As senhas não coincidem' })
        return
      }

      if (passwordData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' })
        return
      }

      setSaving(true)
      setMessage(null)

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
      setShowPasswordForm(false)
      setPasswordData({ newPassword: '', confirmPassword: '' })
      
      setTimeout(() => setMessage(null), 3000)
      
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      setMessage({ type: 'error', text: 'Erro ao alterar senha. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const updateAddress = (field: string, value: string) => {
    setWorkshopData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }))
  }

  const updateBusinessHours = (day: string, field: string, value: string | boolean) => {
    setWorkshopData(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: { ...prev.business_hours[day as keyof typeof prev.business_hours], [field]: value }
      }
    }))
  }

  const toggleService = (service: string) => {
    setWorkshopData(prev => ({
      ...prev,
      services: prev.services.includes(service) 
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const toggleSpecialty = (specialty: string) => {
    setWorkshopData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  return (
    <RouteGuard allowedUserTypes={['oficina-free']}>
      <div className="flex min-h-screen bg-gray-50">
        <BeautifulSidebar 
          userType="oficina-free"
          userName={profile?.name || user?.email?.split('@')[0] || 'Oficina'}
          userEmail={user?.email || 'email@email.com'}
          onLogout={logout}
        />
        
        <div className="flex-1 md:ml-64 transition-all duration-300">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🏢 Perfil da Oficina</h1>
                <p className="text-gray-600">Gerencie as informações da sua oficina</p>
              </div>
              
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg flex items-center space-x-2 ${
                  message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}

            {/* Dados Básicos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BuildingOffice2Icon className="w-5 h-5 mr-2" />
                Dados da Oficina
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Oficina</label>
                  <input
                    type="text"
                    value={workshopData.name}
                    onChange={(e) => setWorkshopData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={workshopData.email}
                      disabled
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email não pode ser alterado</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={workshopData.phone}
                      onChange={(e) => setWorkshopData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                  <input
                    type="text"
                    value={workshopData.cnpj}
                    onChange={(e) => setWorkshopData(prev => ({ ...prev, cnpj: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="00.000.000/0001-00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={workshopData.description}
                    onChange={(e) => setWorkshopData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Descreva sua oficina, especialidades, diferenciais..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2" />
                Endereço
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                  <input
                    type="text"
                    value={workshopData.address.street}
                    onChange={(e) => updateAddress('street', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                  <input
                    type="text"
                    value={workshopData.address.number}
                    onChange={(e) => updateAddress('number', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <input
                    type="text"
                    value={workshopData.address.neighborhood}
                    onChange={(e) => updateAddress('neighborhood', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    value={workshopData.address.city}
                    onChange={(e) => updateAddress('city', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <input
                    type="text"
                    value={workshopData.address.state}
                    onChange={(e) => updateAddress('state', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                  <input
                    type="text"
                    value={workshopData.address.zip_code}
                    onChange={(e) => updateAddress('zip_code', e.target.value)}
                    disabled={!isEditing}
                    placeholder="00000-000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Horário de Funcionamento */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Horário de Funcionamento
              </h2>
              
              <div className="space-y-4">
                {Object.entries(workshopData.business_hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {day === 'monday' ? 'Segunda' :
                         day === 'tuesday' ? 'Terça' :
                         day === 'wednesday' ? 'Quarta' :
                         day === 'thursday' ? 'Quinta' :
                         day === 'friday' ? 'Sexta' :
                         day === 'saturday' ? 'Sábado' : 'Domingo'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={(e) => updateBusinessHours(day, 'closed', !e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">Aberto</span>
                    </div>
                    
                    {!hours.closed && (
                      <>
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                          disabled={!isEditing}
                          className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                        <span className="text-gray-500">até</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                          disabled={!isEditing}
                          className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </>
                    )}
                    
                    {hours.closed && (
                      <span className="text-sm text-red-600">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Serviços */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🔧 Serviços Oferecidos</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableServices.map((service) => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workshopData.services.includes(service)}
                      onChange={() => toggleService(service)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Especialidades */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">⭐ Especialidades</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableSpecialties.map((specialty) => (
                  <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workshopData.specialties.includes(specialty)}
                      onChange={() => toggleSpecialty(specialty)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Faixa de Preço */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                Faixa de Preço
              </h2>
              
              <div className="flex space-x-4">
                {[
                  { value: 'economico', label: 'Econômico', desc: 'Preços competitivos' },
                  { value: 'medio', label: 'Médio', desc: 'Custo-benefício' },
                  { value: 'premium', label: 'Premium', desc: 'Serviço diferenciado' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price_range"
                      value={option.value}
                      checked={workshopData.price_range === option.value}
                      onChange={(e) => setWorkshopData(prev => ({ ...prev, price_range: e.target.value as any }))}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                      <p className="text-xs text-gray-500">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Segurança */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <LockClosedIcon className="w-5 h-5 mr-2" />
                Segurança
              </h2>
              
              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Alterar Senha
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.new ? (
                          <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.confirm ? (
                          <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowPasswordForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      disabled={isSaving}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}