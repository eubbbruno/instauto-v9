'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon } from '@heroicons/react/24/outline'

interface BasicDataStepProps {
  data: {
    email?: string
    password?: string
    name?: string
    cpf?: string
    phone?: string
    userType?: 'motorista' | 'oficina'
  }
  onChange: (data: any) => void
  errors: string[]
}

export function BasicDataStep({ data, onChange, errors }: BasicDataStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [validations, setValidations] = useState<Record<string, boolean>>({})

  const validateField = (field: string, value: string) => {
    let isValid = false
    
    switch (field) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        break
      case 'password':
        isValid = value.length >= 6
        break
      case 'name':
        isValid = value.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(value)
        break
      case 'cpf':
        isValid = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value) || /^\d{11}$/.test(value.replace(/\D/g, ''))
        break
      case 'phone':
        isValid = /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value) || /^\d{10,11}$/.test(value.replace(/\D/g, ''))
        break
      default:
        isValid = value.trim().length > 0
    }

    setValidations(prev => ({ ...prev, [field]: isValid }))
    return isValid
  }

  const handleChange = (field: string, value: string) => {
    let formattedValue = value

    // Auto-format fields
    if (field === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (field === 'phone') {
      formattedValue = formatPhone(value)
    } else if (field === 'name') {
      formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
    }

    validateField(field, formattedValue)
    onChange({ [field]: formattedValue })
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value.slice(0, 14)
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      if (numbers.length === 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      } else if (numbers.length === 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
      }
    }
    return value.slice(0, 15)
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'email': return EnvelopeIcon
      case 'name': return UserIcon
      case 'cpf': return IdentificationIcon
      case 'phone': return PhoneIcon
      default: return UserIcon
    }
  }

  const getFieldEmoji = (field: string) => {
    switch (field) {
      case 'email': return '📧'
      case 'password': return '🔒'
      case 'name': return '👤'
      case 'cpf': return '🆔'
      case 'phone': return '📱'
      default: return '📝'
    }
  }

  const fields = [
    { key: 'name', label: 'Nome Completo', placeholder: 'Seu nome completo', required: true },
    { key: 'email', label: 'Email', placeholder: 'seu@email.com', required: true, type: 'email' },
    { key: 'password', label: 'Senha', placeholder: 'Mínimo 6 caracteres', required: true, type: 'password' },
    { key: 'cpf', label: 'CPF', placeholder: '000.000.000-00', required: true },
    { key: 'phone', label: 'WhatsApp/Telefone', placeholder: '(11) 99999-9999', required: true, type: 'tel' }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UserIcon className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Seus Dados Pessoais</h3>
        <p className="text-gray-600">Precisamos dessas informações para criar sua conta com segurança</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field, index) => {
          const Icon = getFieldIcon(field.key)
          const isValid = validations[field.key]
          const hasValue = data[field.key as keyof typeof data]
          const showValidation = hasValue && isValid !== undefined

          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={field.key === 'name' ? 'md:col-span-2' : ''}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {getFieldEmoji(field.key)} {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Icon className={`w-5 h-5 transition-colors ${
                    showValidation 
                      ? isValid 
                        ? 'text-green-500' 
                        : 'text-red-500'
                      : 'text-gray-400'
                  }`} />
                </div>

                <input
                  type={field.type || 'text'}
                  value={data[field.key as keyof typeof data] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none ${
                    showValidation
                      ? isValid
                        ? 'border-green-400 focus:ring-2 focus:ring-green-500'
                        : 'border-red-400 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-400'
                  }`}
                  required={field.required}
                />

                {/* Password Toggle */}
                {field.key === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                )}

                {/* Validation Icon */}
                {showValidation && field.key !== 'password' && (
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

              {/* Field Hints */}
              {field.key === 'password' && (
                <p className="text-xs text-gray-500 mt-2">
                  Use uma senha forte com pelo menos 6 caracteres
                </p>
              )}
              {field.key === 'cpf' && (
                <p className="text-xs text-gray-500 mt-2">
                  Apenas números, formatação automática
                </p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-blue-50 rounded-xl p-4 text-center"
      >
        <p className="text-blue-700 text-sm">
          <span className="font-semibold">Dica:</span> Seus dados estão seguros e criptografados 🔒
        </p>
      </motion.div>
    </div>
  )
}
