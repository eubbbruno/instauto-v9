'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import ValidatedInput from './ValidatedInput'
import LoadingButton from './LoadingButton'
import SocialLoginButtons from './SocialLoginButtons'
import ForgotPasswordModal from './ForgotPasswordModal'

interface LoginFormAdvancedProps {
  isSignUp: boolean
  userType: 'motorista' | 'oficina'
  oficinaPlano?: 'free' | 'pro'
  onSubmit: (email: string, password: string) => Promise<void>
  loading: boolean
  returnUrl?: string | null
}

export default function LoginFormAdvanced({
  isSignUp,
  userType,
  oficinaPlano,
  onSubmit,
  loading,
  returnUrl
}: LoginFormAdvancedProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Validação em tempo real
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email é obrigatório')
      setIsEmailValid(false)
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Email inválido')
      setIsEmailValid(false)
      return false
    }
    setEmailError('')
    setIsEmailValid(true)
    return true
  }

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Senha é obrigatória')
      setIsPasswordValid(false)
      return false
    }
    if (isSignUp && password.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres')
      setIsPasswordValid(false)
      return false
    }
    setPasswordError('')
    setIsPasswordValid(true)
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value) validateEmail(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (value) validatePassword(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isEmailOk = validateEmail(email)
    const isPasswordOk = validatePassword(password)
    
    if (!isEmailOk || !isPasswordOk) {
      return
    }
    
    if (isSignUp && !acceptTerms) {
      alert('Você deve aceitar os termos de uso')
      return
    }
    
    await onSubmit(email, password)
  }

  return (
    <div className="space-y-6">
      
      {/* Header Dinâmico */}
      <div className="text-center">
        <motion.div
          key={`${isSignUp}-${userType}-${oficinaPlano}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
            {userType === 'oficina' && (
              <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                oficinaPlano === 'pro' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {oficinaPlano === 'pro' ? 'PRO' : 'FREE'}
              </span>
            )}
          </h2>
          <p className="text-gray-600 text-sm">
            {isSignUp 
              ? `${userType === 'oficina' ? 'Cadastre sua oficina' : 'Crie sua conta de motorista'}`
              : 'Entre na sua conta'
            }
            {isSignUp && oficinaPlano === 'pro' && (
              <span className="block text-blue-600 font-medium">
                🎉 7 dias grátis!
              </span>
            )}
          </p>
        </motion.div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <EnvelopeIcon className="w-4 h-4 inline mr-1" />
            Email
          </label>
          <ValidatedInput
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="seu@email.com"
            label=""
            error={emailError}
            isValid={isEmailValid}
          />
        </div>

        {/* Senha */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <LockClosedIcon className="w-4 h-4 inline mr-1" />
            Senha
          </label>
          <ValidatedInput
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            label=""
            error={passwordError}
            isValid={isPasswordValid}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
        </div>

        {/* Termos (apenas signup) */}
        {isSignUp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Aceito os{' '}
              <a href="/termos" target="_blank" className="text-blue-600 hover:underline">
                termos de uso
              </a>{' '}
              e{' '}
              <a href="/privacidade" target="_blank" className="text-blue-600 hover:underline">
                política de privacidade
              </a>
            </label>
          </motion.div>
        )}

        {/* Botão Submit */}
        <LoadingButton
          type="submit"
          loading={loading}
          disabled={loading || !isEmailValid || !isPasswordValid || (isSignUp && !acceptTerms)}
          className="w-full"
          variant={userType === 'motorista' ? 'primary' : 'secondary'}
        >
          {loading 
            ? (isSignUp ? 'Criando conta...' : 'Entrando...')
            : (isSignUp ? 'Criar Conta' : 'Entrar')
          }
        </LoadingButton>

        {/* Esqueci a senha */}
        {!isSignUp && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Esqueci minha senha
            </button>
          </div>
        )}
      </form>

      {/* Login Social */}
      <SocialLoginButtons
        userType={userType}
        oficinaPlano={oficinaPlano}
        returnUrl={returnUrl || undefined}
      />

      {/* Modal Esqueci Senha */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        email={email}
        setEmail={setEmail}
        onSubmit={async () => {
          // Implementar reset de senha
          console.log('Reset senha para:', email)
          setForgotPasswordOpen(false)
        }}
        loading={false}
        emailError={emailError}
        isEmailValid={isEmailValid}
        handleEmailChange={handleEmailChange}
      />
    </div>
  )
}
