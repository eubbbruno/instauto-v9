// Forçar rota como dinâmica para evitar SSR
export const dynamic = 'force-dynamic'

import OficinaProClient from './OficinaProClient'
import RouteProtection from '@/components/auth/RouteProtection'

export default function OficinaProPage() {
  return (
    <RouteProtection allowedTypes={['oficina']}>
      <OficinaProClient />
    </RouteProtection>
  )
}