'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BellIcon,
  BellSlashIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid'
import { usePushNotifications, NotificationTemplates } from '@/lib/push-notifications'

interface PushNotificationPanelProps {
  userId: string
  userType: 'motorista' | 'oficina-free' | 'oficina-pro'
  className?: string
}

export default function PushNotificationPanel({
  userId,
  userType,
  className = ''
}: PushNotificationPanelProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [testNotification, setTestNotification] = useState('')
  
  const {
    isSubscribed,
    permission,
    loading,
    error,
    subscribe,
    unsubscribe,
    sendLocalNotification,
    isSupported
  } = usePushNotifications(userId)

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe()
    } else {
      await subscribe()
    }
  }

  const handleTestNotification = async (type: string) => {
    const notifications = {
      message: NotificationTemplates.newMessage('João Silva'),
      appointment: NotificationTemplates.appointmentReminder('Auto Center', '14:30'),
      order: NotificationTemplates.orderUpdate('Serviço concluído'),
      promotion: NotificationTemplates.promotionalOffer('20% de desconto em todos os serviços!'),
      emergency: NotificationTemplates.emergencyAlert('Guincho solicitado - chegada em 15 min')
    }

    const notification = notifications[type as keyof typeof notifications]
    if (notification) {
      await sendLocalNotification(notification)
      setTestNotification(type)
      setTimeout(() => setTestNotification(''), 2000)
    }
  }

  const getStatusColor = () => {
    if (!isSupported) return 'text-gray-400'
    if (permission === 'denied') return 'text-red-500'
    if (isSubscribed) return 'text-green-500'
    return 'text-yellow-500'
  }

  const getStatusText = () => {
    if (!isSupported) return 'Não suportado'
    if (permission === 'denied') return 'Bloqueado'
    if (isSubscribed) return 'Ativo'
    return 'Inativo'
  }

  const getDeviceIcon = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    return isMobile ? DevicePhoneMobileIcon : ComputerDesktopIcon
  }

  const DeviceIcon = getDeviceIcon()

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="font-semibold text-yellow-800">Notificações não suportadas</h3>
            <p className="text-sm text-yellow-700">
              Seu navegador não suporta notificações push. Considere atualizar para a versão mais recente.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {isSubscribed ? (
                <BellIconSolid className="w-6 h-6" />
              ) : (
                <BellSlashIcon className="w-6 h-6" />
              )}
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                isSubscribed ? 'bg-green-400' : 'bg-red-400'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold">Notificações Push</h3>
              <p className="text-sm text-blue-100">
                Status: <span className={getStatusColor()}>{getStatusText()}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XMarkIcon className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Main Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <DeviceIcon className="w-6 h-6 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">Ativar Notificações</h4>
              <p className="text-sm text-gray-600">
                Receba alertas importantes em tempo real
              </p>
            </div>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleNotifications}
            disabled={loading || permission === 'denied'}
            className={`
              relative w-14 h-8 rounded-full transition-colors
              ${isSubscribed ? 'bg-green-500' : 'bg-gray-300'}
              ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${permission === 'denied' ? 'bg-red-300 cursor-not-allowed' : ''}
            `}
          >
            <motion.div
              animate={{ x: isSubscribed ? 24 : 2 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              {loading ? (
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : isSubscribed ? (
                <CheckIcon className="w-3 h-3 text-green-600" />
              ) : (
                <XMarkIcon className="w-3 h-3 text-gray-400" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {permission === 'denied' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-red-800">Notificações Bloqueadas</h5>
                <p className="text-sm text-red-700 mt-1">
                  Para ativar, clique no ícone de cadeado na barra de endereços e permita notificações.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && isSubscribed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 pt-4 mt-4"
            >
              <h5 className="font-medium text-gray-900 mb-3">Testar Notificações</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {[
                  { key: 'message', label: '💬 Mensagem', color: 'blue' },
                  { key: 'appointment', label: '⏰ Agendamento', color: 'green' },
                  { key: 'order', label: '🔧 Ordem', color: 'purple' },
                  { key: 'promotion', label: '🎉 Promoção', color: 'yellow' },
                  { key: 'emergency', label: '🚨 Emergência', color: 'red' }
                ].map(({ key, label, color }) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTestNotification(key)}
                    className={`
                      p-2 text-sm rounded-lg transition-colors relative
                      ${testNotification === key 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : `bg-${color}-50 text-${color}-700 border-${color}-200 hover:bg-${color}-100`
                      }
                      border
                    `}
                  >
                    {testNotification === key && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <CheckIcon className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                    {label}
                  </motion.button>
                ))}
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h6 className="font-medium text-blue-800">Como funcionam</h6>
                    <p className="text-sm text-blue-700 mt-1">
                      As notificações push funcionam mesmo quando o app está fechado. 
                      Você receberá alertas para mensagens, agendamentos e emergências.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits */}
        {!isSubscribed && permission !== 'denied' && (
          <div className="mt-4 space-y-2">
            <h5 className="font-medium text-gray-900">Benefícios das Notificações:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                {userType === 'motorista' 
                  ? 'Receba respostas das oficinas instantaneamente'
                  : 'Nunca perca um novo cliente'
                }
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                Lembretes de agendamentos importantes
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                Alertas de emergência e atualizações críticas
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                Funciona mesmo com o app fechado
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
