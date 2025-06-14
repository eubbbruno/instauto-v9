"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

// Etapas do cadastro completo de oficina
type FormStep = "info" | "endereco" | "servicos" | "horarios" | "documentos" | "final";

export default function CadastroCompletoPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>("info");
  const [progress, setProgress] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para os dados do formulário por etapa
  const [infoBasica, setInfoBasica] = useState({
    nomeResponsavel: "",
    documento: "",
    telefoneComercial: "",
    celular: "",
    website: "",
    descricao: "",
  });
  
  const [endereco, setEndereco] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  
  const [servicos, setServicos] = useState<string[]>([]);
  const [horarios, setHorarios] = useState({
    segunda: { abre: "08:00", fecha: "18:00", fechado: false },
    terca: { abre: "08:00", fecha: "18:00", fechado: false },
    quarta: { abre: "08:00", fecha: "18:00", fechado: false },
    quinta: { abre: "08:00", fecha: "18:00", fechado: false },
    sexta: { abre: "08:00", fecha: "18:00", fechado: false },
    sabado: { abre: "08:00", fecha: "12:00", fechado: false },
    domingo: { abre: "08:00", fecha: "18:00", fechado: true },
  });
  
  const [documentos, setDocumentos] = useState({
    cnpj: null as File | null,
    alvara: null as File | null,
    fotos: [] as File[],
  });

  // Função para avançar para a próxima etapa
  const nextStep = () => {
    setIsLoading(true);
    
    // Simulando validação e envio de dados
    setTimeout(() => {
      setIsLoading(false);
      
      // Avançar para próxima etapa com base na etapa atual
      switch (currentStep) {
        case "info":
          setCurrentStep("endereco");
          setProgress(40);
          break;
        case "endereco":
          setCurrentStep("servicos");
          setProgress(60);
          break;
        case "servicos":
          setCurrentStep("horarios");
          setProgress(70);
          break;
        case "horarios":
          setCurrentStep("documentos");
          setProgress(90);
          break;
        case "documentos":
          setCurrentStep("final");
          setProgress(100);
          break;
        default:
          break;
      }
    }, 1000);
  };

  // Renderiza o conteúdo com base na etapa atual
  const renderStepContent = () => {
    switch (currentStep) {
      case "info":
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Informações Básicas</h3>
            <p className="text-sm text-gray-600 mb-4">
              Preencha os dados básicos da sua oficina.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Nome completo"
                  value={infoBasica.nomeResponsavel}
                  onChange={(e) => setInfoBasica({...infoBasica, nomeResponsavel: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF/CNPJ
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Documento"
                  value={infoBasica.documento}
                  onChange={(e) => setInfoBasica({...infoBasica, documento: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone Comercial
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="(00) 0000-0000"
                  value={infoBasica.telefoneComercial}
                  onChange={(e) => setInfoBasica({...infoBasica, telefoneComercial: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Celular
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="(00) 00000-0000"
                  value={infoBasica.celular}
                  onChange={(e) => setInfoBasica({...infoBasica, celular: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site ou Rede Social (opcional)
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="https://seusite.com.br"
                  value={infoBasica.website}
                  onChange={(e) => setInfoBasica({...infoBasica, website: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição da Oficina
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Descreva os diferenciais da sua oficina..."
                  value={infoBasica.descricao}
                  onChange={(e) => setInfoBasica({...infoBasica, descricao: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>
        );
        
      case "endereco":
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Endereço</h3>
            <p className="text-sm text-gray-600 mb-4">
              Informe o endereço da sua oficina.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="00000-000"
                  value={endereco.cep}
                  onChange={(e) => setEndereco({...endereco, cep: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logradouro
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Rua, Avenida, etc."
                  value={endereco.logradouro}
                  onChange={(e) => setEndereco({...endereco, logradouro: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Número"
                  value={endereco.numero}
                  onChange={(e) => setEndereco({...endereco, numero: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Sala, Conjunto, etc."
                  value={endereco.complemento}
                  onChange={(e) => setEndereco({...endereco, complemento: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Bairro"
                  value={endereco.bairro}
                  onChange={(e) => setEndereco({...endereco, bairro: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Cidade"
                  value={endereco.cidade}
                  onChange={(e) => setEndereco({...endereco, cidade: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  value={endereco.estado}
                  onChange={(e) => setEndereco({...endereco, estado: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case "servicos":
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Serviços Oferecidos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Selecione os serviços que sua oficina oferece.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Troca de óleo",
                "Revisão completa",
                "Alinhamento e balanceamento",
                "Freios",
                "Suspensão",
                "Motor",
                "Câmbio",
                "Elétrica",
                "Injeção eletrônica",
                "Ar condicionado",
                "Funilaria",
                "Pintura",
                "Pneus",
                "Higienização",
                "Estética automotiva",
                "Diagnóstico computadorizado",
              ].map((servico) => (
                <label 
                  key={servico} 
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#0047CC] focus:ring-[#0047CC] border-gray-300 rounded"
                    checked={servicos.includes(servico)}
                    onChange={() => {
                      if (servicos.includes(servico)) {
                        setServicos(servicos.filter(s => s !== servico));
                      } else {
                        setServicos([...servicos, servico]);
                      }
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-700">{servico}</span>
                </label>
              ))}
            </div>
          </div>
        );
        
      case "horarios":
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Horários de Funcionamento</h3>
            <p className="text-sm text-gray-600 mb-4">
              Informe os horários de funcionamento da sua oficina.
            </p>
            
            <div className="space-y-4">
              {(Object.keys(horarios) as Array<keyof typeof horarios>).map((dia) => {
                const diaNome = {
                  segunda: "Segunda-feira",
                  terca: "Terça-feira",
                  quarta: "Quarta-feira",
                  quinta: "Quinta-feira",
                  sexta: "Sexta-feira",
                  sabado: "Sábado",
                  domingo: "Domingo"
                }[dia];
                
                return (
                  <div key={dia} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`fechado-${dia}`}
                        className="h-4 w-4 text-[#0047CC] focus:ring-[#0047CC] border-gray-300 rounded"
                        checked={horarios[dia].fechado}
                        onChange={() => {
                          setHorarios({
                            ...horarios,
                            [dia]: {
                              ...horarios[dia],
                              fechado: !horarios[dia].fechado
                            }
                          });
                        }}
                      />
                      <label htmlFor={`fechado-${dia}`} className="ml-2 text-sm text-gray-700">
                        {diaNome}
                      </label>
                    </div>
                    
                    {!horarios[dia].fechado ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          value={horarios[dia].abre}
                          onChange={(e) => {
                            setHorarios({
                              ...horarios,
                              [dia]: {
                                ...horarios[dia],
                                abre: e.target.value
                              }
                            });
                          }}
                        />
                        <span className="text-gray-500">às</span>
                        <input
                          type="time"
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          value={horarios[dia].fecha}
                          onChange={(e) => {
                            setHorarios({
                              ...horarios,
                              [dia]: {
                                ...horarios[dia],
                                fecha: e.target.value
                              }
                            });
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-red-500 font-medium">Fechado</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case "documentos":
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Documentos e Fotos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Envie os documentos necessários e fotos da sua oficina.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprovante de CNPJ
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500">PDF ou JPG (máx. 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDocumentos({...documentos, cnpj: e.target.files[0]});
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alvará de Funcionamento
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500">PDF ou JPG (máx. 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDocumentos({...documentos, alvara: e.target.files[0]});
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos da Oficina (máx. 5 fotos)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500">JPG ou PNG (máx. 5MB por foto)</p>
                    </div>
                    <input 
                      type="file" 
                      multiple
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const newFiles = Array.from(e.target.files);
                          setDocumentos({
                            ...documentos, 
                            fotos: [...documentos.fotos, ...newFiles].slice(0, 5)
                          });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "final":
        return (
          <div className="py-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cadastro Concluído!</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Seu cadastro foi enviado com sucesso e será analisado pela nossa equipe. 
              Você receberá um e-mail assim que sua conta for aprovada.
            </p>
            <Link 
              href="/oficina" 
              className="inline-flex items-center px-4 py-2 bg-[#0047CC] text-white rounded-lg hover:bg-[#0055EB] transition-colors"
            >
              Acessar Dashboard
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header com logo e link para voltar */}
      <header className="p-4 flex items-center">
        <Link href="/auth" className="flex items-center text-gray-600 hover:text-[#0047CC] transition-colors">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Voltar para login</span>
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/images/logo.svg" 
              alt="Instauto Logo" 
              width={150} 
              height={40}
              className="h-10 w-auto"
            />
          </div>
          
          {/* Título e progresso */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Cadastro de Oficina
            </h2>
            <p className="text-gray-600">
              Complete as informações abaixo para finalizar seu cadastro.
            </p>
          </div>
          
          {/* Barra de progresso */}
          {currentStep !== "final" && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <motion.div 
                className="bg-[#0047CC] h-2.5 rounded-full"
                initial={{ width: `${progress - 10}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          )}
          
          {/* Formulário atual */}
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 md:p-8"
          >
            {renderStepContent()}
            
            {/* Botões de navegação */}
            {currentStep !== "final" && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={isLoading}
                  className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-[#0047CC] hover:bg-[#0055EB]"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    <>Próximo</>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 