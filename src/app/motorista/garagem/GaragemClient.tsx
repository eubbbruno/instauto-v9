'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
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
  ArrowUpIcon
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
  const [veiculos, setVeiculos] = useState<Veiculo[]>([
    {
      id: 1,
      modelo: "Civic",
      marca: "Honda",
      ano: "2020",
      placa: "ABC-1234",
      cor: "Prata",
      km: "35.450",
      combustivel: "Flex",
      ultimaRevisao: "15/05/2023",
      proximaRevisao: "15/11/2023",
      seguro: {
        possui: true,
        empresa: "Seguradora XYZ",
        vigencia: "01/01/2023 a 01/01/2024"
      },
      manutencoes: [
        { id: 1, tipo: "Troca de óleo", data: "15/05/2023", km: "33.200", valor: 180, oficina: "Auto Center Silva" },
        { id: 2, tipo: "Alinhamento", data: "02/03/2023", km: "31.500", valor: 120, oficina: "Pneus & Rodas" }
      ],
      documentos: [
        { id: 1, tipo: "CRLV", numero: "123456789", validade: "31/12/2023" },
        { id: 2, tipo: "Seguro", numero: "POL789123", validade: "01/01/2024" }
      ],
      chassi: "9BWZZZ377VT004251",
      renavam: "12345678901"
    },
    {
      id: 2,
      modelo: "Uno",
      marca: "Fiat",
      ano: "2018",
      placa: "XYZ-9876",
      cor: "Vermelho",
      km: "65.800",
      combustivel: "Etanol",
      ultimaRevisao: "10/06/2023",
      proximaRevisao: "10/12/2023",
      seguro: {
        possui: false
      },
      manutencoes: [
        { id: 3, tipo: "Troca de pneus", data: "20/04/2023", km: "64.200", valor: 480, oficina: "Pneustore" }
      ],
      documentos: [
        { id: 3, tipo: "CRLV", numero: "987654321", validade: "31/12/2023" }
      ],
      chassi: "9BD15902040123456",
      renavam: "98765432109"
    }
  ])

  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null)
  const [showModal, setShowModal] = useState(false)

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
        userName="Motorista"
        userEmail="motorista@email.com"
        onLogout={() => {}}
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
              onClick={() => setShowModal(true)}
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
            <div className="p-6 max-w-7xl mx-auto">

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
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {veiculos.map((veiculo, index) => (
                  <motion.div
                    key={veiculo.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {/* Header do Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                      <div className="flex justify-between items-start">
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
    </div>
  )
}