'use client'
import { motion } from 'framer-motion'

interface LoadingButtonProps {
  loading: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'social-google' | 'social-facebook'
}

export default function LoadingButton({
  loading,
  disabled,
  onClick,
  children,
  className = "",
  type = "button",
  variant = "primary"
}: LoadingButtonProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'social-google':
        return 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
      case 'social-facebook':
        return 'bg-blue-600 text-white hover:bg-blue-700'
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      default:
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
    }
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      whileHover={!loading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
      className={`
        relative flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium 
        transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantStyles()} ${className}
      `}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.div>
      )}
      
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
    </motion.button>
  )
}
