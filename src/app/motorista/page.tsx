// Forçar rota como dinâmica para evitar SSR
export const dynamic = 'force-dynamic'

import MotoristaClient from './MotoristaClient'
import RouteProtection from '@/components/auth/RouteProtection'
import { ToastAdvancedProvider } from '@/components/ui/ToastAdvanced'

export default function MotoristaPage() {
  return (
    <ToastAdvancedProvider>
      <RouteProtection allowedTypes={['motorista']}>
        <MotoristaClient />
      </RouteProtection>
    </ToastAdvancedProvider>
  )
}