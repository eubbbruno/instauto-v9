'use client'
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  XMarkIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  TrophyIcon,
  LightBulbIcon,
  HandRaisedIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { supabase } from '@/lib/supabase'

interface OnboardingStep {
  id: string
  title: string
  description: string
  component?: ReactNode
  action?: () => void | Promise<void>
  isCompleted?: boolean
  isOptional?: boolean
  icon: any
  category: 'essential' | 'recommended' | 'optional'
  estimatedTime: string
}

interface OnboardingProgress {
  userId: string
  userType: 'motorista' | 'oficina-free' | 'oficina-pro'
  currentStep: number
  completedSteps: string[]
  startedAt: Date
  completedAt?: Date
  isCompleted: boolean
  skipOptional: boolean
}

interface OnboardingContextType {
  progress: OnboardingProgress | null
  steps: OnboardingStep[]
  currentStepIndex: number
  isActive: boolean
  totalSteps: number
  completedCount: number
  nextStep: () => void
  previousStep: () => void
  completeStep: (stepId: string) => void
  skipStep: (stepId: string) => void
  startOnboarding: () => void
  finishOnboarding: () => void
  setActive: (active: boolean) => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}

interface OnboardingProviderProps {
  children: ReactNode
  userType: 'motorista' | 'oficina-free' | 'oficina-pro'
  userId: string
}

