'use client'
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

// Hook para efeito de hover suave
export const useHoverScale = (scale = 1.05) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return {
    scale: isHovered ? scale : 1,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  }
}

// Hook para efeito de clique suave
export const useClickAnimation = () => {
  const [isClicked, setIsClicked] = useState(false)
  
  const handleClick = (callback?: () => void) => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 150)
    if (callback) callback()
  }
  
  return {
    scale: isClicked ? 0.95 : 1,
    onClick: handleClick,
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  }
}

// Componente de botão com micro-interações
interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}

export const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}: AnimatedButtonProps) => {
  const hoverProps = useHoverScale(1.02)
  const clickProps = useClickAnimation()
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <motion.button
      {...hoverProps}
      {...clickProps}
      onClick={() => clickProps.onClick(onClick)}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-lg font-medium shadow-sm
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
        ${className}
      `}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-inherit"
          >
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.span
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  )
}

// Componente de card com hover elegante
interface AnimatedCardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  hover?: boolean
}

export const AnimatedCard = ({ 
  children, 
  onClick, 
  className = '',
  hover = true 
}: AnimatedCardProps) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5])
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hover || !cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    mouseX.set((e.clientX - centerX) / rect.width)
    mouseY.set((e.clientY - centerY) / rect.height)
  }
  
  const handleMouseLeave = () => {
    if (!hover) return
    mouseX.set(0)
    mouseY.set(0)
  }
  
  return (
    <motion.div
      ref={cardRef}
      style={{ 
        rotateX: hover ? rotateX : 0, 
        rotateY: hover ? rotateY : 0,
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ 
        scale: hover ? 1.02 : 1,
        boxShadow: hover ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : undefined
      }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-lg border border-gray-100
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// Input com animações suaves
interface AnimatedInputProps {
  label?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: React.ReactNode
  className?: string
}

export const AnimatedInput = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  icon,
  className = ''
}: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  
  useEffect(() => {
    setHasValue(!!value)
  }, [value])
  
  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          animate={{
            scale: isFocused || hasValue ? 0.85 : 1,
            y: isFocused || hasValue ? -10 : 0,
            color: isFocused ? '#3B82F6' : error ? '#EF4444' : '#6B7280'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute left-3 top-3 pointer-events-none font-medium"
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={isFocused ? placeholder : ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          className={`
            w-full py-3 px-3 ${icon ? 'pl-10' : ''} ${label ? 'pt-6' : ''}
            border-2 rounded-lg bg-white
            transition-all duration-200
            focus:outline-none focus:ring-0
            ${error 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-200 focus:border-blue-500'
            }
          `}
        />
        
        <motion.div
          initial={false}
          animate={{
            scaleX: isFocused ? 1 : 0,
            opacity: isFocused ? 1 : 0
          }}
          className={`
            absolute bottom-0 left-0 right-0 h-0.5 rounded-full
            ${error ? 'bg-red-500' : 'bg-blue-500'}
          `}
          style={{ originX: 0.5 }}
        />
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// Loader com animação suave
export const AnimatedLoader = ({ size = 40, color = '#3B82F6' }) => {
  return (
    <motion.div
      className="inline-block"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          fill={color}
          opacity="0.3"
        />
        <path
          d="M12 2C17.52 2 22 6.48 22 12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  )
}

// Switch animado
interface AnimatedSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export const AnimatedSwitch = ({
  checked,
  onChange,
  label,
  size = 'md',
  color = 'bg-blue-600'
}: AnimatedSwitchProps) => {
  const sizes = {
    sm: { w: 'w-8', h: 'h-5', circle: 'w-3 h-3' },
    md: { w: 'w-12', h: 'h-6', circle: 'w-5 h-5' },
    lg: { w: 'w-14', h: 'h-7', circle: 'w-6 h-6' }
  }
  
  const { w, h, circle } = sizes[size]
  
  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={() => onChange(!checked)}
        className={`
          relative ${w} ${h} rounded-full
          transition-colors duration-200
          ${checked ? color : 'bg-gray-300'}
        `}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          layout
          className={`
            absolute top-1 ${circle} bg-white rounded-full shadow-md
          `}
          animate={{
            x: checked ? (size === 'sm' ? 12 : size === 'md' ? 24 : 28) : 2
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
      
      {label && (
        <label 
          onClick={() => onChange(!checked)}
          className="cursor-pointer text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
    </div>
  )
}

// Badge com animação de entrada
interface AnimatedBadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const AnimatedBadge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = ''
}: AnimatedBadgeProps) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center font-semibold rounded-full
        ${variants[variant]} ${sizes[size]}
        ${className}
      `}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.span>
  )
}

export default {
  useHoverScale,
  useClickAnimation,
  AnimatedButton,
  AnimatedCard,
  AnimatedInput,
  AnimatedLoader,
  AnimatedSwitch,
  AnimatedBadge
}
