'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  ClockIcon, 
  SparklesIcon, 
  CreditCardIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface TrialBannerProps {
  userId: string
  className?: string
}

interface TrialInfo {
  isTrialActive: boolean
  daysRemaining: number
  trialEndsAt: string | null
  planType: string
}

export default function TrialBanner({ userId, className = '' }: TrialBannerProps) {
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    checkTrialStatus()
  }, [userId])

  const checkTrialStatus = async () => {
    try {
      const { data: workshop } = await supabase
        .from('workshops')
        .select('plan_type, is_trial, trial_ends_at')
        .eq('profile_id', userId)
        .single()

      if (workshop && workshop.is_trial && workshop.trial_ends_at) {
        const trialEndDate = new Date(workshop.trial_ends_at)
        const now = new Date()
        const isTrialActive = trialEndDate > now
        const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        setTrialInfo({
          isTrialActive,
          daysRemaining: Math.max(0, daysRemaining),
          trialEndsAt: workshop.trial_ends_at,
          planType: workshop.plan_type
        })
      }
    } catch (error) {
      console.error('Erro ao verificar status do trial:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !trialInfo || dismissed) {
    return null
  }

  const { isTrialActive, daysRemaining, planType } = trialInfo

  // Se trial expirou
  if (!isTrialActive) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg ${className}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Trial Expirado</h3>
                <p className="text-red-100">
                  Seu trial PRO expirou. Faça upgrade para continuar usando recursos avançados.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/upgrade"
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Fazer Upgrade
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Se trial ativo
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl shadow-lg ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Trial PRO Ativo</h3>
              <p className="text-blue-100">
                {daysRemaining > 0 
                  ? `${daysRemaining} ${daysRemaining === 1 ? 'dia restante' : 'dias restantes'} do seu trial gratuito`
                  : 'Último dia do seu trial gratuito'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {daysRemaining <= 2 && (
              <Link
                href="/upgrade"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <CreditCardIcon className="h-4 w-4" />
                <span>Continuar PRO</span>
              </Link>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="mt-3">
          <div className="bg-white/20 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, (daysRemaining / 7) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white rounded-full h-2"
            />
          </div>
          <div className="flex justify-between text-xs text-blue-100 mt-1">
            <span>Trial iniciado</span>
            <span>{daysRemaining} dias restantes</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
