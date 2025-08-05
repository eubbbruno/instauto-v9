// Forçar rota como dinâmica para evitar SSR
export const dynamic = 'force-dynamic'

import MotoristaClient from './MotoristaClient'

export default function MotoristaPage() {
  return <MotoristaClient />
}