'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon,
  TruckIcon,
  BellIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  ArrowUpIcon,
  PhotoIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Manutencao {
  id: number
  tipo: string
  data: string
  km: string
  valor: number
  oficina: string
  observacoes?: string
}

interface Documento {
  id: number
  tipo: string
  numero: string
  validade: string
  arquivo?: string
}

interface Veiculo {
  id: number
  modelo: string
  marca: string
  ano: string
  placa: string
  cor: string
  km: string
  combustivel: string
  ultimaRevisao: string
  proximaRevisao: string
  seguro: {
    possui: boolean
    empresa?: string
    vigencia?: string
  }
  manutencoes: Manutencao[]
  documentos: Documento[]
  foto?: string
  chassi?: string
  renavam?: string
}

export default function GaragemClient() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false)
  const [vehicleFormData, setVehicleFormData] = useState<Partial<Veiculo>>({})
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    }
  }

  // Upload de fotos
  const handlePhotoUpload = (veiculoId: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string
      setVeiculos(prev => prev.map(v => 
        v.id === veiculoId 
          ? { ...v, foto: photoUrl }
          : v
      ))
    }
    reader.readAsDataURL(file)
  }

  // Adicionar novo veículo
  const addVehicle = (vehicleData: Partial<Veiculo>) => {
    const newVehicle: Veiculo = {
      id: Date.now(),
      modelo: vehicleData.modelo || '',
      marca: vehicleData.marca || '',
      ano: vehicleData.ano || '',
      placa: vehicleData.placa || '',
      cor: vehicleData.cor || '',
      km: vehicleData.km || '0',
      combustivel: vehicleData.combustivel || '',
      ultimaRevisao: '',
      proximaRevisao: '',
      seguro: { possui: false },
      manutencoes: [],
      documentos: [],
      foto: vehicleData.foto
    }
    setVeiculos(prev => [...prev, newVehicle])
    setShowAddVehicleModal(false)
    setVehicleFormData({})
  }

  const getTotalGastos = () => {
    return veiculos.reduce((total, veiculo) => 
      total + veiculo.manutencoes.reduce((sub, manut) => sub + manut.valor, 0), 0
    )
  }

  const getProximasRevisoes = () => {
    return veiculos.filter(v => {
      const hoje = new Date()
      const proximaRevisao = new Date(v.proximaRevisao.split('/').reverse().join('-'))
      const diffTime = proximaRevisao.getTime() - hoje.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays > 0
    })
  }

  const getDocumentosVencendo = () => {
    const docs: Array<{doc: Documento, veiculo: Veiculo}> = []
    veiculos.forEach(veiculo => {
      veiculo.documentos.forEach(doc => {
        const hoje = new Date()
        const validade = new Date(doc.validade.split('/').reverse().join('-'))
        const diffTime = validade.getTime() - hoje.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays <= 30 && diffDays > 0) {
          docs.push({ doc, veiculo })
        }
      })
    })
    return docs
  }

  const proximasRevisoes = getProximasRevisoes()
  const documentosVencendo = getDocumentosVencendo()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="motorista"
        userName={profile?.name || user?.email?.split('@')[0] || 'Motorista'}
        userEmail={user?.email || 'email@email.com'}
        onLogout={async () => {
          await supabase.auth.signOut()
          window.location.href = '/login'
        }}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🚗 Minha Garagem</h1>
              <p className="text-gray-600">Gerencie seus veículos e histórico de manutenções</p>
            </div>
            <button 
              onClick={() => setShowAddVehicleModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Adicionar Veículo
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Stats Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total de Veículos</p>
                      <p className="text-3xl font-bold text-blue-600">{veiculos.length}</p>
                    </div>
                    <TruckIcon className="w-12 h-12 text-blue-600 opacity-20" />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Gastos Totais</p>
                      <p className="text-3xl font-bold text-green-600">R$ {getTotalGastos().toLocaleString()}</p>
                    </div>
                    <div className="flex items-center text-green-600 text-sm">
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                      <span>+12%</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Revisões Próximas</p>
                      <p className="text-3xl font-bold text-orange-600">{proximasRevisoes.length}</p>
                    </div>
                    <CalendarDaysIcon className="w-12 h-12 text-orange-600 opacity-20" />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Docs Vencendo</p>
                      <p className="text-3xl font-bold text-red-600">{documentosVencendo.length}</p>
                    </div>
                    <DocumentTextIcon className="w-12 h-12 text-red-600 opacity-20" />
                  </div>
                </motion.div>
              </div>

              {/* Alertas */}
              {(proximasRevisoes.length > 0 || documentosVencendo.length > 0) && (
                <motion.div 
                  className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-800">Atenção Necessária</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proximasRevisoes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">Revisões Próximas:</h4>
                        {proximasRevisoes.map(veiculo => (
                          <p key={veiculo.id} className="text-yellow-700 text-sm">
                            • {veiculo.marca} {veiculo.modelo} - {veiculo.proximaRevisao}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {documentosVencendo.length > 0 && (
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">Documentos Vencendo:</h4>
                        {documentosVencendo.map(({doc, veiculo}) => (
                          <p key={`${veiculo.id}-${doc.id}`} className="text-yellow-700 text-sm">
                            • {veiculo.placa} - {doc.tipo} ({doc.validade})
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Lista de Veículos */}
              {veiculos.length === 0 ? (
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum veículo cadastrado</h3>
                  <p className="text-gray-600 mb-6">Adicione seu primeiro veículo para começar a gerenciar sua garagem</p>
                  <button 
                    onClick={() => setShowAddVehicleModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2 mx-auto transition-all"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Adicionar Primeiro Veículo
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {veiculos.map((veiculo, index) => (
                  <motion.div
                    key={veiculo.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {                    /* Foto do Veículo */}
                    <div className="relative">
                      {veiculo.foto ? (
                        <img 
                          src={veiculo.foto} 
                          alt={`${veiculo.marca} ${veiculo.modelo}`}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                          <TruckIcon className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <div className="absolute top-2 right-2">
                        <label className="cursor-pointer p-2 bg-black/20 rounded-lg hover:bg-black/30 transition-all backdrop-blur-sm">
                          <PhotoIcon className="w-5 h-5 text-white" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handlePhotoUpload(veiculo.id, file)
                            }}
                          />
                        </label>
                      </div>

                      {/* Header do Card - Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {veiculo.marca} {veiculo.modelo}
                            </h3>
                            <p className="text-blue-100">{veiculo.ano} • {veiculo.placa}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all">
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all">
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Cor</p>
                          <p className="font-medium">{veiculo.cor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">KM</p>
                          <p className="font-medium">{veiculo.km}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Combustível</p>
                          <p className="font-medium">{veiculo.combustivel}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Última Revisão</p>
                          <p className="font-medium">{veiculo.ultimaRevisao}</p>
                        </div>
                      </div>

                      {/* Status do Seguro */}
                      <div className={`p-3 rounded-lg mb-4 ${
                        veiculo.seguro.possui 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            veiculo.seguro.possui ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            veiculo.seguro.possui ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {veiculo.seguro.possui ? 'Seguro Ativo' : 'Sem Seguro'}
                          </span>
                        </div>
                        {veiculo.seguro.empresa && (
                          <p className="text-xs text-green-600 mt-1">{veiculo.seguro.empresa}</p>
                        )}
                      </div>

                      {/* Resumo de Manutenções */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {veiculo.manutencoes.length} manutenções
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            R$ {veiculo.manutencoes.reduce((sum, m) => sum + m.valor, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Botão Ver Detalhes */}
                      <button 
                        onClick={() => setSelectedVeiculo(veiculo)}
                        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                      >
                        Ver Detalhes Completos
                      </button>
                    </div>
                  </motion.div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/motorista/buscar">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <WrenchScrewdriverIcon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Buscar Oficinas</h3>
                        <p className="text-sm text-gray-600">Encontre oficinas próximas</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/motorista/agendamentos">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <CalendarDaysIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Agendar Serviço</h3>
                        <p className="text-sm text-gray-600">Marque uma manutenção</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/motorista/historico">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Histórico</h3>
                        <p className="text-sm text-gray-600">Ver todos os serviços</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Veículo */}
      {selectedVeiculo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedVeiculo.marca} {selectedVeiculo.modelo}
              </h2>
              <button 
                onClick={() => setSelectedVeiculo(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informações Gerais</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Placa:</span>
                      <span className="font-medium">{selectedVeiculo.placa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ano:</span>
                      <span className="font-medium">{selectedVeiculo.ano}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cor:</span>
                      <span className="font-medium">{selectedVeiculo.cor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">KM:</span>
                      <span className="font-medium">{selectedVeiculo.km}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Combustível:</span>
                      <span className="font-medium">{selectedVeiculo.combustivel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chassi:</span>
                      <span className="font-medium">{selectedVeiculo.chassi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Renavam:</span>
                      <span className="font-medium">{selectedVeiculo.renavam}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Documentos</h3>
                  <div className="space-y-3">
                    {selectedVeiculo.documentos.map(doc => (
                      <div key={doc.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{doc.tipo}</p>
                            <p className="text-sm text-gray-600">{doc.numero}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {doc.validade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Histórico de Manutenções */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Histórico de Manutenções</h3>
                <div className="space-y-4">
                  {selectedVeiculo.manutencoes.map(manutencao => (
                    <div key={manutencao.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{manutencao.tipo}</p>
                          <p className="text-sm text-gray-600">{manutencao.oficina}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">R$ {manutencao.valor}</p>
                          <p className="text-sm text-gray-500">{manutencao.data}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">KM: {manutencao.km}</p>
                      {manutencao.observacoes && (
                        <p className="text-sm text-gray-500 mt-2">{manutencao.observacoes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Adicionar Veículo */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Adicionar Novo Veículo</h2>
              <button 
                onClick={() => setShowAddVehicleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault()
                addVehicle(vehicleFormData)
              }} className="space-y-6">
                
                {/* Upload de Foto */}
                <div className="text-center">
                  <div className="relative mx-auto w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    {vehicleFormData.foto ? (
                      <img 
                        src={vehicleFormData.foto} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <CameraIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <label className="absolute inset-0 cursor-pointer hover:bg-black/10 transition-all flex items-center justify-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              setVehicleFormData(prev => ({
                                ...prev,
                                foto: e.target?.result as string
                              }))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      {!vehicleFormData.foto && (
                        <span className="text-gray-500 text-sm">Adicionar Foto</span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={vehicleFormData.marca || ''}
                      onChange={(e) => setVehicleFormData(prev => ({ ...prev, marca: e.target.value }))}
                      placeholder="Honda, Toyota, Volkswagen..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={vehicleFormData.modelo || ''}
                      onChange={(e) => setVehicleFormData(prev => ({ ...prev, modelo: e.target.value }))}
                      placeholder="Civic, Corolla, Gol..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={vehicleFormData.ano || ''}
                      onChange={(e) => setVehicleFormData(prev => ({ ...prev, ano: e.target.value }))}
                      placeholder="2020, 2019..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Placa</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={vehicleFormData.placa || ''}
                      onChange={(e) => setVehicleFormData(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))}
                      placeholder="ABC-1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={vehicleFormData.cor || ''}
                      onChange={(e) => setVehicleFormData(prev => ({ ...prev, cor: e.target.value }))}
                      placeholder="Branco, Prata, Preto..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Combustível</label>
                    <select
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={vehicleFormData.combustivel || ''}
                      onChange={(e) => setVehicleFormData(prev => ({ ...prev, combustivel: e.target.value }))}
                    >
                      <option value="">Selecionar...</option>
                      <option value="Flex">Flex</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Etanol">Etanol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Elétrico">Elétrico</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quilometragem Atual</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={vehicleFormData.km || ''}
                    onChange={(e) => setVehicleFormData(prev => ({ ...prev, km: e.target.value }))}
                    placeholder="Ex: 45.000"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddVehicleModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Adicionar Veículo
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}