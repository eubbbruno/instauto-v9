// Forçar rota como dinâmica para evitar SSR
export const dynamic = 'force-dynamic'

import OficinaFreeClient from './OficinaFreeClient'
import { RouteProtection } from '@/components/auth/RouteProtection'

export default function OficinaFreePage() {
  return (
    <RouteProtection allowedUserTypes={['oficina']}>
      <OficinaFreeClient />
    </RouteProtection>
  )
}