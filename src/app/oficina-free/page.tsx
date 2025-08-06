// Forçar rota como dinâmica para evitar SSR
export const dynamic = 'force-dynamic'

import OficinaFreeClient from './OficinaFreeClient'

export default function OficinaFreePage() {
  return <OficinaFreeClient />
}