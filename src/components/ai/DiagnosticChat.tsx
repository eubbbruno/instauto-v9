'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PaperAirplaneIcon,
  PhotoIcon,
  MicrophoneIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { ChatMessage } from '@/lib/openai'
import { useToastHelpers } from '@/components/ui/toast'

interface DiagnosticChatProps {
  onDiagnosisComplete?: (diagnosis: any) => void
  className?: string
}

export default function DiagnosticChat({ 
  onDiagnosisComplete, 
  className = '' 
}: DiagnosticChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o assistente de diagnóstico da InstaAuto. Descreva os problemas que você está enfrentando com seu veículo e eu te ajudarei a identificar possíveis causas e soluções.',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehicleInfo, setVehicleInfo] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0
  })
  const [showVehicleForm, setShowVehicleForm] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { success, error: showError } = useToastHelpers()

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          vehicleInfo: showVehicleForm ? null : vehicleInfo
        }),
      })

      if (!response.ok) {
        throw new Error('Erro na comunicação com IA')
      }

      const data = await response.json()
      
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])

      // Se recebeu um diagnóstico completo
      if (data.diagnosis) {
        onDiagnosisComplete?.(data.diagnosis)
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      showError('Erro ao processar mensagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      showError('Por favor, selecione apenas imagens')
      return
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Imagem muito grande. Máximo 5MB.')
      return
    }

    setLoading(true)

    try {
      // Converter para base64
      const base64 = await fileToBase64(file)
      
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          description: inputMessage || 'Análise de imagem do problema'
        }),
      })

      if (!response.ok) {
        throw new Error('Erro na análise da imagem')
      }

      const data = await response.json()
      
      // Adicionar mensagem do usuário com a imagem
      const userMessage: ChatMessage = {
        role: 'user',
        content: `[Imagem enviada] ${inputMessage || 'Análise desta imagem'}`,
        timestamp: new Date().toISOString()
      }

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.analysis,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, userMessage, aiMessage])
      setInputMessage('')
      success('Imagem analisada com sucesso!')
    } catch (error) {
      console.error('Erro ao analisar imagem:', error)
      showError('Erro ao analisar imagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const startVoiceRecording = () => {
    // TODO: Implementar gravação de voz
    showError('Gravação de voz em desenvolvimento')
  }

  const submitVehicleInfo = () => {
    if (!vehicleInfo.make || !vehicleInfo.model) {
      showError('Preencha pelo menos marca e modelo do veículo')
      return
    }
    
    setShowVehicleForm(false)
    success('Informações do veículo salvas!')
    
    const infoMessage: ChatMessage = {
      role: 'assistant',
      content: `Perfeito! Agora sei que você tem um ${vehicleInfo.make} ${vehicleInfo.model} ${vehicleInfo.year}. Pode me contar quais problemas está enfrentando?`,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, infoMessage])
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result as string
        resolve(base64.split(',')[1]) // Remove data:image/jpeg;base64,
      }
      reader.onerror = error => reject(error)
    })
  }

  const getMessageIcon = (role: string) => {
    if (role === 'assistant') {
      return <SparklesIcon className="w-6 h-6 text-blue-600" />
    }
    return <div className="w-6 h-6 bg-gray-400 rounded-full" />
  }

  const getUrgencyColor = (content: string) => {
    const lowerContent = content.toLowerCase()
    if (lowerContent.includes('urgente') || lowerContent.includes('perigoso')) {
      return 'border-red-200 bg-red-50'
    }
    if (lowerContent.includes('atenção') || lowerContent.includes('cuidado')) {
      return 'border-yellow-200 bg-yellow-50'
    }
    return 'border-gray-200 bg-white'
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Vehicle Info Form */}
      <AnimatePresence>
        {showVehicleForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-blue-50 border-b border-blue-200"
          >
            <h3 className="font-semibold text-blue-900 mb-3">
              Informações do Veículo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Marca"
                value={vehicleInfo.make}
                onChange={(e) => setVehicleInfo(prev => ({ ...prev, make: e.target.value }))}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Modelo"
                value={vehicleInfo.model}
                onChange={(e) => setVehicleInfo(prev => ({ ...prev, model: e.target.value }))}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Ano"
                value={vehicleInfo.year}
                onChange={(e) => setVehicleInfo(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="KM"
                value={vehicleInfo.mileage}
                onChange={(e) => setVehicleInfo(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={submitVehicleInfo}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : `${getUrgencyColor(message.content)} text-gray-900 rounded-bl-md border`
              }`}
            >
              <div className="flex items-start gap-3">
                {message.role === 'assistant' && getMessageIcon(message.role)}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.timestamp && (
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-md border border-gray-200">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-gray-600 transition-colors"
            title="Enviar imagem"
          >
            <PhotoIcon className="w-5 h-5" />
          </button>
          <button
            onClick={startVoiceRecording}
            className="p-3 text-gray-400 hover:text-gray-600 transition-colors"
            title="Gravar áudio"
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Descreva o problema do seu veículo..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
