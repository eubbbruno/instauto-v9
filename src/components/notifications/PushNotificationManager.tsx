'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BellIcon, 
  CheckIcon, 
  XMarkIcon, 
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid'
import { usePushNotifications, PushNotificationData } from '@/lib/push-notifications'

interface PushNotificationManagerProps {
  userType: 'motorista' | 'oficina-free' | 'oficina-pro'
  className?: string
}

export default function PushNotificationManager({ 
  userType, 
  className = '' 
}: PushNotificationManagerProps) {
  const [showSetup, setShowSetup] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [setupStep, setSetupStep] = useState(1)
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  
  const {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendLocalNotification
  } = usePushNotifications()

  // Verificar se deve mostrar setup automático
  useEffect(() => {
    if (isSupported && permission === 'default' && !isSubscribed) {
      // Mostrar setup após 3 segundos
      const timer = setTimeout(() => {
        setShowSetup(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isSupported, permission, isSubscribed])

  const handleEnableNotifications = async () => {
    setSetupStep(2)
    
    const result = await requestPermission()
    
    if (result === 'granted') {
      setSetupStep(3)
      await subscribe()
      setSetupStep(4)
      setIsSetupComplete(true)
      
      // Enviar notificação de boas-vindas
      setTimeout(() => {
        sendLocalNotification({
          title: '🎉 Notificações Ativadas!',
          body: 'Você receberá alertas importantes sobre seus agendamentos e mensagens.',
          icon: '/images/logo.svg',
          tag: 'welcome-notification'
        })
      }, 1000)
      
      setTimeout(() => {
        setShowSetup(false)
        setSetupStep(1)
      }, 3000)
    } else {
      setSetupStep(1)
    }
  }

  const handleDisableNotifications = async () => {
    await unsubscribe()
  }

  const sendTestNotification = () => {
    const testNotifications = {
      motorista: {
        title: '🔧 Teste - Serviço Concluído',
        body: 'Oficina Central finalizou a revisão do seu Honda Civic. Total: R$ 280,00',
        icon: '/icons/complete-notification.png',
        tag: 'test-notification'
      },
      'oficina-free': {
        title: '📅 Teste - Novo Agendamento',
        body: 'João Silva agendou uma troca de óleo para amanhã às 14h',
        icon: '/icons/calendar-notification.png',
        tag: 'test-notification'
      },
      'oficina-pro': {
        title: '💬 Teste - Nova Mensagem',
        body: 'Maria Santos enviou uma mensagem sobre o orçamento',
        icon: '/icons/message-notification.png',
        tag: 'test-notification'
      }
    }

    sendLocalNotification(testNotifications[userType])
  }

  if (!isSupported) {
    return null
  }

  const getStatusColor = () => {
    if (permission === 'granted' && isSubscribed) return 'text-green-600'
    if (permission === 'denied') return 'text-red-600'
    return 'text-yellow-600'
  }

  const getStatusIcon = () => {
    if (permission === 'granted' && isSubscribed) {
      return <BellSolidIcon className="w-5 h-5 text-green-600" />
    }
    if (permission === 'denied') {
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
    }
    return <BellIcon className="w-5 h-5 text-yellow-600" />
  }

  const getStatusText = () => {
    if (permission === 'granted' && isSubscribed) return 'Ativadas'
    if (permission === 'denied') return 'Bloqueadas'
    return 'Desativadas'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Botão principal */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
      >
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </button>

      {/* Menu de configurações */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Notificações Push</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Status atual */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                {getStatusIcon()}
                <div>
                  <p className="font-medium text-gray-900">{getStatusText()}</p>
                  <p className="text-sm text-gray-600">
                    {permission === 'granted' && isSubscribed && 'Recebendo notificações normalmente'}
                    {permission === 'denied' && 'Notificações bloqueadas pelo navegador'}
                    {permission === 'default' && 'Clique para ativar notificações'}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-2">
                {permission !== 'granted' || !isSubscribed ? (
                  <button
                    onClick={handleEnableNotifications}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BellIcon className="w-4 h-4" />
                    Ativar Notificações
                  </button>
                ) : (
                  <>
                    <button
                      onClick={sendTestNotification}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <DevicePhoneMobileIcon className="w-4 h-4" />
                      Enviar Teste
                    </button>
                    <button
                      onClick={handleDisableNotifications}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Desativar
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  Configurações Avançadas
                </button>
              </div>

              {/* Informações úteis */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Dica:</strong> Você pode permitir/bloquear notificações nas configurações do navegador.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de setup inicial */}
      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSetup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center">
                <motion.div
                  animate={{ 
                    scale: setupStep === 2 ? [1, 1.1, 1] : 1,
                    rotate: setupStep === 3 ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  {isSetupComplete ? (
                    <CheckIcon className="w-8 h-8" />
                  ) : (
                    <BellIcon className="w-8 h-8" />
                  )}
                </motion.div>
                <h2 className="text-xl font-bold">
                  {isSetupComplete ? 'Tudo Pronto! 🎉' : 'Ativar Notificações'}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                {setupStep === 1 && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      Receba alertas instantâneos sobre agendamentos, mensagens e atualizações importantes!
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>📅 Lembretes de agendamentos</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>💬 Novas mensagens</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>🔧 Atualizações de serviços</span>
                      </div>
                    </div>
                    <button
                      onClick={handleEnableNotifications}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Ativar Notificações
                    </button>
                    <button
                      onClick={() => setShowSetup(false)}
                      className="w-full mt-2 text-gray-600 py-2 hover:text-gray-800 transition-colors"
                    >
                      Agora não
                    </button>
                  </div>
                )}

                {setupStep === 2 && (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Aguardando permissão do navegador...
                    </p>
                  </div>
                )}

                {setupStep === 3 && (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Configurando notificações...
                    </p>
                  </div>
                )}

                {setupStep === 4 && isSetupComplete && (
                  <div className="text-center">
                    <p className="text-green-600 font-medium mb-4">
                      ✅ Notificações ativadas com sucesso!
                    </p>
                    <p className="text-gray-600 text-sm">
                      Você receberá uma notificação de teste em alguns segundos.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
