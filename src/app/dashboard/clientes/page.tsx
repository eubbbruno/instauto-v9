"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function ClientesPage() {
  const [isLoading] = useState(false);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen pb-safe">
      {/* Header responsivo */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Clientes</h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">Gerencie seus clientes e veículos</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-5 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center touch-manipulation min-h-[48px] active:bg-blue-800">
              <PlusIcon className="h-5 w-5 mr-2" />
              Adicionar Cliente
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo temporário */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4 text-lg">
                Página de Clientes
              </div>
              <p className="text-gray-500 text-sm mb-6">
                Esta página está sendo reconstruída para corrigir problemas de build.
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="h-5 w-5 mr-2" />
                Adicionar Primeiro Cliente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 