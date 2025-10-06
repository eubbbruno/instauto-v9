import ChatList from '@/components/chat/ChatList'
import { PageTransition, CardTransition } from '@/components/ui/PageTransition'

export default function MotoristaMensagensPage() {
  return (
    <PageTransition>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
          <p className="text-gray-600">Converse com oficinas em tempo real</p>
        </div>
        
        <CardTransition>
          <ChatList />
        </CardTransition>
      </div>
    </PageTransition>
  )
}