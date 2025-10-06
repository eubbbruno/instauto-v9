'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ChatList from '@/components/chat/ChatList'
import { PageTransition, CardTransition } from '@/components/ui/PageTransition'
import { ChatBubbleLeftRightIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function MensagensClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all')

  const tabs = [
    { id: 'all', label: 'Todas', icon: ChatBubbleLeftRightIcon },
    { id: 'unread', label: 'Não Lidas', icon: ClockIcon },
    { id: 'archived', label: 'Arquivadas', icon: UserGroupIcon },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Central de Mensagens
                </h1>
                <p className="text-gray-600 mt-1">
                  Gerencie todas as suas conversas em um só lugar
                </p>
              </div>
              
              {/* Stats */}
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-500">Conversas Ativas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-xs text-gray-500">Não Lidas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat List */}
            <div className="lg:col-span-2">
              <CardTransition>
                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                      {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                              activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                          </button>
                        )
                      })}
                    </nav>
                  </div>
                </div>

                {/* Chat List Component */}
                <ChatList />
              </CardTransition>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <CardTransition delay={0.1}>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Dicas de Comunicação
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <span className="text-blue-600 text-sm">💬</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Seja Claro</h4>
                        <p className="text-gray-600 text-xs">
                          Descreva detalhadamente o problema ou serviço desejado
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <span className="text-green-600 text-sm">⚡</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Responda Rápido</h4>
                        <p className="text-gray-600 text-xs">
                          Respostas rápidas melhoram a experiência do cliente
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <span className="text-purple-600 text-sm">📸</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Use Imagens</h4>
                        <p className="text-gray-600 text-xs">
                          Fotos ajudam a entender melhor o problema
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardTransition>

              <CardTransition delay={0.2}>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Chat em Tempo Real
                  </h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Converse instantaneamente com motoristas e oficinas. 
                    Receba notificações em tempo real.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Sistema Online</span>
                  </div>
                </div>
              </CardTransition>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
