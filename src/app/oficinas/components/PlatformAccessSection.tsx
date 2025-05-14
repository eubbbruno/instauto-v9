"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";
import { 
  DevicePhoneMobileIcon, 
  CogIcon, 
  UserGroupIcon, 
  ChartBarIcon 
} from "@heroicons/react/24/outline";

const PlatformAccessSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-syne text-gray-900">
              Use no celular, sem instalar nada
            </h2>
            <p className="text-gray-600 mb-6">
              O painel do Instauto é 100% responsivo. Basta abrir no navegador do seu celular ou tablet e gerenciar tudo.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Atualizações automáticas</h3>
                  <p className="text-gray-600">Sempre com as últimas funcionalidades sem precisar baixar nada</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Acesso de qualquer lugar</h3>
                  <p className="text-gray-600">Gerencie sua oficina mesmo quando estiver fora, com total segurança</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Compatível com todos dispositivos</h3>
                  <p className="text-gray-600">Funciona perfeitamente em iPhone, Android, tablets e computadores</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/cadastro" className="bg-blue hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center">
                <span className="font-sans">Começar a usar agora</span>
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-[300px]">
              {/* Imagem de fundo de celular */}
              <div className="bg-gray-900 rounded-[40px] p-3 shadow-xl relative z-10">
                <div className="absolute top-8 left-1/2 w-20 h-3 bg-gray-800 rounded-full -translate-x-1/2"></div>
                <div className="h-[540px] bg-blue-50 rounded-[32px] overflow-hidden">
                  {/* Screenshot do app */}
                  <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col">
                    <div className="bg-blue px-4 py-3">
                      <div className="flex justify-between items-center">
                        <div className="text-white text-sm font-medium">Instauto Oficina</div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
                          <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
                          <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4">
                      <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                        <div className="text-sm font-bold mb-2">Resumo do dia</div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="text-xs text-gray-500">Orçamentos</div>
                            <div className="text-blue-600 font-bold">4</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <div className="text-xs text-gray-500">Agendados</div>
                            <div className="text-green-600 font-bold">2</div>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-blue rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm font-bold">Novos orçamentos</div>
                          <div className="text-xs text-blue-600">Ver todos</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg mb-2">
                          <div className="flex justify-between">
                            <div>
                              <div className="text-sm font-medium">Carlos Mendes</div>
                              <div className="text-xs text-gray-500">Troca de óleo - Civic 2022</div>
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full h-fit">
                              Novo
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center">
                          <DevicePhoneMobileIcon className="h-5 w-5 text-blue-500 mb-1" />
                          <div className="text-xs text-center">Orçamentos</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center">
                          <CogIcon className="h-5 w-5 text-blue-500 mb-1" />
                          <div className="text-xs text-center">Serviços</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center">
                          <UserGroupIcon className="h-5 w-5 text-blue-500 mb-1" />
                          <div className="text-xs text-center">Clientes</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center">
                          <ChartBarIcon className="h-5 w-5 text-blue-500 mb-1" />
                          <div className="text-xs text-center">Relatórios</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Elementos de decoração */}
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-yellow/20 rounded-full blur-[60px] -z-10"></div>
              <div className="absolute -top-5 -left-5 w-40 h-40 bg-blue/20 rounded-full blur-[50px] -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlatformAccessSection; 