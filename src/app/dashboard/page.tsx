"use client";

import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  CogIcon,
  PlusIcon,
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" notificationCount={1} />
      
      {/* Content */}
      <div className="p-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Olá, Carlos!</h2>
              <p className="text-neutral-gray-600">
                Bem-vindo ao seu painel de controle. Aqui está o resumo de hoje.
              </p>
            </div>
            <button className="btn-primary flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" />
              Nova Ordem
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            { 
              label: "Ordens Abertas", 
              value: "12", 
              change: "+2 hoje",
              trend: "up",
              color: "bg-amber-100 text-amber-800"
            },
            { 
              label: "Faturamento do Mês", 
              value: "R$ 25.840", 
              change: "+15% vs. mês anterior",
              trend: "up",
              color: "bg-green-100 text-green-800"
            },
            { 
              label: "Agendamentos", 
              value: "8", 
              change: "para hoje",
              trend: "neutral",
              color: "bg-blue-100 text-blue-800"
            },
            { 
              label: "Avaliação Média", 
              value: "4.8", 
              change: "-0.1 esta semana",
              trend: "down",
              color: "bg-purple-100 text-purple-800"
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-md ${stat.color}`}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <rect width="24" height="24" rx="4" />
                  </svg>
                </div>
                {stat.trend === "up" && (
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    <span>{stat.change}</span>
                  </div>
                )}
                {stat.trend === "down" && (
                  <div className="flex items-center text-red-600 text-sm">
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                    <span>{stat.change}</span>
                  </div>
                )}
                {stat.trend === "neutral" && (
                  <div className="text-neutral-gray-500 text-sm">
                    {stat.change}
                  </div>
                )}
              </div>
              <h3 className="text-neutral-gray-600 text-sm mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
        
        {/* Main Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Ordens de Serviço Recentes</h3>
              <Link href="/dashboard/ordens" className="text-[var(--primary-blue)] text-sm hover:underline">
                Ver todas
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-neutral-gray-500 text-sm border-b">
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Serviço</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Valor</th>
                    <th className="pb-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      client: "João Silva", 
                      vehicle: "Honda Civic - ABC-1234",
                      service: "Troca de Óleo", 
                      status: "Em andamento", 
                      statusColor: "bg-yellow-100 text-yellow-800",
                      value: "R$ 150,00" 
                    },
                    { 
                      client: "Maria Santos", 
                      vehicle: "Toyota Corolla - DEF-5678",
                      service: "Revisão Completa", 
                      status: "Concluído", 
                      statusColor: "bg-green-100 text-green-800",
                      value: "R$ 850,00" 
                    },
                    { 
                      client: "Pedro Oliveira", 
                      vehicle: "Fiat Uno - GHI-9012",
                      service: "Freios", 
                      status: "Aguardando peças", 
                      statusColor: "bg-blue-100 text-blue-800",
                      value: "R$ 420,00" 
                    },
                    { 
                      client: "Ana Pereira", 
                      vehicle: "VW Gol - JKL-3456",
                      service: "Diagnóstico", 
                      status: "Aberto", 
                      statusColor: "bg-gray-100 text-gray-800",
                      value: "R$ 100,00" 
                    },
                  ].map((order, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-4">
                        <div className="font-medium">{order.client}</div>
                        <div className="text-sm text-neutral-gray-500">{order.vehicle}</div>
                      </td>
                      <td className="py-4">{order.service}</td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 font-medium">{order.value}</td>
                      <td className="py-4">
                        <button className="text-[var(--primary-blue)] text-sm hover:underline">Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Próximos Agendamentos</h3>
                <Link href="/dashboard/agendamentos" className="text-[var(--primary-blue)] text-sm hover:underline">
                  Ver todos
                </Link>
              </div>
              
              <div className="space-y-4">
                {[
                  { 
                    time: "10:00", 
                    client: "Roberto Almeida", 
                    service: "Alinhamento e Balanceamento" 
                  },
                  { 
                    time: "11:30", 
                    client: "Camila Mendes", 
                    service: "Troca de Óleo" 
                  },
                  { 
                    time: "14:00", 
                    client: "Felipe Santos", 
                    service: "Revisão" 
                  },
                ].map((appointment, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 rounded-md hover:bg-neutral-gray-50">
                    <div className="min-w-[50px] text-center">
                      <div className="text-sm font-medium text-neutral-gray-900">{appointment.time}</div>
                      <div className="text-xs text-neutral-gray-500">Hoje</div>
                    </div>
                    <div>
                      <div className="font-medium">{appointment.client}</div>
                      <div className="text-sm text-neutral-gray-500">{appointment.service}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Avaliações Recentes</h3>
                <Link href="/dashboard/avaliacoes" className="text-[var(--primary-blue)] text-sm hover:underline">
                  Ver todas
                </Link>
              </div>
              
              <div className="space-y-4">
                {[
                  { 
                    rating: 5, 
                    client: "Rafael Moreira", 
                    comment: "Excelente atendimento e serviço rápido. Recomendo!",
                    time: "Hoje" 
                  },
                  { 
                    rating: 4, 
                    client: "Luisa Costa", 
                    comment: "Bom serviço, mas demorou um pouco mais que o esperado.",
                    time: "Ontem" 
                  },
                ].map((review, i) => (
                  <div key={i} className="p-3 rounded-md hover:bg-neutral-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-gray-300"></div>
                        <div className="font-medium">{review.client}</div>
                      </div>
                      <div className="text-xs text-neutral-gray-500">{review.time}</div>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, index) => (
                        index < review.rating ? (
                          <StarIconSolid key={index} className="h-4 w-4 text-[var(--primary-yellow)]" />
                        ) : (
                          <StarIconSolid key={index} className="h-4 w-4 text-neutral-gray-300" />
                        )
                      ))}
                    </div>
                    <p className="text-sm text-neutral-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 