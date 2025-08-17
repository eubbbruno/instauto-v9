// Forçar rota como dinâmica para evitar SSR
export const dynamic = 'force-dynamic'

import MotoristaClient from './MotoristaClient'
import RouteProtection from '@/components/auth/RouteProtection'

export default function MotoristaPage() {
  return (
    <RouteProtection allowedTypes={['motorista']}>
      <MotoristaClient />
    </RouteProtection>
  )
}