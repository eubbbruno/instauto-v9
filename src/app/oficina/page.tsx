// Forçar rota como dinâmica para evitar SSR
export const dynamic = 'force-dynamic'

import OficinaClient from './OficinaClient'

export default function OficinaPage() {
  return <OficinaClient />
}