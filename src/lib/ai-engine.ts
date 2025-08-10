'use client'
import { useState, useCallback } from 'react'
import { VehicleSymptom, DiagnosticResult, VehicleData, AnalyticsInsight } from './ai-types'

class AIDiagnosticEngine {
  private knowledgeBase: Map<string, any> = new Map()
  private diagnosticRules: Array<any> = []

  constructor() {
    this.initializeKnowledgeBase()
  }

  private initializeKnowledgeBase(): void {
    const commonProblems = [
      {
        id: 'engine_misfire',
        name: 'Falha de Ignição',
        category: 'engine',
        severity: 'medium',
        avgCost: { min: 200, max: 800 },
        complexity: 'moderate'
      },
      {
        id: 'brake_wear',
        name: 'Desgaste dos Freios',
        category: 'brake',
        severity: 'high',
        avgCost: { min: 300, max: 1200 },
        complexity: 'moderate'
      },
      {
        id: 'transmission_slip',
        name: 'Deslizamento da Transmissão',
        category: 'transmission',
        severity: 'high',
        avgCost: { min: 800, max: 4000 },
        complexity: 'complex'
      },
      {
        id: 'suspension_issues',
        name: 'Problemas na Suspensão',
        category: 'suspension',
        severity: 'medium',
        avgCost: { min: 400, max: 1500 },
        complexity: 'moderate'
      },
      {
        id: 'electrical_issues',
        name: 'Problemas Elétricos',
        category: 'electrical',
        severity: 'medium',
        avgCost: { min: 150, max: 1000 },
        complexity: 'moderate'
      }
    ]

    commonProblems.forEach(problem => {
      this.knowledgeBase.set(problem.id, problem)
    })

    this.diagnosticRules = [
      { condition: ['irregular_idle', 'power_loss'], result: 'engine_misfire', confidence: 0.8 },
      { condition: ['squeaking_brakes', 'longer_stopping'], result: 'brake_wear', confidence: 0.9 },
      { condition: ['gear_slipping', 'delayed_engagement'], result: 'transmission_slip', confidence: 0.85 },
      { condition: ['rough_ride', 'uneven_tire_wear'], result: 'suspension_issues', confidence: 0.75 },
      { condition: ['battery_drain', 'starting_issues'], result: 'electrical_issues', confidence: 0.8 }
    ]

    console.log('🤖 IA de Diagnóstico inicializada')
  }

