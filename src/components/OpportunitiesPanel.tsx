"use client";

import { MapPinIcon, ClockIcon, CurrencyDollarIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type Opportunity = {
  id: string;
  customer: {
    name: string;
    rating: number;
    distance: string;
  };
  service: {
    type: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
  estimatedValue: number;
  createdAt: string;
};

type OpportunitiesPanelProps = {
  opportunities?: Opportunity[];
  limit?: number;
};

// Dados de exemplo
const mockOpportunities: Opportunity[] = [
  {
    id: "OP-2023-001",
    customer: {
      name: "Ricardo Almeida",
      rating: 4.8,
      distance: "3,2 km"
    },
    service: {
      type: "Revisão",
      description: "Revisão completa 30.000km",
      urgency: 'medium'
    },
    vehicle: {
      make: "Toyota",
      model: "Corolla",
      year: 2020
    },
    estimatedValue: 850,
    createdAt: "2023-10-17T14:30:00Z"
  },
  {
    id: "OP-2023-002",
    customer: {
      name: "Amanda Souza",
      rating: 5,
      distance: "1,5 km"
    },
    service: {
      type: "Reparo",
      description: "Barulho na suspensão dianteira",
      urgency: 'high'
    },
    vehicle: {
      make: "Honda",
      model: "Civic",
      year: 2019
    },
    estimatedValue: 450,
    createdAt: "2023-10-17T13:15:00Z"
  },
  {
    id: "OP-2023-003",
    customer: {
      name: "Bruno Ferreira",
      rating: 4.2,
      distance: "4,8 km"
    },
    service: {
      type: "Diagnóstico",
      description: "Luz do motor acesa",
      urgency: 'high'
    },
    vehicle: {
      make: "Volkswagen",
      model: "Golf",
      year: 2018
    },
    estimatedValue: 200,
    createdAt: "2023-10-17T10:45:00Z"
  },
  {
    id: "OP-2023-004",
    customer: {
      name: "Camila Rodrigues",
      rating: 4.5,
      distance: "2,1 km"
    },
    service: {
      type: "Manutenção",
      description: "Troca de óleo e filtros",
      urgency: 'low'
    },
    vehicle: {
      make: "Fiat",
      model: "Pulse",
      year: 2022
    },
    estimatedValue: 350,
    createdAt: "2023-10-17T09:20:00Z"
  }
];

export default function OpportunitiesPanel({ opportunities = mockOpportunities, limit = 3 }: OpportunitiesPanelProps) {
  // Limita o número de oportunidades exibidas
  const displayedOpportunities = opportunities.slice(0, limit);
  
  // Formata a data para o formato relativo (há X horas/minutos)
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `Há ${diffMins} min`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `Há ${diffHours} h`;
    }
  };
  
  // Retorna a cor correspondente à urgência
  const getUrgencyColor = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  // Retorna o texto correspondente à urgência
  const getUrgencyText = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'low':
        return 'Baixa';
      case 'medium':
        return 'Média';
      case 'high':
        return 'Alta';
      default:
        return '';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Oportunidades Próximas</h3>
        <Link 
          href="/dashboard/oportunidades" 
          className="text-[#0047CC] text-sm hover:underline flex items-center"
        >
          Ver todas
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      {/* Lista de oportunidades */}
      <div>
        {displayedOpportunities.map((opportunity, index) => (
          <div 
            key={opportunity.id}
            className={`p-4 ${index !== displayedOpportunities.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}
          >
            <div className="flex items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{opportunity.service.type}: {opportunity.service.description}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600">{opportunity.vehicle.make} {opportunity.vehicle.model} ({opportunity.vehicle.year})</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                        <span className="text-sm">{opportunity.customer.distance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">{opportunity.customer.name}</span>
                      <div className="flex ml-1.5">
                        <StarIcon className="h-3.5 w-3.5 text-[#FFDE59]" />
                        <span className="text-xs ml-0.5">{opportunity.customer.rating}</span>
                      </div>
                    </div>
                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs ${getUrgencyColor(opportunity.service.urgency)} mt-1 border`}>
                      Urgência: {getUrgencyText(opportunity.service.urgency)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center text-sm">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-gray-500">{formatRelativeTime(opportunity.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center text-gray-700 mr-4">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1 text-[#0047CC]" />
                      <span className="font-medium">
                        {opportunity.estimatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <Link 
                      href={`/dashboard/oportunidades/${opportunity.id}`}
                      className="px-3 py-1 bg-[#0047CC]/10 text-[#0047CC] rounded-md text-sm font-medium hover:bg-[#0047CC]/20 transition-colors"
                    >
                      Visualizar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {displayedOpportunities.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhuma oportunidade disponível no momento.
          </div>
        )}
      </div>
      
      {/* Rodapé */}
      <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
        <button className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Aumentar minha visibilidade
        </button>
      </div>
    </div>
  );
} 