export function OnboardingProvider({ children, userType, userId }: OnboardingProviderProps) {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)

  // Definir steps baseado no tipo de usuário
  const getStepsForUserType = (type: 'motorista' | 'oficina-free' | 'oficina-pro'): OnboardingStep[] => {
    if (type === 'motorista') {
      return [
        {
          id: 'welcome-motorista',
          title: '🚗 Bem-vindo ao InstaAuto!',
          description: 'Descubra como encontrar as melhores oficinas da sua região',
          icon: HandRaisedIcon,
          category: 'essential',
          estimatedTime: '1 min'
        },
        {
          id: 'add-vehicle',
          title: '🚙 Adicione seu Primeiro Veículo',
          description: 'Cadastre seu carro para receber serviços personalizados',
          icon: RocketLaunchIcon,
          category: 'essential',
          estimatedTime: '2 min'
        },
        {
          id: 'search-workshops',
          title: '🔍 Encontre Oficinas Próximas',
          description: 'Use nosso sistema de busca avançado com IA',
          icon: EyeIcon,
          category: 'essential',
          estimatedTime: '2 min'
        },
        {
          id: 'enable-notifications',
          title: '🔔 Ative as Notificações',
          description: 'Receba atualizações sobre seus agendamentos',
          icon: LightBulbIcon,
          category: 'recommended',
          estimatedTime: '30s'
        },
        {
          id: 'explore-features',
          title: '⭐ Explore Recursos Premium',
          description: 'Descubra ferramentas exclusivas para motoristas',
          icon: StarIcon,
          category: 'optional',
          estimatedTime: '3 min'
        }
      ]
    } else {
      // Oficinas (FREE/PRO)
      return [
        {
          id: 'welcome-workshop',
          title: '🔧 Bem-vindo, Oficina!',
          description: 'Configure sua oficina para receber mais clientes',
          icon: HandRaisedIcon,
          category: 'essential',
          estimatedTime: '1 min'
        },
        {
          id: 'complete-profile',
          title: '📋 Complete seu Perfil',
          description: 'Adicione informações, serviços e fotos da oficina',
          icon: AcademicCapIcon,
          category: 'essential',
          estimatedTime: '5 min'
        },
        {
          id: 'setup-services',
          title: '🛠️ Configure seus Serviços',
          description: 'Defina os serviços que você oferece e preços',
          icon: RocketLaunchIcon,
          category: 'essential',
          estimatedTime: '3 min'
        },
        {
          id: 'test-ai-diagnostic',
          title: '🤖 Teste a IA Diagnóstico',
          description: 'Experimente nosso sistema exclusivo de diagnóstico IA',
          icon: StarSolid,
          category: 'recommended',
          estimatedTime: '2 min'
        },
        {
          id: 'enable-notifications',
          title: '🔔 Ative as Notificações',
          description: 'Receba alertas de novos agendamentos',
          icon: LightBulbIcon,
          category: 'recommended',
          estimatedTime: '30s'
        },
        ...(type === 'oficina-pro' ? [{
          id: 'explore-pro-features',
          title: '⭐ Recursos PRO Exclusivos',
          description: 'Descubra analytics avançados e ferramentas premium',
          icon: TrophyIcon,
          category: 'optional',
          estimatedTime: '3 min'
        }] : [])
      ]
    }
  }

  const steps = getStepsForUserType(userType)

  // Verificar localStorage para controlar popup de boas-vindas
  useEffect(() => {
    const storageKey = `onboarding-welcome-${userType}-${userId}`
    const hasShown = localStorage.getItem(storageKey) === 'true'
    setHasShownWelcome(hasShown)
  }, [userId, userType])

  useEffect(() => {
    if (userId && !hasShownWelcome) {
      loadProgress()
    }
  }, [userId, userType, hasShownWelcome])

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found is OK
        console.error('Erro ao carregar progresso:', error)
        return
      }

      if (data) {
        setProgress({
          userId: data.user_id,
          userType: data.user_type,
          currentStep: data.current_step || 0,
          completedSteps: data.completed_steps || [],
          startedAt: new Date(data.started_at),
          completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
          isCompleted: data.is_completed || false,
          skipOptional: data.skip_optional || false
        })
        setCurrentStepIndex(data.current_step || 0)

        // Auto-start se não completou
        if (!data.is_completed && (data.completed_steps?.length || 0) < 2) {
          setIsActive(true)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar onboarding:', error)
    }
  }

  const saveProgress = async (newProgress: Partial<OnboardingProgress>) => {
    try {
      const progressData = {
        user_id: userId,
        user_type: userType,
        current_step: newProgress.currentStep ?? currentStepIndex,
        completed_steps: newProgress.completedSteps ?? progress?.completedSteps ?? [],
        started_at: newProgress.startedAt ?? progress?.startedAt ?? new Date(),
        completed_at: newProgress.completedAt,
        is_completed: newProgress.isCompleted ?? false,
        skip_optional: newProgress.skipOptional ?? false,
        updated_at: new Date()
      }

      const { error } = await supabase
        .from('onboarding_progress')
        .upsert(progressData)

      if (error) {
        console.error('Erro ao salvar progresso:', error)
      }
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error)
    }
  }

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const newIndex = currentStepIndex + 1
      setCurrentStepIndex(newIndex)
      
      const newProgress = { ...progress, currentStep: newIndex }
      setProgress(newProgress as OnboardingProgress)
      saveProgress(newProgress)
    }
  }

  const previousStep = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1
      setCurrentStepIndex(newIndex)
      
      const newProgress = { ...progress, currentStep: newIndex }
      setProgress(newProgress as OnboardingProgress)
      saveProgress(newProgress)
    }
  }

  const completeStep = (stepId: string) => {
    const completedSteps = [...(progress?.completedSteps || []), stepId]
    const newProgress = {
      ...progress,
      completedSteps,
      isCompleted: completedSteps.length >= steps.filter(s => s.category === 'essential').length
    }
    
    setProgress(newProgress as OnboardingProgress)
    saveProgress(newProgress)

    // Auto avançar para próximo step
    if (currentStepIndex < steps.length - 1) {
      setTimeout(nextStep, 500)
    } else {
      // Último step - finalizar
      setTimeout(finishOnboarding, 1000)
    }
  }

  const skipStep = (stepId: string) => {
    nextStep()
  }

  const startOnboarding = () => {
    const newProgress: OnboardingProgress = {
      userId,
      userType,
      currentStep: 0,
      completedSteps: [],
      startedAt: new Date(),
      isCompleted: false,
      skipOptional: false
    }
    
    setProgress(newProgress)
    setCurrentStepIndex(0)
    setIsActive(true)
    saveProgress(newProgress)
  }

  const finishOnboarding = () => {
    const newProgress = {
      ...progress,
      isCompleted: true,
      completedAt: new Date()
    }
    
    setProgress(newProgress as OnboardingProgress)
    setIsActive(false)
    
    // Salvar no localStorage para não mostrar novamente
    const storageKey = `onboarding-welcome-${userType}-${userId}`
    localStorage.setItem(storageKey, 'true')
    setHasShownWelcome(true)
    
    saveProgress(newProgress)
  }

  const completedCount = progress?.completedSteps.length || 0
  const totalSteps = steps.length

  const value: OnboardingContextType = {
    progress,
    steps,
    currentStepIndex,
    isActive,
    totalSteps,
    completedCount,
    nextStep,
    previousStep,
    completeStep,
    skipStep,
    startOnboarding,
    finishOnboarding,
    setActive: setIsActive
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      {isActive && !hasShownWelcome && <OnboardingOverlay />}
    </OnboardingContext.Provider>
  )
}