  async diagnoseSymptoms(symptoms: VehicleSymptom[], vehicleData: VehicleData): Promise<DiagnosticResult[]> {
    const results: DiagnosticResult[] = []
    const symptomIds = symptoms.map(s => s.description.toLowerCase().replace(/\s+/g, '_'))

    for (const rule of this.diagnosticRules) {
      const matchedSymptoms = rule.condition.filter(condition => 
        symptomIds.some(symptom => symptom.includes(condition))
      )

      if (matchedSymptoms.length >= Math.floor(rule.condition.length * 0.6)) {
        const problem = this.knowledgeBase.get(rule.result)
        if (problem) {
          const diagnosticResult = this.createDiagnosticResult(problem, rule.confidence, vehicleData, symptoms)
          results.push(diagnosticResult)
        }
      }
    }

    results.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      if (a.severity !== b.severity) {
        return severityOrder[b.severity] - severityOrder[a.severity]
      }
      return b.confidence - a.confidence
    })

    return results.slice(0, 5)
  }

  private createDiagnosticResult(
    problem: any, 
    baseConfidence: number, 
    vehicleData: VehicleData,
    symptoms: VehicleSymptom[]
  ): DiagnosticResult {
    let adjustedConfidence = baseConfidence

    const vehicleAge = new Date().getFullYear() - vehicleData.year
    if (vehicleAge > 10) adjustedConfidence += 0.1
    if (vehicleData.mileage > 100000) adjustedConfidence += 0.1

    adjustedConfidence = Math.min(0.95, adjustedConfidence)

    const costMultiplier = vehicleAge > 15 ? 1.2 : 1.0
    const adjustedCost = {
      min: Math.round(problem.avgCost.min * costMultiplier),
      max: Math.round(problem.avgCost.max * costMultiplier)
    }

    const urgency = this.determineUrgency(problem.severity, symptoms)

    return {
      id: `diag_${problem.id}_${Date.now()}`,
      confidence: Math.round(adjustedConfidence * 100) / 100,
      problemName: problem.name,
      description: `Baseado nos sintomas do seu ${vehicleData.make} ${vehicleData.model} ${vehicleData.year}, detectamos possível ${problem.name.toLowerCase()}.`,
      category: problem.category,
      severity: problem.severity,
      estimatedCost: adjustedCost,
      urgency,
      possibleCauses: this.generateCauses(problem),
      recommendedActions: this.generateRecommendations(problem, urgency),
      preventiveMeasures: this.generatePreventiveMeasures(problem),
      estimatedRepairTime: this.estimateRepairTime(problem.complexity),
      complexity: problem.complexity,
      partsNeeded: this.generatePartsNeeded(problem),
      relatedSystems: this.getRelatedSystems(problem.category)
    }
  }

  private determineUrgency(severity: string, symptoms: VehicleSymptom[]): 'can_wait' | 'soon' | 'urgent' | 'immediate' {
    const criticalSymptoms = symptoms.filter(s => s.severity === 'critical')
    if (criticalSymptoms.length > 0 || severity === 'critical') return 'immediate'
    if (severity === 'high') return 'urgent'
    if (severity === 'medium') return 'soon'
    return 'can_wait'
  }

  private generateCauses(problem: any): string[] {
    const causesMap: Record<string, string[]> = {
      engine_misfire: ['Velas de ignição desgastadas', 'Bobinas de ignição com defeito', 'Injetores sujos'],
      brake_wear: ['Pastilhas de freio desgastadas', 'Discos empenados', 'Fluido baixo'],
      transmission_slip: ['Fluido baixo', 'Embreagem desgastada', 'Componentes internos'],
      suspension_issues: ['Amortecedores desgastados', 'Molas fracas', 'Buchas deterioradas'],
      electrical_issues: ['Alternador defeituoso', 'Bateria antiga', 'Problemas na fiação']
    }
    return causesMap[problem.id] || ['Causa a ser investigada']
  }

  private generateRecommendations(problem: any, urgency: string): string[] {
    const urgencyActions: Record<string, string[]> = {
      immediate: ['Pare de dirigir', 'Procure emergência'],
      urgent: ['Agende em 1-2 dias', 'Evite viagens longas'],
      soon: ['Agende em 2 semanas', 'Monitore sintomas'],
      can_wait: ['Próxima manutenção', 'Inspeção preventiva']
    }
    return urgencyActions[urgency] || []
  }

  private generatePreventiveMeasures(problem: any): string[] {
    const preventive: Record<string, string[]> = {
      engine_misfire: ['Troca regular de velas', 'Combustível de qualidade'],
      brake_wear: ['Verificação do fluido', 'Evitar frenagens bruscas'],
      transmission_slip: ['Troca do óleo', 'Direção suave'],
      suspension_issues: ['Evitar buracos', 'Carga adequada'],
      electrical_issues: ['Manutenção da bateria', 'Verificação da carga']
    }
    return preventive[problem.id] || ['Manutenção preventiva']
  }

  private estimateRepairTime(complexity: string): string {
    const timeMap: Record<string, string> = {
      simple: '1-2 horas',
      moderate: '3-6 horas',
      complex: '1-2 dias',
      specialist: '2-5 dias'
    }
    return timeMap[complexity] || '1 dia'
  }

  private generatePartsNeeded(problem: any): Array<any> {
    const partsMap: Record<string, Array<any>> = {
      engine_misfire: [{ name: 'Velas de ignição', category: 'ignition', estimatedCost: 80, urgency: true }],
      brake_wear: [{ name: 'Pastilhas de freio', category: 'brake', estimatedCost: 150, urgency: true }],
      transmission_slip: [{ name: 'Fluido da transmissão', category: 'transmission', estimatedCost: 80, urgency: true }],
      suspension_issues: [{ name: 'Amortecedores', category: 'suspension', estimatedCost: 400, urgency: false }],
      electrical_issues: [{ name: 'Bateria', category: 'electrical', estimatedCost: 200, urgency: true }]
    }
    return partsMap[problem.id] || []
  }

  private getRelatedSystems(category: string): string[] {
    const relatedMap: Record<string, string[]> = {
      engine: ['ignition', 'fuel', 'cooling'],
      brake: ['hydraulic', 'suspension'],
      transmission: ['engine', 'clutch'],
      suspension: ['tire', 'steering'],
      electrical: ['ignition', 'charging']
    }
    return relatedMap[category] || []
  }

  generateInsights(maintenanceHistory: any[]): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = []

    if (maintenanceHistory.length >= 3) {
      const avgCost = maintenanceHistory.reduce((sum, item) => sum + (item.cost || 0), 0) / maintenanceHistory.length

      insights.push({
        id: 'cost_trend_' + Date.now(),
        type: 'cost_trend',
        title: 'Tendência de Custos',
        description: `Seus custos médios de manutenção são de R$ ${avgCost.toFixed(2)}`,
        impact: avgCost > 500 ? 'negative' : avgCost < 200 ? 'positive' : 'neutral',
        actionable: avgCost > 500,
        recommendedAction: avgCost > 500 ? 'Considere manutenção preventiva' : undefined,
        confidence: 0.8,
        dataPoints: maintenanceHistory.slice(-6).map((item, index) => ({
          date: item.date || new Date().toISOString(),
          value: item.cost || 0,
          label: `Período ${index + 1}`
        }))
      })
    }

    insights.push({
      id: 'predictive_maintenance_' + Date.now(),
      type: 'predictive_maintenance',
      title: 'Manutenção Preditiva',
      description: 'Recomendamos uma revisão preventiva baseada no padrão de uso',
      impact: 'positive',
      actionable: true,
      recommendedAction: 'Agende uma revisão de 10.000km',
      confidence: 0.75,
      dataPoints: [{
        date: new Date().toISOString(),
        value: 6,
        label: 'Meses desde última revisão'
      }]
    })

    return insights
  }
}

export function useAIDiagnostic() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [diagnosticEngine] = useState(() => new AIDiagnosticEngine())

  const diagnose = useCallback(async (
    symptoms: VehicleSymptom[], 
    vehicleData: VehicleData
  ): Promise<DiagnosticResult[]> => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const results = await diagnosticEngine.diagnoseSymptoms(symptoms, vehicleData)
      console.log('🤖 Diagnóstico IA completado:', results.length, 'problemas')
      return results
    } catch (error) {
      console.error('❌ Erro no diagnóstico IA:', error)
      return []
    } finally {
      setIsProcessing(false)
    }
  }, [diagnosticEngine])

  const generateInsights = useCallback((maintenanceHistory: any[]): AnalyticsInsight[] => {
    return diagnosticEngine.generateInsights(maintenanceHistory)
  }, [diagnosticEngine])

  return {
    diagnose,
    generateInsights,
    isProcessing
  }
}

export default AIDiagnosticEngine
