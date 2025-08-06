// Forçar rota como dinâmica para evitar SSR
export const dynamic = 'force-dynamic'

import OficinaProClient from './OficinaProClient'

export default function OficinaProPage() {
  return <OficinaProClient />
}