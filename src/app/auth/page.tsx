"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Componentes de formulário
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [userType, setUserType] = useState<"motorista" | "oficina">("motorista");

  // Ouvir eventos personalizados para alternar entre tabs
  useEffect(() => {
    const handleSwitchTab = (e: CustomEvent) => {
      if (e.detail === 'login' || e.detail === 'register') {
        setActiveTab(e.detail);
      }
    };

    // Adicionando event listener
    document.addEventListener('switch-tab', handleSwitchTab as EventListener);

    // Removendo event listener ao desmontar
    return () => {
      document.removeEventListener('switch-tab', handleSwitchTab as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header com logo e link para voltar */}
      <header className="p-4 flex items-center">
        <Link href="/" className="flex items-center text-gray-600 hover:text-[#0047CC] transition-colors">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Voltar para a página inicial</span>
        </Link>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Coluna da esquerda - Visual/Banner */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0047CC] to-[#0055EB] p-8 items-center justify-center relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#FFDE59]/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 max-w-md text-center">
            <Image 
              src="/images/logo-white.svg" 
              alt="Instauto Logo" 
              width={200} 
              height={50}
              className="h-12 w-auto mb-8 mx-auto"
            />
            <h1 className="text-3xl font-bold text-white mb-4">Bem-vindo ao Instauto</h1>
            <p className="text-white/80 mb-8">
              Conectando motoristas às melhores oficinas mecânicas. Gerencie seus veículos e encontre os melhores serviços.
            </p>
            
            {/* Credenciais de demonstração */}
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center justify-center">
                🔑 Credenciais para Teste
              </h3>
              
              <div className="space-y-4 text-left">
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="text-white font-medium text-sm mb-2 flex items-center">
                    👤 Motorista - João Silva
                  </h4>
                  <p className="text-white/80 text-xs">
                    <strong>Email:</strong> joao@email.com<br/>
                    <strong>Senha:</strong> 123456
                  </p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="text-white font-medium text-sm mb-2 flex items-center">
                    🏢 Oficina - Auto Center Silva
                  </h4>
                  <p className="text-white/80 text-xs">
                    <strong>Email:</strong> carlos@autocenter.com<br/>
                    <strong>Senha:</strong> 123456
                  </p>
                </div>
              </div>
              
              <p className="text-white/70 text-xs mt-4">
                💡 Use o botão &ldquo;Entrar com dados de demonstração&rdquo; no formulário
              </p>
            </div>
            
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <h3 className="text-white font-medium mb-4">O que você pode fazer no Instauto:</h3>
              <ul className="text-left space-y-3">
                {[
                  "Encontrar oficinas próximas para o serviço que você precisa",
                  "Gerenciar todos os seus veículos em um só lugar",
                  "Acompanhar histórico completo de manutenções",
                  "Receber lembretes para as próximas revisões",
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center text-white/90"
                  >
                    <span className="h-2 w-2 bg-[#FFDE59] rounded-full mr-2 flex-shrink-0"></span>
                    <span className="text-xs">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Coluna da direita - Formulário */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            {/* Logo para mobile */}
            <div className="md:hidden flex justify-center mb-8">
              <Image 
                src="/images/logo.svg" 
                alt="Instauto Logo" 
                width={150} 
                height={40}
                className="h-10 w-auto"
              />
            </div>
            
            {/* Card do formulário */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {activeTab === "login" ? "Entrar na sua conta" : "Criar uma nova conta"}
              </h2>
              
              {/* Tabs para alternar entre login e cadastro */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-3 text-sm font-medium text-center ${
                    activeTab === "login"
                      ? "text-[#0047CC] border-b-2 border-[#0047CC]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 py-3 text-sm font-medium text-center ${
                    activeTab === "register"
                      ? "text-[#0047CC] border-b-2 border-[#0047CC]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Cadastre-se
                </button>
              </div>
              
              {/* Seleção de tipo de usuário */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Você é:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUserType("motorista")}
                    className={`py-3 border rounded-lg text-sm font-medium ${
                      userType === "motorista"
                        ? "bg-[#0047CC] text-white border-[#0047CC]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Motorista
                  </button>
                  <button
                    onClick={() => setUserType("oficina")}
                    className={`py-3 border rounded-lg text-sm font-medium ${
                      userType === "oficina"
                        ? "bg-[#0047CC] text-white border-[#0047CC]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Oficina
                  </button>
                </div>
              </div>
              
              {/* Formulário de login ou cadastro */}
              {activeTab === "login" ? (
                <LoginForm userType={userType} />
              ) : (
                <RegisterForm userType={userType} />
              )}
            </motion.div>
            
            {/* Link para termos e política de privacidade */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Ao continuar, você concorda com os{" "}
              <Link href="/termos" className="text-[#0047CC] hover:underline">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link href="/privacidade" className="text-[#0047CC] hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 