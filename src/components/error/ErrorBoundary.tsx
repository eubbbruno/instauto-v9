'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Callback personalizado
    this.props.onError?.(error, errorInfo)

    // Enviar erro para serviço de monitoramento
    this.logErrorToService(error, errorInfo)
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Enviar para serviço de monitoramento (Sentry, LogRocket, etc.)
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(console.error)
    } catch (e) {
      console.error('Failed to log error:', e)
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleContactSupport = () => {
    window.location.href = '/contato'
  }

  render() {
    if (this.state.hasError) {
      // Fallback customizado
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Fallback padrão
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Algo deu errado
            </h1>
            
            <p className="text-gray-600 mb-6">
              Encontramos um problema inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
            </p>

            {/* Detalhes do erro (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-gray-50 p-4 rounded-lg mb-6 text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Detalhes técnicos
                </summary>
                <pre className="text-red-600 whitespace-pre-wrap break-words">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="w-5 h-5" />
                Tentar Novamente
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <HomeIcon className="w-5 h-5" />
                Voltar ao Início
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleContactSupport}
                className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                Falar com Suporte
              </motion.button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Erro ID: {Date.now().toString(36)}
            </p>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para capturar erros em componentes funcionais
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // Enviar erro para serviço de monitoramento
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(console.error)
  }
}

// Error boundary específico para componentes críticos
export function CriticalErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Componente Indisponível
          </h3>
          <p className="text-gray-600">
            Este componente está temporariamente indisponível. Tente recarregar a página.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

// Error boundary para chat
export function ChatErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 text-center bg-gray-50 rounded-xl">
          <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            Chat temporariamente indisponível. Tente novamente em alguns instantes.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
