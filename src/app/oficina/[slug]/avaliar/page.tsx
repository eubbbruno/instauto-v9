"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormularioAvaliacao, { AvaliacaoDados } from '@/components/FormularioAvaliacao';
import { ChevronLeftIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function AvaliarOficinaPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  // Dados mockados da oficina (em um projeto real, seriam buscados da API)
  const oficina = {
    id: "ofc-" + params.slug,
    nome: "Oficina " + params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
    endereco: "Av. das Oficinas, 123",
    cidade: "São Paulo",
    estado: "SP",
    avaliacao: 4.5,
    totalAvaliacoes: 28,
    foto: "https://images.unsplash.com/photo-1597762470488-3877b1f538c6?q=80&w=600&auto=format&fit=crop"
  };
  
  // Usuário mockado (em um projeto real, seria obtido do contexto de autenticação)
  const usuario = {
    id: "usr-123456",
    nome: "João Silva"
  };
  
  // Função para lidar com o envio do formulário de avaliação
  const handleSubmitAvaliacao = async (dados: AvaliacaoDados) => {
    setErro(null);
    
    try {
      // Simular uma chamada de API com um delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em um projeto real, aqui enviaria os dados para a API
      console.log("Enviando avaliação:", {
        oficinaId: oficina.id,
        usuarioId: usuario.id,
        ...dados
      });
      
      // Simulando sucesso
      setSucesso(true);
      
      // Redirecionar para a página da oficina após 2 segundos
      setTimeout(() => {
        router.push(`/oficina/${params.slug}`);
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      setErro("Ocorreu um erro ao enviar sua avaliação. Por favor, tente novamente.");
    }
  };
  
  // Função para cancelar a avaliação e voltar para a página da oficina
  const handleCancelar = () => {
    router.back();
  };
  
  // Se a avaliação foi enviada com sucesso, mostrar mensagem de agradecimento
  if (sucesso) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StarIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Avaliação enviada com sucesso!</h1>
          <p className="text-green-700 mb-6">
            Obrigado por compartilhar sua experiência. Sua avaliação ajudará outros motoristas.
          </p>
          <p className="text-sm text-green-600">
            Redirecionando para a página da oficina...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Link 
          href={`/oficina/${params.slug}`}
          className="inline-flex items-center text-[#0047CC] hover:underline"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          <span>Voltar para oficina</span>
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 flex items-center border-b">
          {oficina.foto ? (
            <img 
              src={oficina.foto} 
              alt={oficina.nome} 
              className="w-16 h-16 rounded-lg object-cover mr-4"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
              <BuildingStorefrontIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          <div>
            <h1 className="text-xl font-bold text-gray-800">{oficina.nome}</h1>
            <p className="text-gray-600 text-sm">
              {oficina.endereco}, {oficina.cidade}/{oficina.estado}
            </p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(oficina.avaliacao)
                        ? 'text-[#FFDE59]'
                        : i < oficina.avaliacao
                        ? 'text-[#FFDE59]/50'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-600">
                {oficina.avaliacao.toFixed(1)} ({oficina.totalAvaliacoes} avaliações)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mensagem de erro global */}
      {erro && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {erro}
        </div>
      )}
      
      {/* Formulário de avaliação */}
      <FormularioAvaliacao
        oficinaId={oficina.id}
        usuarioId={usuario.id}
        onSubmit={handleSubmitAvaliacao}
        onCancel={handleCancelar}
        className="mb-8"
      />
    </div>
  );
} 