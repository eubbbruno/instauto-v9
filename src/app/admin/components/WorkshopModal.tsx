'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import {
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Workshop {
  id?: string
  business_name: string
  address: {
    rua: string
    numero?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
    lat?: number
    lng?: number
  }
  phone?: string
  email?: string
  description?: string
  services: string[]
  specialties: string[]
  rating: number
  total_reviews: number
  verified: boolean
  plan_type: 'free' | 'pro'
  is_trial: boolean
  trial_ends_at?: string
  opening_hours?: {
    [key: string]: string
  }
  price_range?: '$' | '$$' | '$$$'
  website?: string
  whatsapp?: string
  created_at?: string
  updated_at?: string
}

interface WorkshopModalProps {
  workshop: Workshop | null
  mode: 'view' | 'edit' | 'create'
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

const DEFAULT_WORKSHOP: Partial<Workshop> = {
  business_name: '',
  address: {
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    cep: ''
  },
  phone: '',
  email: '',
  description: '',
  services: [],
  specialties: [],
  rating: 0,
  total_reviews: 0,
  verified: false,
  plan_type: 'free',
  is_trial: false,
  opening_hours: {
    segunda: '08:00 - 18:00',
    terca: '08:00 - 18:00',
    quarta: '08:00 - 18:00',
    quinta: '08:00 - 18:00',
    sexta: '08:00 - 18:00',
    sabado: '08:00 - 14:00',
    domingo: 'Fechado'
  },
  price_range: '$$'
}

const AVAILABLE_SERVICES = [
  'Mecânica Geral',
  'Elétrica Automotiva',
  'Troca de Óleo',
  'Alinhamento e Balanceamento',
  'Sistema de Freios',
  'Suspensão',
  'Motor',
  'Câmbio',
  'Ar Condicionado',
  'Injeção Eletrônica',
  'Diagnóstico Computadorizado',
  'Revisão Preventiva',
  'Funilaria',
  'Pintura',
  'Instalação de Som',
  'Insulfilm',
  'Lavagem e Enceramento'
]

const AVAILABLE_SPECIALTIES = [
  'Volkswagen',
  'Fiat',
  'Ford',
  'Chevrolet',
  'Honda',
  'Toyota',
  'Hyundai',
  'Nissan',
  'Renault',
  'Peugeot',
  'Citroën',
  'BMW',
  'Audi',
  'Mercedes-Benz',
  'Volvo',
  'Scania',
  'Iveco',
  'Motocicletas',
  'Caminhões',
  'Veículos Pesados'
]

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export default function WorkshopModal({
  workshop,
  mode,
  isOpen,
  onClose,
  onSave
}: WorkshopModalProps) {
  const [formData, setFormData] = useState<Workshop>(DEFAULT_WORKSHOP as Workshop)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (workshop) {
      setFormData(workshop)
    } else {
      setFormData(DEFAULT_WORKSHOP as Workshop)
    }
  }, [workshop])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Nome da oficina é obrigatório'
    }

    if (!formData.address?.rua.trim()) {
      newErrors.rua = 'Endereço é obrigatório'
    }

    if (!formData.address?.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória'
    }

    if (!formData.address?.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Selecione pelo menos um serviço'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const workshopData = {
        ...formData,
        updated_at: new Date().toISOString()
      }

      if (mode === 'create') {
        // Primeiro criar um profile para a oficina
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email || `oficina_${Date.now()}@temp.com`,
          password: 'TempPassword123!',
          options: {
            data: { user_type: 'workshop_owner' }
          }
        })

        if (authError) throw authError

        if (authData.user) {
          // Criar profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: formData.email,
              name: formData.business_name,
              type: 'workshop_owner',
              created_at: new Date().toISOString()
            })

          if (profileError) throw profileError

          // Criar workshop
          const { error: workshopError } = await supabase
            .from('workshops')
            .insert({
              ...workshopData,
              id: authData.user.id,
              profile_id: authData.user.id,
              created_at: new Date().toISOString()
            })

          if (workshopError) throw workshopError
        }
      } else {
        // Atualizar workshop existente
        const { error } = await supabase
          .from('workshops')
          .update(workshopData)
          .eq('id', formData.id)

        if (error) throw error
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Erro ao salvar oficina:', error)
      alert('Erro ao salvar oficina: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceToggle = (service: string) => {
    const newServices = formData.services.includes(service)
      ? formData.services.filter(s => s !== service)
      : [...formData.services, service]
    
    setFormData({ ...formData, services: newServices })
  }

  const handleSpecialtyToggle = (specialty: string) => {
    const newSpecialties = formData.specialties.includes(specialty)
      ? formData.specialties.filter(s => s !== specialty)
      : [...formData.specialties, specialty]
    
    setFormData({ ...formData, specialties: newSpecialties })
  }

  const isReadOnly = mode === 'view'

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' && 'Nova Oficina'}
              {mode === 'edit' && 'Editar Oficina'}
              {mode === 'view' && 'Detalhes da Oficina'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Oficina *
                    </label>
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                    {errors.business_name && (
                      <p className="text-sm text-red-600 mt-1">{errors.business_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isReadOnly}
                        placeholder="(11) 99999-9999"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp || ''}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      disabled={isReadOnly}
                      placeholder="(11) 99999-9999"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      disabled={isReadOnly}
                      placeholder="https://www.oficina.com.br"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      disabled={isReadOnly}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      placeholder="Descrição da oficina..."
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Endereço
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua/Avenida *
                    </label>
                    <input
                      type="text"
                      value={formData.address?.rua || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, rua: e.target.value }
                      })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                    {errors.rua && (
                      <p className="text-sm text-red-600 mt-1">{errors.rua}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      value={formData.address?.numero || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, numero: e.target.value }
                      })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={formData.address?.bairro || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, bairro: e.target.value }
                      })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={formData.address?.cidade || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, cidade: e.target.value }
                      })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                    {errors.cidade && (
                      <p className="text-sm text-red-600 mt-1">{errors.cidade}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={formData.address?.estado || 'SP'}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, estado: e.target.value }
                      })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      {ESTADOS.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={formData.address?.cep || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, cep: e.target.value }
                      })}
                      disabled={isReadOnly}
                      placeholder="00000-000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                    {errors.cep && (
                      <p className="text-sm text-red-600 mt-1">{errors.cep}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Configurações e Serviços */}
            <div className="space-y-6">
              {/* Status e Plano */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status e Plano</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plano
                    </label>
                    <select
                      value={formData.plan_type}
                      onChange={(e) => setFormData({ ...formData, plan_type: e.target.value as 'free' | 'pro' })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="free">FREE</option>
                      <option value="pro">PRO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Faixa de Preço
                    </label>
                    <select
                      value={formData.price_range || '$$'}
                      onChange={(e) => setFormData({ ...formData, price_range: e.target.value as '$' | '$$' | '$$$' })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="$">$ (Econômico)</option>
                      <option value="$$">$$ (Moderado)</option>
                      <option value="$$$">$$$ (Premium)</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                      disabled={isReadOnly}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                      <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                      Verificada
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_trial}
                      onChange={(e) => setFormData({ ...formData, is_trial: e.target.checked })}
                      disabled={isReadOnly}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                      <ClockIcon className="h-4 w-4 text-purple-500" />
                      Em Trial
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avaliação
                    </label>
                    <div className="flex items-center gap-2">
                      <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                        disabled={isReadOnly}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de Avaliações
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.total_reviews}
                      onChange={(e) => setFormData({ ...formData, total_reviews: parseInt(e.target.value) || 0 })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Serviços */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <WrenchScrewdriverIcon className="h-5 w-5" />
                  Serviços *
                </h3>
                
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {AVAILABLE_SERVICES.map(service => (
                    <label key={service} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        disabled={isReadOnly}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      {service}
                    </label>
                  ))}
                </div>
                {errors.services && (
                  <p className="text-sm text-red-600 mt-1">{errors.services}</p>
                )}
              </div>

              {/* Especialidades */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Especialidades</h3>
                
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {AVAILABLE_SPECIALTIES.map(specialty => (
                    <label key={specialty} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyToggle(specialty)}
                        disabled={isReadOnly}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      {specialty}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {mode === 'view' ? 'Fechar' : 'Cancelar'}
            </button>
            
            {mode !== 'view' && (
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
