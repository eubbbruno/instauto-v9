'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPinIcon, HomeIcon, HashtagIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

interface AddressStepProps {
  data: {
    cep?: string
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
  }
  onChange: (data: any) => void
  errors: string[]
}

export function AddressStep({ data, onChange, errors }: AddressStepProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepError, setCepError] = useState('')
  const [validations, setValidations] = useState<Record<string, boolean>>({})

  const validateField = (field: string, value: string) => {
    let isValid = false
    
    switch (field) {
      case 'cep':
        isValid = /^\d{5}-\d{3}$/.test(value) || /^\d{8}$/.test(value.replace(/\D/g, ''))
        break
      case 'street':
      case 'neighborhood':
      case 'city':
        isValid = value.trim().length >= 2
        break
      case 'number':
        isValid = value.trim().length >= 1
        break
      case 'state':
        isValid = value.length === 2
        break
      default:
        isValid = true // complement is optional
    }

    setValidations(prev => ({ ...prev, [field]: isValid }))
    return isValid
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
    }
    return value.slice(0, 9)
  }

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) return

    setIsLoadingCep(true)
    setCepError('')

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const addressData = await response.json()

      if (addressData.erro) {
        setCepError('CEP não encontrado')
        return
      }

      onChange({
        street: addressData.logradouro || '',
        neighborhood: addressData.bairro || '',
        city: addressData.localidade || '',
        state: addressData.uf || ''
      })

      // Validate auto-filled fields
      validateField('street', addressData.logradouro || '')
      validateField('neighborhood', addressData.bairro || '')
      validateField('city', addressData.localidade || '')
      validateField('state', addressData.uf || '')

    } catch (error) {
      setCepError('Erro ao buscar CEP')
      console.error('CEP fetch error:', error)
    } finally {
      setIsLoadingCep(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === 'cep') {
      formattedValue = formatCEP(value)
      setCepError('')
    } else if (field === 'state') {
      formattedValue = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2)
    } else if (field === 'number') {
      formattedValue = value.replace(/[^0-9A-Za-z\s]/g, '')
    }

    validateField(field, formattedValue)
    onChange({ [field]: formattedValue })

    // Auto-fetch address when CEP is complete
    if (field === 'cep' && formattedValue.replace(/\D/g, '').length === 8) {
      fetchAddressByCEP(formattedValue)
    }
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'cep': return MapPinIcon
      case 'street': return HomeIcon
      case 'number': return HashtagIcon
      case 'complement': return BuildingOfficeIcon
      default: return HomeIcon
    }
  }

  const getFieldEmoji = (field: string) => {
    switch (field) {
      case 'cep': return '📮'
      case 'street': return '🏠'
      case 'number': return '🔢'
      case 'complement': return '🏢'
      case 'neighborhood': return '🏘️'
      case 'city': return '🌆'
      case 'state': return '🗺️'
      default: return '📍'
    }
  }

  const brazilianStates = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
  ]

  const fields = [
    { key: 'cep', label: 'CEP', placeholder: '00000-000', required: true, span: 1 },
    { key: 'street', label: 'Rua/Avenida', placeholder: 'Nome da rua', required: true, span: 2 },
    { key: 'number', label: 'Número', placeholder: '123', required: true, span: 1 },
    { key: 'complement', label: 'Complemento', placeholder: 'Apt, Bloco, etc', required: false, span: 1 },
    { key: 'neighborhood', label: 'Bairro', placeholder: 'Nome do bairro', required: true, span: 1 },
    { key: 'city', label: 'Cidade', placeholder: 'Nome da cidade', required: true, span: 1 },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <MapPinIcon className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Seu Endereço</h3>
        <p className="text-gray-600">Informe seu endereço para localizar oficinas próximas</p>
      </div>

      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="text-red-600 text-sm">
            {errors.map((error, index) => (
              <p key={index}>• {error}</p>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map((field, index) => {
          const Icon = getFieldIcon(field.key)
          const isValid = validations[field.key]
          const hasValue = data[field.key as keyof typeof data]
          const showValidation = hasValue && isValid !== undefined
          const isDisabled = isLoadingCep && ['street', 'neighborhood', 'city'].includes(field.key)

          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`md:col-span-${field.span}`}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {getFieldEmoji(field.key)} {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  {field.key === 'cep' && isLoadingCep ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  ) : (
                    <Icon className={`w-5 h-5 transition-colors ${
                      showValidation 
                        ? isValid 
                          ? 'text-green-500' 
                          : 'text-red-500'
                        : 'text-gray-400'
                    }`} />
                  )}
                </div>

                <input
                  type="text"
                  value={data[field.key as keyof typeof data] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    showValidation
                      ? isValid
                        ? 'border-green-400 focus:ring-2 focus:ring-green-500'
                        : 'border-red-400 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-400'
                  }`}
                  required={field.required}
                />

                {/* Validation Icon */}
                {showValidation && !isLoadingCep && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isValid ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* CEP Error */}
              {field.key === 'cep' && cepError && (
                <p className="text-red-500 text-xs mt-2">{cepError}</p>
              )}

              {/* Field Hints */}
              {field.key === 'cep' && (
                <p className="text-xs text-gray-500 mt-2">
                  Digite o CEP para preenchimento automático
                </p>
              )}
            </motion.div>
          )
        })}

        {/* State Select */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="md:col-span-1"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🗺️ Estado <span className="text-red-500 ml-1">*</span>
          </label>
          
          <div className="relative">
            <select
              value={data.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full pl-4 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none"
              required
            >
              <option value="">Selecione o estado</option>
              {brazilianStates.map(state => (
                <option key={state.code} value={state.code}>
                  {state.code} - {state.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Auto-complete Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-green-50 rounded-xl p-4 text-center"
      >
        <p className="text-green-700 text-sm">
          <span className="font-semibold">Dica:</span> Digite o CEP para preenchimento automático do endereço 🏠
        </p>
      </motion.div>
    </div>
  )
}
