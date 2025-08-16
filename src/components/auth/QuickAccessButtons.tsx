'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  UserIcon, 
  WrenchScrewdriverIcon, 
  StarIcon as CrownIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

interface QuickAccessButtonsProps {
  currentUserType: 'motorista' | 'oficina'
  onUserTypeChange: (type: 'motorista' | 'oficina') => void
  className?: string
}

export default function QuickAccessButtons({ 
  currentUserType, 
  onUserTypeChange, 
  className = '' 
}: QuickAccessButtonsProps) {
  
  const quickActions = [
    {
      id: 'demo',
      title: 'Testar Demo',
      description: 'Ver demonstração',
      href: '/demonstracao',
      icon: PlayIcon,
      color: 'gray'
    },
    {
      id: 'motorista-demo',
      title: 'Login Motorista',
      description: 'motorista@demo.com',
      href: '/login?email=motorista@demo.com&password=demo123',
      icon: UserIcon,
      color: 'blue'
    },
    {
      id: 'oficina-demo',
      title: 'Login Oficina',
      description: 'oficina.free@demo.com',
      href: '/login?email=oficina.free@demo.com&password=demo123',
      icon: WrenchScrewdriverIcon,
      color: 'yellow'
    },
    {
      id: 'admin-demo',
      title: 'Login Admin',
      description: 'admin@instauto.com.br',
      href: '/login?email=admin@instauto.com.br&password=InstaAuto@2024',
      icon: CrownIcon,
      color: 'purple'
    }
  ]

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Seletor de Tipo de Usuário */}
      <div className="bg-gray-50 rounded-xl p-1 grid grid-cols-2 gap-1">
        <button
          onClick={() => onUserTypeChange('motorista')}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            currentUserType === 'motorista'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <UserIcon className="w-4 h-4 inline mr-1" />
          Motorista
        </button>
        <button
          onClick={() => onUserTypeChange('oficina')}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            currentUserType === 'oficina'
              ? 'bg-white text-yellow-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <WrenchScrewdriverIcon className="w-4 h-4 inline mr-1" />
          Oficina
        </button>
      </div>

      {/* Ações Rápidas */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Acesso Rápido
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            const colorClasses = {
              gray: 'border-gray-200 text-gray-600 hover:bg-gray-50',
              blue: 'border-blue-200 text-blue-600 hover:bg-blue-50',
              yellow: 'border-yellow-200 text-yellow-600 hover:bg-yellow-50',
              purple: 'border-purple-200 text-purple-600 hover:bg-purple-50'
            }
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className={`
                    block p-3 border rounded-lg transition-all group
                    ${colorClasses[action.color as keyof typeof colorClasses]}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium leading-tight">
                        {action.title}
                      </div>
                      <div className="text-xs opacity-70 leading-tight">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Links Úteis */}
      <div className="pt-2 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Link 
            href="/cobertura" 
            className="text-gray-500 hover:text-gray-700 text-center py-1"
          >
            📍 Cobertura
          </Link>
          <Link 
            href="/contato" 
            className="text-gray-500 hover:text-gray-700 text-center py-1"
          >
            💬 Contato
          </Link>
          <Link 
            href="/oficinas" 
            className="text-gray-500 hover:text-gray-700 text-center py-1"
          >
            🔧 Para Oficinas
          </Link>
          <Link 
            href="/motoristas" 
            className="text-gray-500 hover:text-gray-700 text-center py-1"
          >
            🚗 Para Motoristas
          </Link>
        </div>
      </div>
    </div>
  )
}
