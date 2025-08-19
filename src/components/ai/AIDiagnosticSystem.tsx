'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparklesIcon,
  MicrophoneIcon,
  PhotoIcon,
  DocumentTextIcon,
  ClockIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import { SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid'

interface DiagnosticMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  analysis?: DiagnosticAnalysis
  suggestions?: ServiceSuggestion[]
}

interface DiagnosticAnalysis {
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  category: string
  estimatedTime: string
  urgency: 'routine' | 'soon' | 'urgent' | 'immediate'
}

interface ServiceSuggestion {
  id: string
  service: string
  description: string
  estimatedPrice: {
    min: number
    max: number
  }
  parts?: string[]
  labor: string
  priority: 'essential' | 'recommended' | 'optional'
}

interface AIDiagnosticSystemProps {
  workshopId: string
  onServiceSuggested?: (suggestion: ServiceSuggestion) => void
  className?: string
}

export default function AIDiagnosticSystem({
  workshopId,
  onServiceSuggested,
  className = ''
}: AIDiagnosticSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<DiagnosticMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<DiagnosticAnalysis | null>(null)
  const [voiceRecording, setVoiceRecording] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Base de conhecimento diagnóstico (simulado)
  const diagnosticDatabase = {
    symptoms: {
      'barulho estranho': {
        keywords: ['barulho', 'ruído', 'som', 'estranho', 'chiado', 'rangido'],
        categories: ['freios', 'suspensão', 'motor', 'transmissão'],
        severity: 'medium'
      },
      'vibração': {
        keywords: ['vibração', 'trepidação', 'balanço', 'tremor'],
        categories: ['pneus', 'suspensão', 'motor', 'direção'],
        severity: 'medium'
      },
      'fumaça': {
        keywords: ['fumaça', 'fumo', 'vapor', 'cheiro queimado'],
        categories: ['motor', 'sistema elétrico', 'freios', 'escape'],
        severity: 'high'
      },
      'não liga': {
        keywords: ['não liga', 'não pega', 'não funciona', 'morreu'],
        categories: ['bateria', 'motor de partida', 'sistema elétrico', 'combustível'],
        severity: 'critical'
      }
    },
    services: {
      'troca de óleo': { price: { min: 80, max: 150 }, time: '30-60 min' },
      'alinhamento': { price: { min: 50, max: 120 }, time: '45-90 min' },
      'balanceamento': { price: { min: 40, max: 100 }, time: '30-60 min' },
      'freios': { price: { min: 200, max: 800 }, time: '2-4 horas' },
      'suspensão': { price: { min: 300, max: 1500 }, time: '3-6 horas' },
      'bateria': { price: { min: 150, max: 400 }, time: '15-30 min' }
    }
  }

  // Analisar sintomas com IA (simulado)
  const analyzeSymptoms = async (message: string): Promise<DiagnosticAnalysis> => {
    setIsAnalyzing(true)
    
    // Simular processamento IA
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const lowerMessage = message.toLowerCase()
    
    // Detectar categoria e severidade
    let category = 'Geral'
    let severity: DiagnosticAnalysis['severity'] = 'low'
    let confidence = 70
    
    // Análise por palavras-chave
    Object.entries(diagnosticDatabase.symptoms).forEach(([symptom, data]) => {
      const matches = data.keywords.filter(keyword => 
        lowerMessage.includes(keyword)
      ).length
      
      if (matches > 0) {
        category = data.categories[0]
        severity = data.severity as DiagnosticAnalysis['severity']
        confidence = Math.min(95, 60 + (matches * 15))
      }
    })
    
    setIsAnalyzing(false)
    
    return {
      severity,
      confidence,
      category,
      estimatedTime: severity === 'critical' ? 'Imediato' : 
                    severity === 'high' ? '1-2 dias' : '1-2 semanas',
      urgency: severity === 'critical' ? 'immediate' : 
               severity === 'high' ? 'urgent' : 'soon'
    }
  }

  // Gerar sugestões de serviços
  const generateServiceSuggestions = (analysis: DiagnosticAnalysis): ServiceSuggestion[] => {
    const suggestions: ServiceSuggestion[] = []
    
    switch (analysis.category.toLowerCase()) {
      case 'freios':
        suggestions.push({
          id: '1',
          service: 'Revisão do Sistema de Freios',
          description: 'Inspeção completa das pastilhas, discos e sistema hidráulico',
          estimatedPrice: diagnosticDatabase.services.freios.price,
          parts: ['Pastilhas', 'Discos', 'Fluido de freio'],
          labor: diagnosticDatabase.services.freios.time,
          priority: 'essential'
        })
        break
        
      case 'suspensão':
        suggestions.push({
          id: '2',
          service: 'Diagnóstico da Suspensão',
          description: 'Verificação de amortecedores, molas e sistema de direção',
          estimatedPrice: diagnosticDatabase.services.suspensão.price,
          parts: ['Amortecedores', 'Molas', 'Buchas'],
          labor: diagnosticDatabase.services.suspensão.time,
          priority: 'recommended'
        })
        break
        
      case 'bateria':
        suggestions.push({
          id: '3',
          service: 'Teste e Troca de Bateria',
          description: 'Diagnóstico elétrico e substituição se necessário',
          estimatedPrice: diagnosticDatabase.services.bateria.price,
          parts: ['Bateria nova', 'Terminais'],
          labor: diagnosticDatabase.services.bateria.time,
          priority: 'essential'
        })
        break
        
      default:
        suggestions.push({
          id: '4',
          service: 'Diagnóstico Geral',
          description: 'Inspeção completa para identificar o problema',
          estimatedPrice: { min: 50, max: 150 },
          parts: [],
          labor: '1-2 horas',
          priority: 'recommended'
        })
    }
    
    return suggestions
  }

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: DiagnosticMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    // Analisar com IA
    const analysis = await analyzeSymptoms(userMessage.content)
    setCurrentAnalysis(analysis)
    
    const suggestions = generateServiceSuggestions(analysis)

    const aiResponse: DiagnosticMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: generateAIResponse(analysis),
      timestamp: new Date(),
      analysis,
      suggestions
    }

    setMessages(prev => [...prev, aiResponse])
  }

  // Gerar resposta da IA
  const generateAIResponse = (analysis: DiagnosticAnalysis): string => {
    const severityMessages = {
      low: '👍 Situação controlada.',
      medium: '⚠️ Requer atenção.',
      high: '🚨 Problema sério detectado.',
      critical: '🔴 URGENTE: Atendimento imediato!'
    }

    return `${severityMessages[analysis.severity]} 

Com base na descrição, identifiquei um problema relacionado a **${analysis.category}** com ${analysis.confidence}% de confiança.

**Nível de urgência:** ${analysis.urgency === 'immediate' ? 'Imediato' : 
                        analysis.urgency === 'urgent' ? 'Urgente' : 
                        analysis.urgency === 'soon' ? 'Em breve' : 'Rotina'}

**Tempo recomendado:** ${analysis.estimatedTime}

Vou gerar algumas sugestões de serviços baseadas nesta análise:`
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'essential': return 'bg-red-100 text-red-800'
      case 'recommended': return 'bg-yellow-100 text-yellow-800'
      case 'optional': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SparklesIconSolid className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          IA
        </div>
      </motion.button>
    )
  }

  return (
    <motion.div
      className={`fixed bottom-4 right-4 z-50 bg-white rounded-xl shadow-2xl border ${className}`}
      style={{ width: '400px', height: '600px' }}
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 100 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIconSolid className="w-6 h-6" />
            <div>
              <h3 className="font-bold">IA Diagnóstico</h3>
              <p className="text-sm opacity-90">Assistente Automotivo</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <motion.div 
            className="text-center text-gray-500 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <RocketLaunchIcon className="w-12 h-12 mx-auto mb-3 text-purple-400" />
            <p className="text-sm">Descreva o problema do veículo</p>
            <p className="text-xs mt-1">A IA analisará e sugerirá soluções</p>
          </motion.div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {/* Análise */}
              {message.analysis && (
                <div className={`mt-3 p-2 rounded border ${getSeverityColor(message.analysis.severity)}`}>
                  <div className="text-xs font-medium mb-1">
                    Análise: {message.analysis.confidence}% confiança
                  </div>
                  <div className="text-xs">
                    Categoria: {message.analysis.category} | Urgência: {message.analysis.estimatedTime}
                  </div>
                </div>
              )}

              {/* Sugestões de Serviços */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-medium text-gray-600">Serviços Sugeridos:</div>
                  {message.suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-white p-2 rounded border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{suggestion.service}</span>
                            <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(suggestion.priority)}`}>
                              {suggestion.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                          
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-2">
                              <CurrencyDollarIcon className="w-3 h-3" />
                              R$ {suggestion.estimatedPrice.min} - R$ {suggestion.estimatedPrice.max}
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-3 h-3" />
                              {suggestion.labor}
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => onServiceSuggested?.(suggestion)}
                          className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-all"
                        >
                          Usar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}

        {isAnalyzing && (
          <motion.div 
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-sm">IA analisando...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Descreva o problema do veículo..."
              className="w-full p-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <PhotoIcon className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MicrophoneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isAnalyzing}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
