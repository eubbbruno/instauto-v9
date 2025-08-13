'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  ArrowDownTrayIcon,
  DevicePhoneMobileIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface PWAManagerProps {
  showInstallPrompt?: boolean
}

export default function PWAManager({ showInstallPrompt = true }: PWAManagerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker()
    }

    // Detectar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone) {
      setIsInstalled(true)
    }

    // Listener para prompt de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Mostrar banner apenas se não estiver instalado e for mobile
      if (!isInstalled && isMobile() && showInstallPrompt) {
        setTimeout(() => setShowInstallBanner(true), 3000) // Delay de 3s
      }
    }

    // Listener para app instalado
    const handleAppInstalled = () => {
      console.log('✅ PWA: App instalado com sucesso!')
      setIsInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [showInstallPrompt, isInstalled])

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      
      setSwRegistration(registration)
      console.log('✅ PWA: Service Worker registrado:', registration.scope)

      // Verificar updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true)
            }
          })
        }
      })

    } catch (error) {
      console.error('❌ PWA: Erro ao registrar Service Worker:', error)
    }
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('✅ PWA: Usuário aceitou instalar')
      } else {
        console.log('❌ PWA: Usuário recusou instalar')
      }
      
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    } catch (error) {
      console.error('❌ PWA: Erro na instalação:', error)
    }
  }

  const handleUpdateClick = () => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768
  }

  const getInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    
    if (isIOS) {
      return {
        title: 'Instalar no iPhone/iPad',
        steps: [
          'Toque no ícone de compartilhar no Safari',
          'Role para baixo e toque em "Adicionar à Tela de Início"',
          'Toque em "Adicionar" para confirmar'
        ]
      }
    }
    
    if (isAndroid) {
      return {
        title: 'Instalar no Android',
        steps: [
          'Toque no menu (⋮) do navegador',
          'Selecione "Adicionar à tela inicial"',
          'Toque em "Adicionar" para confirmar'
        ]
      }
    }
    
    return {
      title: 'Instalar no Computador',
      steps: [
        'Clique no ícone de instalação na barra de endereços',
        'Clique em "Instalar" na janela que aparecer',
        'O app será adicionado ao seu computador'
      ]
    }
  }

  return (
    <>
      {/* Banner de Instalação */}
      <AnimatePresence>
        {showInstallBanner && !isInstalled && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DevicePhoneMobileIcon className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-sm">Instalar InstaAuto</h3>
                    <p className="text-xs text-blue-100">Acesso rápido e offline</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowInstallBanner(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">
                Instale o app para acesso mais rápido e use mesmo sem internet!
              </p>
              
              <div className="flex gap-2">
                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Instalar Agora
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Mostrar instruções manuais
                      alert(getInstallInstructions().steps.join('\n'))
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Ver Instruções
                  </button>
                )}
                
                <button
                  onClick={() => setShowInstallBanner(false)}
                  className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Agora Não
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner de Update */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:w-96 bg-green-50 border border-green-200 rounded-xl p-4 z-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 text-sm">Nova versão disponível!</h4>
                <p className="text-green-700 text-xs">Clique para atualizar o app</p>
              </div>
              <button
                onClick={handleUpdateClick}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Atualizar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hook para verificar se é PWA
export const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    setIsPWA(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')
    )
  }, [])

  return isPWA
}

// Hook para gerenciar cache
export const usePWACache = () => {
  const [cacheSize, setCacheSize] = useState(0)
  const [loading, setLoading] = useState(false)

  const clearCache = async () => {
    setLoading(true)
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const messageChannel = new MessageChannel()
        
        return new Promise((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            setLoading(false)
            resolve(event.data)
          }
          
          navigator.serviceWorker.controller.postMessage(
            { type: 'CLEAR_CACHE' }, 
            [messageChannel.port2]
          )
        })
      }
    } catch (error) {
      console.error('Erro ao limpar cache:', error)
      setLoading(false)
    }
  }

  const getCacheSize = async () => {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const messageChannel = new MessageChannel()
        
        return new Promise((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            setCacheSize(event.data.size)
            resolve(event.data.size)
          }
          
          navigator.serviceWorker.controller.postMessage(
            { type: 'GET_CACHE_SIZE' }, 
            [messageChannel.port2]
          )
        })
      }
    } catch (error) {
      console.error('Erro ao obter tamanho do cache:', error)
    }
  }

  useEffect(() => {
    getCacheSize()
  }, [])

  return { cacheSize, clearCache, getCacheSize, loading }
}
