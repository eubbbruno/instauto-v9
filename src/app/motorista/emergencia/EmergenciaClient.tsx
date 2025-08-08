'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { useGeolocationSearch } from '@/lib/geolocation-search'
import { useNotifications } from '@/lib/notifications'
import { 
  ExclamationTriangleIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  FireIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline'

interface EmergencyService {
  id: string
  name: string
  type: 'guincho' | 'mecanico' | 'pneu' | 'bateria' | 'combustivel'
  phone: string
  whatsapp: string
  responseTime: string
  price: string
  rating: number
  available24h: boolean
  distance: number
  description: string
}

const mockEmergencyServices: EmergencyService[] = [
  {
    id: '1',
    name: 'Guincho Express 24h',
    type: 'guincho',
    phone: '(11) 99999-1111',
    whatsapp: '11999991111',
    responseTime: '15-30 min',
    price: 'R$ 80-150',
    rating: 4.8,
    available24h: true,
    distance: 2.1,
    description: 'Guincho especializado 24h, atende toda a região metropolitana'
  },
  {
    id: '2',
    name: 'SOS Mecânico',
    type: 'mecanico',
    phone: '(11) 99999-2222', 
    whatsapp: '11999992222',
    responseTime: '20-40 min',
    price: 'R$ 120-200',
    rating: 4.6,
    available24h: true,
    distance: 3.5,
    description: 'Mecânico móvel especializado em emergências automotivas'
  },
  {
    id: '3',
    name: 'Pneu Socorro',
    type: 'pneu',
    phone: '(11) 99999-3333',
    whatsapp: '11999993333', 
    responseTime: '10-25 min',
    price: 'R$ 40-80',
    rating: 4.7,
    available24h: false,
    distance: 1.8,
    description: 'Troca de pneus no local, pneus novos e seminovos'
  },
  {
    id: '4',
    name: 'Start Baterias',
    type: 'bateria',
    phone: '(11) 99999-4444',
    whatsapp: '11999994444',
    responseTime: '15-30 min', 
    price: 'R$ 60-120',
    rating: 4.5,
    available24h: true,
    distance: 2.7,
    description: 'Troca de bateria e chupeta, baterias novas disponíveis'
  },
  {
    id: '5',
    name: 'Combustível Express',
    type: 'combustivel',
    phone: '(11) 99999-5555',
    whatsapp: '11999995555',
    responseTime: '20-35 min',
    price: 'R$ 25 + combustível',
    rating: 4.4,
    available24h: true,
    distance: 4.2,
    description: 'Entrega de combustível no local, gasolina, álcool e diesel'
  }
]

export default function EmergenciaClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [locationShared, setLocationShared] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  
  const { getCurrentPosition } = useGeolocationSearch()
  const { showEmergencyNotification } = useNotifications()

  useEffect(() => {
    checkUser()
    requestLocation()
  }, [])

  async function checkUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/login'
        return
      }
      
      setUser(user)
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)
      
    } catch (error) {
      console.error('❌ Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  async function requestLocation() {
    try {
      const position = await getCurrentPosition()
      if (position) {
        setCurrentLocation(position)
        setLocationShared(true)
      }
    } catch (error) {
      console.error('❌ Erro ao obter localização:', error)
    }
  }

  const handleEmergencyCall = async (service: EmergencyService) => {
    // Notificar sobre a solicitação de emergência
    await showEmergencyNotification(
      `Chamando ${service.name} para emergência automotiva`
    )
    
    // Abrir WhatsApp ou telefone
    if (service.whatsapp) {
      const message = encodeURIComponent(
        `🆘 EMERGÊNCIA AUTOMOTIVA\n\n` +
        `Preciso de ${getServiceName(service.type)} urgente!\n\n` +
        `📍 Localização: ${currentLocation ? `${currentLocation.lat}, ${currentLocation.lng}` : 'Compartilhando...'}\n` +
        `👤 ${profile?.name || user?.email}\n` +
        `📱 Pelo app InstaAuto`
      )
      window.open(`https://wa.me/55${service.whatsapp}?text=${message}`, '_blank')
    } else {
      window.open(`tel:${service.phone}`, '_self')
    }
  }

  const getServiceName = (type: string): string => {
    const types: Record<string, string> = {
      guincho: 'Guincho',
      mecanico: 'Mecânico',
      pneu: 'Troca de Pneu',
      bateria: 'Bateria/Chupeta',
      combustivel: 'Combustível'
    }
    return types[type] || type
  }

  const getServiceIcon = (type: string) => {
    const icons: Record<string, any> = {
      guincho: TruckIcon,
      mecanico: WrenchScrewdriverIcon,
      pneu: '🛞',
      bateria: '🔋',
      combustivel: '⛽'
    }
    const IconComponent = icons[type]
    return typeof IconComponent === 'string' ? IconComponent : <IconComponent className="h-6 w-6" />
  }

  const getUrgencyColor = (responseTime: string): string => {
    if (responseTime.includes('10-') || responseTime.includes('15-')) return 'text-green-600'
    if (responseTime.includes('20-') || responseTime.includes('25-')) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredServices = selectedType === 'all' 
    ? mockEmergencyServices 
    : mockEmergencyServices.filter(service => service.type === selectedType)

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block w-64 h-screen bg-gradient-to-b from-blue-800 to-blue-600"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando emergência...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="motorista"
        userName={profile?.name || user?.email?.split('@')[0] || 'Motorista'}
        userEmail={user?.email}
        onLogout={logout}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-6">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">🚨 Socorro Automotivo</h1>
              <p className="text-red-100">Serviços de emergência 24 horas disponíveis</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              
              {/* Alerta de Localização */}
              {!locationShared && (
                <motion.div
                  className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="h-6 w-6 text-yellow-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800">Compartilhe sua localização</h3>
                      <p className="text-yellow-700 text-sm">Para um atendimento mais rápido, permita acesso à sua localização</p>
                    </div>
                    <button
                      onClick={requestLocation}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Compartilhar
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Status da Localização */}
              {locationShared && (
                <motion.div
                  className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">Localização compartilhada</h3>
                      <p className="text-green-700 text-sm">Os serviços de emergência podem te encontrar</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Filtros por Tipo de Serviço */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tipo de Emergência</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedType === 'all'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  {['guincho', 'mecanico', 'pneu', 'bateria', 'combustivel'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedType === type
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getServiceName(type)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Serviços de Emergência */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {filteredServices.length} serviços disponíveis
                </h2>
                
                {filteredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
                            {getServiceIcon(service.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                            <p className="text-gray-600 text-sm">{getServiceName(service.type)}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {service.available24h && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-1">
                              <ClockIcon className="h-3 w-3" />
                              24h
                            </span>
                          )}
                          <p className="text-sm text-gray-500">{service.distance}km de distância</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4">{service.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm font-medium ${getUrgencyColor(service.responseTime)}`}>
                            {service.responseTime}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">💰 {service.price}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600">{service.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEmergencyCall(service)}
                          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          <PhoneIcon className="h-5 w-5" />
                          Chamar Agora
                        </button>
                        
                        {service.whatsapp && (
                          <button
                            onClick={() => {
                              const message = encodeURIComponent(
                                `Olá! Gostaria de solicitar um orçamento para ${getServiceName(service.type)}.`
                              )
                              window.open(`https://wa.me/55${service.whatsapp}?text=${message}`, '_blank')
                            }}
                            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            💬
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Dicas de Segurança */}
              <motion.div
                className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <ShieldExclamationIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-blue-900">Dicas de Segurança</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div className="space-y-2">
                    <p>• Mantenha-se dentro do veículo se estiver em local seguro</p>
                    <p>• Ligue o pisca-alerta e coloque o triângulo</p>
                    <p>• Confirme sempre a identidade do prestador de serviço</p>
                  </div>
                  <div className="space-y-2">
                    <p>• Tenha sempre seu documento e CNH em mãos</p>
                    <p>• Negocie o preço antes do início do serviço</p>
                    <p>• Em caso de dúvida, ligue para 190</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
