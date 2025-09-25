'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

// Variações de animações de página
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Transição para Cards
interface CardTransitionProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export const CardTransition: React.FC<CardTransitionProps> = ({ 
  children, 
  delay = 0,
  className = '' 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.5, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Transição para listas (staggered)
interface ListTransitionProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export const ListTransition: React.FC<ListTransitionProps> = ({ 
  children, 
  staggerDelay = 0.1,
  className = '' 
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Item para usar dentro do ListTransition
export const ListItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
)

// Transição para Modal/Dialog
interface ModalTransitionProps {
  children: React.ReactNode
  isOpen: boolean
  onClose?: () => void
  className?: string
}

export const ModalTransition: React.FC<ModalTransitionProps> = ({ 
  children, 
  isOpen, 
  onClose,
  className = '' 
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
        >
          <div onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
)

// Transição para botões (hover/tap)
interface ButtonTransitionProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'scale' | 'lift' | 'glow'
}

export const ButtonTransition: React.FC<ButtonTransitionProps> = ({ 
  children, 
  className = '',
  onClick,
  disabled = false,
  variant = 'scale'
}) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'lift':
        return {
          whileHover: { y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
          whileTap: { y: 0, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }
        }
      case 'glow':
        return {
          whileHover: { 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            borderColor: "rgb(59 130 246)"
          },
          whileTap: { scale: 0.98 }
        }
      case 'scale':
      default:
        return {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 }
        }
    }
  }

  return (
    <motion.button
      {...getVariantProps()}
      transition={{ duration: 0.2 }}
      className={`transition-colors ${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}

// Loading Spinner com animação
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <svg className="animate-spin h-full w-full text-current" fill="none" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )
}

// Fade In quando elemento entra na viewport
interface FadeInViewProps {
  children: React.ReactNode
  className?: string
  threshold?: number
}

export const FadeInView: React.FC<FadeInViewProps> = ({ 
  children, 
  className = '',
  threshold = 0.1 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: threshold }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
)
