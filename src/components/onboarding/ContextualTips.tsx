'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  LightBulbIcon,
  InformationCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import { usePathname } from 'next/navigation'

interface Tip {
  id: string
  tip_id: string
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  element_selector?: string
  priority: number
}

interface ContextualTipsProps {
  userId: string
  userType: 'motorista' | 'oficina-free' | 'oficina-pro'
  className?: string
}

export default function ContextualTips({ userId, userType, className = '' }: ContextualTipsProps) {
  const [tips, setTips] = useState<Tip[]>([])
  const [activeTip, setActiveTip] = useState<Tip | null>(null)
  const [seenTips, setSeenTips] = useState<Set<string>>(new Set())
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const pathname = usePathname()
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadTips()
    loadSeenTips()
  }, [pathname, userType])

  const loadTips = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_tips')
        .select('*')
        .or(`user_type.eq.${userType},user_type.eq.all`)
        .eq('is_active', true)
        .like('page_path', `%${pathname}%`)
        .order('priority', { ascending: true })

      if (error) {
        console.error('Erro ao carregar tips:', error)
        return
      }

      setTips(data || [])
    } catch (error) {
      console.error('Erro ao carregar tips:', error)
    }
  }

  const loadSeenTips = async () => {
    try {
      const { data, error } = await supabase
        .from('user_tips_seen')
        .select('tip_id')
        .eq('user_id', userId)

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar tips vistos:', error)
        return
      }

      if (data) {
        setSeenTips(new Set(data.map(item => item.tip_id)))
      }
    } catch (error) {
      console.error('Erro ao carregar tips vistos:', error)
    }
  }

  useEffect(() => {
    // Mostrar primeiro tip não visto
    const availableTips = tips.filter(tip => !seenTips.has(tip.tip_id))
    
    if (availableTips.length > 0 && !activeTip) {
      const nextTip = availableTips[0]
      
      // Delay para garantir que a página carregou
      setTimeout(() => {
        showTip(nextTip)
      }, 2000)
    }
  }, [tips, seenTips, activeTip])

  const showTip = (tip: Tip) => {
    if (tip.element_selector) {
      const element = document.querySelector(tip.element_selector)
      if (element) {
        const rect = element.getBoundingClientRect()
        setPosition(calculatePosition(rect, tip.position))
      } else {
        // Elemento não encontrado, mostrar no centro
        setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      }
    } else {
      // Sem seletor, mostrar no centro
      setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    }
    
    setActiveTip(tip)
    markTipAsSeen(tip.tip_id)
  }

  const calculatePosition = (rect: DOMRect, position: string) => {
    const tooltipWidth = 320
    const tooltipHeight = 120
    const offset = 12

    switch (position) {
      case 'top':
        return {
          x: rect.left + rect.width / 2,
          y: rect.top - offset
        }
      case 'bottom':
        return {
          x: rect.left + rect.width / 2,
          y: rect.bottom + offset
        }
      case 'left':
        return {
          x: rect.left - offset,
          y: rect.top + rect.height / 2
        }
      case 'right':
        return {
          x: rect.right + offset,
          y: rect.top + rect.height / 2
        }
      case 'center':
      default:
        return {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        }
    }
  }

  const markTipAsSeen = async (tipId: string) => {
    try {
      const { error } = await supabase
        .from('user_tips_seen')
        .upsert({
          user_id: userId,
          tip_id: tipId,
          seen_at: new Date().toISOString()
        })

      if (error) {
        console.error('Erro ao marcar tip como visto:', error)
        return
      }

      setSeenTips(prev => new Set([...prev, tipId]))
    } catch (error) {
      console.error('Erro ao marcar tip como visto:', error)
    }
  }

  const dismissTip = async () => {
    if (!activeTip) return

    try {
      await supabase
        .from('user_tips_seen')
        .update({ dismissed_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('tip_id', activeTip.tip_id)

      setActiveTip(null)
      
      // Mostrar próximo tip se houver
      setTimeout(() => {
        const remainingTips = tips.filter(tip => 
          !seenTips.has(tip.tip_id) && tip.tip_id !== activeTip.tip_id
        )
        
        if (remainingTips.length > 0) {
          showTip(remainingTips[0])
        }
      }, 1000)
    } catch (error) {
      console.error('Erro ao dispensar tip:', error)
      setActiveTip(null)
    }
  }

  const getTooltipStyle = () => {
    if (!activeTip) return {}

    const tooltipWidth = 320
    const tooltipHeight = 140

    let transformOrigin = 'center center'
    let transform = 'translate(-50%, -50%)'

    switch (activeTip.position) {
      case 'top':
        transform = 'translate(-50%, -100%)'
        transformOrigin = 'center bottom'
        break
      case 'bottom':
        transform = 'translate(-50%, 0%)'
        transformOrigin = 'center top'
        break
      case 'left':
        transform = 'translate(-100%, -50%)'
        transformOrigin = 'right center'
        break
      case 'right':
        transform = 'translate(0%, -50%)'
        transformOrigin = 'left center'
        break
    }

    return {
      position: 'fixed' as const,
      left: position.x,
      top: position.y,
      transform,
      transformOrigin,
      zIndex: 1000
    }
  }

  const getArrowClass = () => {
    if (!activeTip) return ''

    switch (activeTip.position) {
      case 'top':
        return 'border-t-8 border-t-gray-800 border-l-8 border-r-8 border-l-transparent border-r-transparent absolute top-full left-1/2 transform -translate-x-1/2'
      case 'bottom':
        return 'border-b-8 border-b-gray-800 border-l-8 border-r-8 border-l-transparent border-r-transparent absolute bottom-full left-1/2 transform -translate-x-1/2'
      case 'left':
        return 'border-l-8 border-l-gray-800 border-t-8 border-b-8 border-t-transparent border-b-transparent absolute left-full top-1/2 transform -translate-y-1/2'
      case 'right':
        return 'border-r-8 border-r-gray-800 border-t-8 border-b-8 border-t-transparent border-b-transparent absolute right-full top-1/2 transform -translate-y-1/2'
      default:
        return ''
    }
  }

  return (
    <AnimatePresence>
      {activeTip && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissTip}
          />

          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            className="bg-gray-800 text-white rounded-xl shadow-2xl p-4 max-w-sm z-50"
            style={getTooltipStyle()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Arrow */}
            {activeTip.position !== 'center' && (
              <div className={getArrowClass()} />
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-yellow-400 rounded-full">
                  <LightBulbIcon className="w-4 h-4 text-gray-800" />
                </div>
                <h4 className="font-semibold text-sm">{activeTip.title}</h4>
              </div>
              <button
                onClick={dismissTip}
                className="p-1 hover:bg-gray-700 rounded transition-all"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-200 mb-4">
              {activeTip.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={dismissTip}
                className="text-xs text-gray-400 hover:text-gray-200 transition-all"
              >
                Dispensar
              </button>
              <button
                onClick={dismissTip}
                className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-all"
              >
                <CheckIcon className="w-3 h-3" />
                Entendi
              </button>
            </div>
          </motion.div>

          {/* Highlight Element */}
          {activeTip.element_selector && (
            <HighlightElement selector={activeTip.element_selector} />
          )}
        </>
      )}
    </AnimatePresence>
  )
}

function HighlightElement({ selector }: { selector: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const element = document.querySelector(selector)
    if (element) {
      const elementRect = element.getBoundingClientRect()
      setRect(elementRect)
    }
  }, [selector])

  if (!rect) return null

  return (
    <motion.div
      className="fixed border-2 border-yellow-400 rounded-lg pointer-events-none z-30"
      style={{
        left: rect.left - 4,
        top: rect.top - 4,
        width: rect.width + 8,
        height: rect.height + 8
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-yellow-400/20 rounded-lg"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  )
}

// Hook para trigger manual de tips
export function useContextualTips(userId: string) {
  const [tips, setTips] = useState<Tip[]>([])
  const pathname = usePathname()

  const showTipById = async (tipId: string) => {
    try {
      const { data, error } = await supabase
        .from('onboarding_tips')
        .select('*')
        .eq('tip_id', tipId)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        console.error('Tip não encontrado:', tipId)
        return
      }

      // Trigger tip manualmente
      const event = new CustomEvent('show-tip', { detail: data })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('Erro ao mostrar tip:', error)
    }
  }

  const markAllTipsAsSeen = async () => {
    try {
      const { data: allTips } = await supabase
        .from('onboarding_tips')
        .select('tip_id')
        .eq('is_active', true)

      if (allTips) {
        const inserts = allTips.map(tip => ({
          user_id: userId,
          tip_id: tip.tip_id,
          seen_at: new Date().toISOString(),
          dismissed_at: new Date().toISOString()
        }))

        await supabase
          .from('user_tips_seen')
          .upsert(inserts)
      }
    } catch (error) {
      console.error('Erro ao marcar todos os tips:', error)
    }
  }

  return {
    showTipById,
    markAllTipsAsSeen
  }
}
