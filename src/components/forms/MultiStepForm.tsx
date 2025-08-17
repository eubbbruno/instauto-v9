'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline'

interface Step {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
  validation?: (data: any) => boolean
  required?: boolean
}

interface MultiStepFormProps {
  steps: Step[]
  onComplete: (data: any) => void
  onSave?: (data: any) => void
  initialData?: any
  className?: string
}

export function MultiStepForm({ 
  steps, 
  onComplete, 
  onSave,
  initialData = {},
  className = '' 
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = useCallback((stepId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data }
    }))
    
    // Auto-save if function provided
    if (onSave) {
      onSave({ ...formData, [stepId]: { ...formData[stepId], ...data } })
    }
  }, [formData, onSave])

  const validateStep = useCallback((stepIndex: number, data: any) => {
    const step = steps[stepIndex]
    if (!step.validation) return true
    
    try {
      return step.validation(data)
    } catch (error) {
      console.error('Validation error:', error)
      return false
    }
  }, [steps])

  const goNext = useCallback(() => {
    const currentStepData = formData[steps[currentStep].id] || {}
    
    if (!validateStep(currentStep, currentStepData)) {
      setErrors(prev => ({
        ...prev,
        [steps[currentStep].id]: ['Por favor, preencha todos os campos obrigatórios']
      }))
      return
    }

    setErrors(prev => ({ ...prev, [steps[currentStep].id]: [] }))
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }, [currentStep, formData, steps, validateStep])

  const goPrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const handleComplete = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await onComplete(formData)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onComplete])

  const isStepCompleted = useCallback((stepIndex: number) => {
    if (stepIndex > currentStep) return false
    if (stepIndex < currentStep) return true
    
    const stepData = formData[steps[stepIndex].id] || {}
    return validateStep(stepIndex, stepData)
  }, [currentStep, formData, steps, validateStep])

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {steps[currentStep].title}
          </h2>
          <span className="text-sm text-gray-500">
            {currentStep + 1} de {steps.length}
          </span>
        </div>
        
        <p className="text-gray-600 mb-6">
          {steps[currentStep].description}
        </p>

        {/* Progress Bar */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold relative z-10 ${
                    isStepCompleted(index)
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isStepCompleted(index) && index < currentStep ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </motion.div>
                
                {index < steps.length - 1 && (
                  <div 
                    className={`h-1 w-20 mx-2 rounded-full ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Animated Progress Bar */}
          <motion.div
            className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 -z-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            
            {/* Step Component */}
            <div className="relative z-10">
              {React.createElement(steps[currentStep].component, {
                data: formData[steps[currentStep].id] || {},
                onChange: (data: any) => updateFormData(steps[currentStep].id, data),
                errors: errors[steps[currentStep].id] || []
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={goPrevious}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-y-0.5 shadow-lg'
          }`}
          whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
          whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Voltar</span>
        </motion.button>

        <div className="flex space-x-4">
          {onSave && (
            <motion.button
              onClick={() => onSave(formData)}
              className="px-6 py-3 rounded-xl font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              💾 Salvar Rascunho
            </motion.button>
          )}

          <motion.button
            onClick={goNext}
            disabled={isSubmitting}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all ${
              currentStep === steps.length - 1
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            } hover:-translate-y-0.5 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processando...</span>
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                <CheckIcon className="w-5 h-5" />
                <span>Finalizar Cadastro</span>
              </>
            ) : (
              <>
                <span>Próximo</span>
                <ChevronRightIcon className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
