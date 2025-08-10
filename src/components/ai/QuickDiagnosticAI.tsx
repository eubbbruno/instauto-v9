'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { VehicleSymptom, DiagnosticResult, VehicleData, AnalyticsInsight } from '@/lib/ai-types'
import { useAIDiagnostic } from '@/lib/ai-engine'

interface QuickDiagnosticAIProps {
  className?: string
  onDiagnosisComplete?: (results: DiagnosticResult[]) => void
  vehicleData?: VehicleData
}

export default function QuickDiagnosticAI({ 
  className = '', 
  onDiagnosisComplete,
  vehicleData 
}: QuickDiagnosticAIProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [step, setStep] = useState<'input' | 'vehicle' | 'processing' | 'results'>('input')
  const [selectedSymptoms, setSelectedSymptoms] = useState<VehicleSymptom[]>([])
  const [currentVehicleData, setCurrentVehicleData] = useState<VehicleData>(
    vehicleData || {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      fuelType: 'gasoline',
      transmissionType: 'manual'
    }
  )
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([])
  const [insights, setInsights] = useState<AnalyticsInsight[]>([])

  const { diagnose, generateInsights, isProcessing } = useAIDiagnostic()

  const commonSymptoms: Omit<VehicleSymptom, 'id'>[] = [
    { category: 'engine', description: 'Motor com falhas', severity: 'high', frequency: 'frequent' },
    { category: 'engine', description: 'Perda de potência', severity: 'medium', frequency: 'occasional' },
    { category: 'engine', description: 'Consumo excessivo', severity: 'medium', frequency: 'constant' },
    { category: 'brake', description: 'Freios fazendo ruído', severity: 'high', frequency: 'frequent' },
    { category: 'brake', description: 'Pedal muito mole', severity: 'critical', frequency: 'constant' },
    { category: 'brake', description: 'Vibração ao frear', severity: 'medium', frequency: 'occasional' },
    { category: 'transmission', description: 'Marcha patinando', severity: 'high', frequency: 'frequent' },
    { category: 'transmission', description: 'Dificuldade para engatar', severity: 'medium', frequency: 'occasional' },
    { category: 'suspension', description: 'Direção pesada', severity: 'medium', frequency: 'constant' },
    { category: 'suspension', description: 'Carro puxando para um lado', severity: 'high', frequency: 'constant' },
    { category: 'electrical', description: 'Bateria descarregando', severity: 'medium', frequency: 'frequent' },
    { category: 'electrical', description: 'Luzes fracas', severity: 'low', frequency: 'occasional' },
    { category: 'tire', description: 'Desgaste irregular', severity: 'medium', frequency: 'constant' },
    { category: 'tire', description: 'Vibração no volante', severity: 'medium', frequency: 'frequent' },
    { category: 'other', description: 'Ruídos estranhos', severity: 'low', frequency: 'occasional' },
    { category: 'other', description: 'Cheiro estranho', severity: 'medium', frequency: 'rare' }
  ]

  const handleSymptomToggle = (symptom: Omit<VehicleSymptom, 'id'>) => {
    const symptomWithId: VehicleSymptom = {
      ...symptom,
      id: `symptom_${Date.now()}_${Math.random()}`
    }

    setSelectedSymptoms(prev => {
      const exists = prev.find(s => s.description === symptom.description)
      if (exists) {
        return prev.filter(s => s.description !== symptom.description)
      } else {
        return [...prev, symptomWithId]
      }
    })
  }

  const handleStartDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Selecione pelo menos um sintoma')
      return
    }

    setStep('vehicle')
  }

  const handleVehicleSubmit = async () => {
    if (!currentVehicleData.make || !currentVehicleData.model) {
      alert('Preencha os dados do veículo')
      return
    }

    setStep('processing')
    
    try {
      const results = await diagnose(selectedSymptoms, currentVehicleData)
      setDiagnosticResults(results)
      
      // Gerar insights baseados em histórico simulado
      const mockHistory = [
        { date: '2024-01-01', cost: 300, category: 'engine' },
        { date: '2024-02-15', cost: 150, category: 'brake' },
        { date: '2024-03-20', cost: 450, category: 'suspension' }
      ]
      const aiInsights = generateInsights(mockHistory)
      setInsights(aiInsights)
      
      setStep('results')
      
      if (onDiagnosisComplete) {
        onDiagnosisComplete(results)
      }
    } catch (error) {
      console.error('Erro no diagnóstico:', error)
      setStep('input')
    }
  }

  const handleReset = () => {
    setStep('input')
    setSelectedSymptoms([])
    setDiagnosticResults([])
    setInsights([])
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-600 text-white'
      case 'urgent': return 'bg-orange-600 text-white'
      case 'soon': return 'bg-yellow-600 text-white'
      case 'can_wait': return 'bg-green-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">🤖 Diagnóstico Inteligente</h3>
              <p className="text-blue-100 text-sm">IA para análise rápida de problemas</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowPathIcon className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {/* Step 1: Seleção de Sintomas */}
              {step === 'input' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Quais sintomas você notou?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Selecione todos os problemas que seu veículo apresenta
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                    {commonSymptoms.map((symptom, index) => {
                      const isSelected = selectedSymptoms.some(s => s.description === symptom.description)
                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleSymptomToggle(symptom)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{symptom.description}</span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(symptom.severity)}`}>
                                {symptom.severity}
                              </span>
                              {isSelected && <CheckCircleIcon className="w-5 h-5 text-blue-600" />}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 capitalize">
                            {symptom.category} • {symptom.frequency}
                          </p>
                        </motion.button>
                      )
                    })}
                  </div>

                  {selectedSymptoms.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 rounded-lg p-4 mt-4"
                    >
                      <h5 className="font-semibold text-blue-800 mb-2">
                        Sintomas Selecionados ({selectedSymptoms.length}):
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedSymptoms.map((symptom) => (
                          <span
                            key={symptom.id}
                            className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
                          >
                            {symptom.description}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedSymptoms(prev => prev.filter(s => s.id !== symptom.id))
                              }}
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={handleStartDiagnosis}
                    disabled={selectedSymptoms.length === 0}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Continuar Diagnóstico ({selectedSymptoms.length} sintomas)
                  </button>
                </motion.div>
              )}

              {/* Step 2: Dados do Veículo */}
              {step === 'vehicle' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Dados do seu veículo
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Essas informações ajudam a IA a ser mais precisa
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marca
                      </label>
                      <input
                        type="text"
                        value={currentVehicleData.make}
                        onChange={(e) => setCurrentVehicleData(prev => ({ ...prev, make: e.target.value }))}
                        placeholder="Ex: Toyota"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modelo
                      </label>
                      <input
                        type="text"
                        value={currentVehicleData.model}
                        onChange={(e) => setCurrentVehicleData(prev => ({ ...prev, model: e.target.value }))}
                        placeholder="Ex: Corolla"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano
                      </label>
                      <input
                        type="number"
                        value={currentVehicleData.year}
                        onChange={(e) => setCurrentVehicleData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quilometragem
                      </label>
                      <input
                        type="number"
                        value={currentVehicleData.mileage}
                        onChange={(e) => setCurrentVehicleData(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                        placeholder="Ex: 50000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Combustível
                      </label>
                      <select
                        value={currentVehicleData.fuelType}
                        onChange={(e) => setCurrentVehicleData(prev => ({ ...prev, fuelType: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="gasoline">Gasolina</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Elétrico</option>
                        <option value="hybrid">Híbrido</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transmissão
                      </label>
                      <select
                        value={currentVehicleData.transmissionType}
                        onChange={(e) => setCurrentVehicleData(prev => ({ ...prev, transmissionType: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="manual">Manual</option>
                        <option value="automatic">Automática</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep('input')}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleVehicleSubmit}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Iniciar Diagnóstico IA
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Processamento */}
              {step === 'processing' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                    />
                    <SparklesIcon className="w-8 h-8 text-blue-600 absolute top-4 left-1/2 transform -translate-x-1/2" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    🤖 IA Analisando Seu Veículo...
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Processando {selectedSymptoms.length} sintomas do seu {currentVehicleData.make} {currentVehicleData.model}
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-4 text-left max-w-md mx-auto">
                    <div className="space-y-2 text-sm text-blue-700">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Analisando sintomas reportados...
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Consultando base de conhecimento...
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Calculando probabilidades...
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Resultados */}
              {step === 'results' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      🎯 Diagnóstico Completado!
                    </h4>
                    <p className="text-gray-600 text-sm">
                      A IA encontrou {diagnosticResults.length} possível(is) problema(s)
                    </p>
                  </div>

                  {/* Resultados do Diagnóstico */}
                  {diagnosticResults.length > 0 && (
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                        Problemas Detectados
                      </h5>
                      
                      {diagnosticResults.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h6 className="font-bold text-gray-800 mb-1">
                                {result.problemName}
                              </h6>
                              <p className="text-sm text-gray-600 mb-2">
                                {result.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(result.urgency)}`}>
                                {result.urgency === 'immediate' ? 'Imediato' :
                                 result.urgency === 'urgent' ? 'Urgente' :
                                 result.urgency === 'soon' ? 'Em breve' : 'Pode esperar'}
                              </span>
                              <span className="text-sm font-bold text-blue-600">
                                {Math.round(result.confidence * 100)}% confiança
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                              <span>R$ {result.estimatedCost.min} - R$ {result.estimatedCost.max}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4 text-blue-600" />
                              <span>{result.estimatedRepairTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <WrenchScrewdriverIcon className="w-4 h-4 text-purple-600" />
                              <span className="capitalize">{result.complexity}</span>
                            </div>
                          </div>

                          {result.recommendedActions.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-300">
                              <h6 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
                                <LightBulbIcon className="w-4 h-4 text-yellow-600" />
                                Ações Recomendadas:
                              </h6>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {result.recommendedActions.map((action, actionIndex) => (
                                  <li key={actionIndex}>{action}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Insights de Analytics */}
                  {insights.length > 0 && (
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                        Insights Inteligentes
                      </h5>
                      
                      {insights.map((insight, index) => (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h6 className="font-bold text-blue-800">{insight.title}</h6>
                            <span className="text-xs text-blue-600">
                              {Math.round(insight.confidence * 100)}% precisão
                            </span>
                          </div>
                          <p className="text-sm text-blue-700 mb-2">{insight.description}</p>
                          {insight.actionable && insight.recommendedAction && (
                            <div className="bg-blue-100 rounded p-2">
                              <p className="text-xs text-blue-800 font-medium">
                                💡 {insight.recommendedAction}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Novo Diagnóstico
                    </button>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
