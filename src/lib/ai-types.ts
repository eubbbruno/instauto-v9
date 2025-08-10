export interface VehicleSymptom {
  id: string
  category: 'engine' | 'brake' | 'suspension' | 'electrical' | 'transmission' | 'tire' | 'other'
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant'
}

export interface DiagnosticResult {
  id: string
  confidence: number
  problemName: string
  description: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  estimatedCost: {
    min: number
    max: number
  }
  urgency: 'can_wait' | 'soon' | 'urgent' | 'immediate'
  possibleCauses: string[]
  recommendedActions: string[]
  preventiveMeasures: string[]
  estimatedRepairTime: string
  complexity: 'simple' | 'moderate' | 'complex' | 'specialist'
  partsNeeded: Array<{
    name: string
    category: string
    estimatedCost: number
    urgency: boolean
  }>
  relatedSystems: string[]
}

export interface VehicleData {
  make: string
  model: string
  year: number
  mileage: number
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  transmissionType: 'manual' | 'automatic'
  engineSize?: string
}

export interface AnalyticsInsight {
  id: string
  type: 'cost_trend' | 'maintenance_pattern' | 'performance_alert' | 'predictive_maintenance'
  title: string
  description: string
  impact: 'positive' | 'neutral' | 'negative'
  actionable: boolean
  recommendedAction?: string
  confidence: number
  dataPoints: Array<{
    date: string
    value: number
    label: string
  }>
}
