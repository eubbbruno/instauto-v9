"use client";

import { 
  UserCircleIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  CameraIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function PerfilPage() {
  const [editing, setEditing] = useState(false);
  
  // Dados de exemplo do usuário
  const [userData, setUserData] = useState({
    nome: "Carlos Oliveira",
    nomeOficina: "Auto Center Oliveira",
    email: "carlos@autocenteroliveira.com.br",
    telefone: "(11) 98765-4321",
    endereco: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
    descricao: "Oficina especializada em manutenção de veículos nacionais e importados. Oferecemos serviços de mecânica geral, elétrica, injeção eletrônica e muito mais."
  });
  
  // Estado temporário para edição
  const [editData, setEditData] = useState({ ...userData });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    setUserData(editData);
    setEditing(false);
  };
  
  const handleCancel = () => {
    setEditData({ ...userData });
    setEditing(false);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <UserCircleIcon className="h-6 w-6 mr-2 text-[#0047CC]" />
            Meu Perfil
          </h1>
          <p className="text-gray-600 mt-1">
            Visualize e edite suas informações pessoais e da oficina
          </p>
        </div>
        
        {!editing && (
          <button 
            onClick={() => setEditing(true)}
            className="mt-4 md:mt-0 bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
          >
            <PencilSquareIcon className="h-4 w-4 mr-2" />
            Editar Perfil
          </button>
        )}
      </div>
      
      {/* Conteúdo do Perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda - Foto e Info Básica */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                  <Image 
                    src="/images/avatar-placeholder.jpg" 
                    alt={userData.nome}
                    width={128}
                    height={128}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <UserCircleIcon className="h-16 w-16 text-white" />
                </div>
                
                {editing && (
                  <button className="absolute bottom-0 right-0 bg-[#0047CC] text-white p-2 rounded-full shadow-md hover:bg-[#0055EB] transition-colors">
                    <CameraIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {editing ? (
                <input
                  type="text"
                  name="nome"
                  value={editData.nome}
                  onChange={handleInputChange}
                  className="text-xl font-bold text-gray-800 text-center border-b border-gray-300 focus:border-[#0047CC] focus:ring-0 w-full"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-800">{userData.nome}</h2>
              )}
              
              <div className="flex items-center text-gray-500 mt-1">
                <BuildingStorefrontIcon className="h-4 w-4 mr-1.5" />
                {editing ? (
                  <input
                    type="text"
                    name="nomeOficina"
                    value={editData.nomeOficina}
                    onChange={handleInputChange}
                    className="text-sm text-center border-b border-gray-300 focus:border-[#0047CC] focus:ring-0 w-full"
                  />
                ) : (
                  <span className="text-sm">{userData.nomeOficina}</span>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 space-y-3">
              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">E-mail</div>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="text-sm text-gray-700 border-b border-gray-300 focus:border-[#0047CC] focus:ring-0 w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-700">{userData.email}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Telefone</div>
                  {editing ? (
                    <input
                      type="text"
                      name="telefone"
                      value={editData.telefone}
                      onChange={handleInputChange}
                      className="text-sm text-gray-700 border-b border-gray-300 focus:border-[#0047CC] focus:ring-0 w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-700">{userData.telefone}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Endereço</div>
                  {editing ? (
                    <input
                      type="text"
                      name="endereco"
                      value={editData.endereco}
                      onChange={handleInputChange}
                      className="text-sm text-gray-700 border-b border-gray-300 focus:border-[#0047CC] focus:ring-0 w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-700">{userData.endereco}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Botões de Edição */}
          {editing && (
            <div className="mt-4 flex gap-3">
              <button 
                onClick={handleCancel}
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Salvar Alterações
              </button>
            </div>
          )}
          
          {/* Limitações da Versão Básica */}
          <div className="mt-6 bg-[#0047CC]/5 border border-[#0047CC]/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
              <span className="bg-[#0047CC]/10 text-[#0047CC] p-1.5 rounded-lg mr-2">
                <BuildingStorefrontIcon className="h-4 w-4" />
              </span>
              Versão Básica
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Para adicionar mais detalhes do seu negócio, como horário de funcionamento, fotos da oficina, equipe e certificações, faça upgrade para o plano Pro.
            </p>
            <button className="w-full bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
              Conhecer o Plano Pro
            </button>
          </div>
        </motion.div>
        
        {/* Coluna da Direita - Descrição e Informações Adicionais */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Sobre a Oficina</h3>
              
              {editing ? (
                <textarea
                  name="descricao"
                  value={editData.descricao}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg focus:ring-[#0047CC] focus:border-[#0047CC] text-sm text-gray-700 p-3"
                ></textarea>
              ) : (
                <p className="text-gray-600 text-sm">{userData.descricao}</p>
              )}
            </div>
          </div>
          
          {/* Serviços - Apenas visualização no plano básico */}
          <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Serviços Oferecidos</h3>
                <span className="text-xs text-gray-500">(somente visualização no plano básico)</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["Troca de Óleo", "Alinhamento", "Balanceamento", "Freios", "Suspensão"].map((servico, i) => (
                  <div 
                    key={i}
                    className="bg-gray-100 rounded-lg p-3 text-center text-sm text-gray-700"
                  >
                    {servico}
                  </div>
                ))}
                <div className="bg-[#0047CC]/10 rounded-lg p-3 text-center text-sm text-[#0047CC] border border-dashed border-[#0047CC]/30">
                  + Adicionar (Pro)
                </div>
              </div>
            </div>
          </div>
          
          {/* Galeria - Bloqueada no plano básico */}
          <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Fotos da Oficina</h3>
              
              <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <CameraIcon className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 text-center mb-2">
                  Adicione fotos da sua oficina para atrair mais clientes
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Recurso disponível apenas no plano Pro
                </p>
                <button className="mt-4 bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                  Fazer Upgrade
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 