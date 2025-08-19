'use client'
import { motion } from 'framer-motion'
import { 
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { useOnboarding, useOnboardingTrigger } from './OnboardingManager'

interface OnboardingTriggerProps {
  className?: string
  variant?: 'button' | 'floating' | 'banner'
  showText?: boolean
}

export default function OnboardingTrigger({ 
  className = '', 
  variant = 'button',
  showText = true 
}: OnboardingTriggerProps) {
  const { progress, completedCount, totalSteps } = useOnboarding()
  const { triggerOnboarding, shouldShowOnboarding } = useOnboardingTrigger()

  // Não mostrar se já completou
  if (progress?.isCompleted) {
    return null
  }

  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0

  if (variant === 'floating') {
    return (
      <motion.button
        onClick={triggerOnboarding}
        className={`fixed bottom-32 right-4 z-30 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <AcademicCapIcon className="w-5 h-5" />
        
        {/* Progress indicator */}
        {shouldShowOnboarding() && (
          <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {completedCount}
          </div>
        )}
      </motion.button>
    )
  }

  if (variant === 'banner' && shouldShowOnboarding()) {
    return (
      <motion.div
        className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 ${className}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <AcademicCapIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                🎯 Configure sua conta em poucos passos
              </h3>
              <p className="text-sm text-blue-700">
                {completedCount} de {totalSteps} passos concluídos ({Math.round(progressPercentage)}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress Bar */}
            <div className="w-24 bg-blue-200 rounded-full h-2">
              <motion.div 
                className="bg-blue-600 rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <button
              onClick={triggerOnboarding}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
            >
              <PlayIcon className="w-4 h-4" />
              Continuar
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Variant button (default)
  return (
    <motion.button
      onClick={triggerOnboarding}
      className={`flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <QuestionMarkCircleIcon className="w-4 h-4" />
      {showText && 'Guia de Introdução'}
      
      {shouldShowOnboarding() && (
        <div className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ml-1">
          {totalSteps - completedCount}
        </div>
      )}
    </motion.button>
  )
}

// Component para mostrar progress compacto
export function OnboardingProgress({ className = '' }: { className?: string }) {
  const { progress, completedCount, totalSteps } = useOnboarding()

  if (progress?.isCompleted) {
    return (
      <div className={`flex items-center gap-2 text-green-600 text-sm ${className}`}>
        <AcademicCapIcon className="w-4 h-4" />
        <span>Configuração completa ✅</span>
      </div>
    )
  }

  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <AcademicCapIcon className="w-4 h-4 text-blue-600" />
      <span className="text-gray-600">Progresso:</span>
      <div className="w-16 bg-gray-200 rounded-full h-1.5">
        <motion.div 
          className="bg-blue-600 rounded-full h-1.5"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
        />
      </div>
      <span className="text-blue-600 font-medium">
        {completedCount}/{totalSteps}
      </span>
    </div>
  )
}
