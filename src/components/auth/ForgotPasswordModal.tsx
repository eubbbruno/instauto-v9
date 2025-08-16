'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import ValidatedInput from './ValidatedInput'
import LoadingButton from './LoadingButton'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  setEmail: (email: string) => void
  onSubmit: () => void
  loading: boolean
  emailError: string
  isEmailValid: boolean
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  email,
  setEmail,
  onSubmit,
  loading,
  emailError,
  isEmailValid,
  handleEmailChange
}: ForgotPasswordModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Recuperar Senha
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Conteúdo */}
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Digite seu email para receber um link de recuperação de senha.
                </p>
                
                <ValidatedInput
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="seu@email.com"
                  label="Email"
                  error={emailError}
                  isValid={isEmailValid}
                />
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  
                  <LoadingButton
                    loading={loading}
                    onClick={onSubmit}
                    disabled={!isEmailValid || !email}
                    className="flex-1"
                  >
                    {loading ? 'Enviando...' : 'Enviar Link'}
                  </LoadingButton>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