function OnboardingOverlay() {
  const {
    steps,
    currentStepIndex,
    completedCount,
    totalSteps,
    nextStep,
    previousStep,
    completeStep,
    skipStep,
    finishOnboarding,
    setActive
  } = useOnboarding()

  const currentStep = steps[currentStepIndex]
  const progress = (completedCount / totalSteps) * 100

  if (!currentStep) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Guia de Introdução</h2>
                <p className="text-blue-100 text-sm">
                  Passo {currentStepIndex + 1} de {totalSteps}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActive(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-2">
              <motion.div 
                className="bg-white rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-xl ${
                currentStep.category === 'essential' ? 'bg-red-100 text-red-600' :
                currentStep.category === 'recommended' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                <currentStep.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {currentStep.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {currentStep.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {currentStep.estimatedTime}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    currentStep.category === 'essential' ? 'bg-red-100 text-red-700' :
                    currentStep.category === 'recommended' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {currentStep.category === 'essential' ? 'Essencial' :
                     currentStep.category === 'recommended' ? 'Recomendado' : 'Opcional'}
                  </div>
                </div>
              </div>
            </div>

            {/* Step specific content */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              {getStepContent(currentStep)}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex items-center justify-between">
          <button
            onClick={previousStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex gap-3">
            {currentStep.category !== 'essential' && (
              <button
                onClick={() => skipStep(currentStep.id)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all"
              >
                Pular
              </button>
            )}
            
            <button
              onClick={() => completeStep(currentStep.id)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              {currentStepIndex === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getStepContent(step: OnboardingStep) {
  switch (step.id) {
    case 'welcome-motorista':
      return (
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚗
          </motion.div>
          <h4 className="font-semibold mb-2">Encontre oficinas confiáveis!</h4>
          <p className="text-sm text-gray-600">
            Use nossa IA para encontrar as melhores oficinas da sua região com diagnósticos precisos.
          </p>
        </div>
      )

    case 'add-vehicle':
      return (
        <div>
          <h4 className="font-semibold mb-3">📝 Como adicionar seu veículo:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              Vá para "Minha Garagem"
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              Clique em "Adicionar Veículo"
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              Preencha os dados e adicione uma foto
            </div>
          </div>
        </div>
      )

    case 'welcome-workshop':
      return (
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔧
          </motion.div>
          <h4 className="font-semibold mb-2">Aumente seus clientes!</h4>
          <p className="text-sm text-gray-600">
            Configure sua oficina para aparecer nas buscas e receber mais agendamentos.
          </p>
        </div>
      )

    case 'test-ai-diagnostic':
      return (
        <div>
          <h4 className="font-semibold mb-3">🤖 IA Diagnóstico - Seu diferencial!</h4>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              Teste agora: "Meu carro faz um barulho estranho ao frear"
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-600">
              <StarSolid className="w-4 h-4" />
              IA gerará diagnóstico + orçamento automaticamente!
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="text-center">
          <PlayIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            Clique em "Próximo" para continuar
          </p>
        </div>
      )
  }
}

// Hook para controlar onboarding em qualquer componente
export function useOnboardingTrigger() {
  const { startOnboarding, setActive, progress } = useOnboarding()

  const triggerOnboarding = () => {
    if (!progress?.isCompleted) {
      setActive(true)
    }
  }

  const shouldShowOnboarding = () => {
    return !progress?.isCompleted && (progress?.completedSteps.length || 0) < 3
  }

  return {
    triggerOnboarding,
    shouldShowOnboarding,
    startOnboarding
  }
}
