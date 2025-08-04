"use client";

import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type MiniCalendarProps = {
  events?: Array<{
    date: string; // formato YYYY-MM-DD
    count: number;
  }>;
  onSelectDate?: (date: string) => void;
};

export default function MiniCalendar({ events = [], onSelectDate }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Obter o primeiro dia do mês atual
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // Obter o dia da semana do primeiro dia (0-6, onde 0 é Domingo)
  const firstDayWeekday = firstDayOfMonth.getDay();
  // Obter o último dia do mês
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  // Nome do mês atual
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  // Nome curto dos dias da semana
  const weekdayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  // Navegar para o mês anterior
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navegar para o próximo mês
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Verificar se um dia tem eventos
  const getEventCount = (day: number) => {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const event = events.find(e => e.date === date);
    return event ? event.count : 0;
  };
  
  // Formatar data como YYYY-MM-DD
  const formatDate = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Manipular clique em um dia
  const handleDayClick = (day: number) => {
    const date = formatDate(day);
    setSelectedDate(date);
    if (onSelectDate) {
      onSelectDate(date);
    }
  };
  
  // É o dia atual?
  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day && 
      today.getMonth() === currentDate.getMonth() && 
      today.getFullYear() === currentDate.getFullYear()
    );
  };
  
  // É o dia selecionado?
  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    
    const date = formatDate(day);
    return date === selectedDate;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cabeçalho do calendário */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#f8f9ff] to-white">
        <h3 className="font-bold text-gray-800 flex items-center">
          <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        </h3>
        <div className="flex space-x-1">
          <button 
            onClick={prevMonth}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Calendário */}
      <div className="p-3">
        {/* Cabeçalho de dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdayNames.map((day, i) => (
            <div key={i} className="text-xs text-center text-gray-500 font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grade do calendário */}
        <div className="grid grid-cols-7 gap-1">
          {/* Dias vazios antes do primeiro dia do mês */}
          {Array.from({ length: firstDayWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          
          {/* Dias do mês */}
          {Array.from({ length: lastDayOfMonth }).map((_, i) => {
            const day = i + 1;
            const eventCount = getEventCount(day);
            
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square rounded-md flex flex-col items-center justify-center relative 
                  transition-colors text-sm
                  ${isToday(day) ? 'bg-blue-50 text-blue-600 font-medium border border-blue-200' : ''}
                  ${isSelected(day) ? 'bg-[#0047CC] text-white font-medium' : 'hover:bg-gray-100'}
                  ${!isToday(day) && !isSelected(day) ? 'text-gray-700' : ''}
                `}
              >
                <span>{day}</span>
                {eventCount > 0 && (
                  <span className={`
                    absolute bottom-1 h-1.5 w-1.5 rounded-full
                    ${isSelected(day) ? 'bg-[#FFDE59]' : 'bg-[#0047CC]'}
                  `}></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Legenda simples */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-center">
        <div className="flex items-center mr-3">
          <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
          <span>Hoje</span>
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-[#0047CC] mr-1"></div>
          <span>Agendamento</span>
        </div>
      </div>
    </div>
  );
} 