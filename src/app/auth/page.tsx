"use client";

import { UserIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import Link from 'next/link'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-indigo-200 hover:text-white font-semibold transition-colors">
          ← Voltar para início
        </Link>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
          
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-4xl">🚗</div>
              <h1 className="text-4xl font-bold">Instauto</h1>
            </div>
            <h2 className="text-xl font-semibold mb-2">Bem-vindo à nossa plataforma!</h2>
            <p className="text-indigo-100">
              Escolha sua área para continuar com o login ou cadastro
            </p>
          </div>

          {/* Seleção de Área */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Card Motorista */}
              <Link href="/auth/new-motorista">
                <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200">
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <UserIcon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Área do Motorista
                    </h3>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Encontre oficinas confiáveis, agende serviços e mantenha seu veículo sempre em dia.
                    </p>
                    
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>Buscar oficinas próximas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>Gerenciar seus veículos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>Histórico de manutenções</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>Chat com oficinas</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-blue-700 transition-colors">
                      Continuar como Motorista →
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card Oficina */}
              <Link href="/auth/new-oficina">
                <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-orange-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200">
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BuildingOfficeIcon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Área da Oficina
                    </h3>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Conecte-se com motoristas, gerencie seus serviços e expanda seu negócio.
                    </p>
                    
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600 font-bold">✓</span>
                        <span>Receber solicitações</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600 font-bold">✓</span>
                        <span>Gestão completa</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600 font-bold">✓</span>
                        <span>Relatórios avançados</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600 font-bold">✓</span>
                        <span>Planos flexíveis</span>
                      </div>
                    </div>
                    
                    <div className="bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-orange-700 transition-colors">
                      Continuar como Oficina →
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Informações adicionais */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                Primeira vez aqui?
              </h4>
              <p className="text-gray-600 text-sm">
                Não se preocupe! O cadastro é rápido e você pode começar a usar a plataforma imediatamente.
                Seus dados pessoais podem ser preenchidos depois, diretamente no dashboard.
              </p>
            </div>

            {/* Links úteis */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/termos" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Termos de Serviço
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/politicas" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Política de Privacidade
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/contato" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Suporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
