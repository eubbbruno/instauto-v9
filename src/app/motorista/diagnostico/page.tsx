'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import QuickDiagnosticAI from '@/components/ai/QuickDiagnosticAI'
import { DiagnosticResult } from '@/lib/ai-types'

export default function MotoristaDiagnosticoPage() {
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleDiagnosisComplete = (results: DiagnosticResult[]) => {
    setDiagnosticResults(results)
    setShowResults(true)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'high': return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
      case 'medium': return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default: return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/motorista"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
                  Diagnóstico com IA
                </h1>
                <p className="text-gray-600">Identifique problemas do seu veículo instantaneamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Diagnostic Tool */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <QuickDiagnosticAI 
                className="min-h-[600px]"
                onDiagnosisComplete={handleDiagnosisComplete}
              />
            </div>

            {/* Results Section */}
            {showResults && diagnosticResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white rounded-xl shadow-sm border p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                  Resultados do Diagnóstico
                </h3>

                <div className="space-y-4">
                  {diagnosticResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getSeverityColor(result.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getSeverityIcon(result.severity)}
                            <h4 className="font-semibold">{result.problemType}</h4>
                            <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                              {result.confidence}% confiança
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{result.description}</p>
                          
                          {result.recommendations && result.recommendations.length > 0 && (
                            <div className="mb-3">
                              <p className="font-medium text-gray-900 mb-2">Recomendações:</p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {result.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>💰 Custo estimado: R$ {result.estimatedCost?.min} - R$ {result.estimatedCost?.max}</span>
                            <span>⏱️ Tempo: {result.estimatedTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex space-x-3">
                          <Link
                            href="/buscar-oficinas"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                          >
                            Buscar Oficinas
                          </Link>
                          <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                            Salvar Diagnóstico
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                Como funciona?
              </h3>
              <div className="space-y-3 text-sm text-purple-100">
                <div className="flex items-start space-x-2">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Descreva os sintomas do seu veículo</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Informe dados do veículo (marca, modelo, ano)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Receba diagnóstico e recomendações</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                  <span>Encontre oficinas especializadas</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-gray-900 mb-4">💡 Dicas para melhor diagnóstico</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Seja específico sobre os sintomas</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Informe quando o problema ocorre</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Mencione ruídos, cheiros ou vibrações</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Inclua a quilometragem atual</span>
                </div>
              </div>
            </div>

            {/* Emergency */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-900 mb-3 flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                Emergência?
              </h3>
              <p className="text-red-700 text-sm mb-4">
                Se o veículo apresenta problemas críticos de segurança, pare imediatamente e chame socorro.
              </p>
              <Link
                href="/motorista/emergencia"
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center block"
              >
                Socorro 24h
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
