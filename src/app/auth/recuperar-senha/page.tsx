"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email) {
      setError("Por favor, insira seu e-mail");
      return;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      // Aqui seria a lógica de recuperação de senha com API
      console.log("Solicitação de recuperação para:", email);
      
      // Simulando um delay para demonstração
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
      
    } catch (err) {
      setError("Falha ao processar a solicitação. Tente novamente mais tarde.");
      console.error("Erro de recuperação:", err);
    } finally {
      setIsLoading(false);
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

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image 
              src="/images/logo.svg" 
              alt="Instauto Logo" 
              width={150} 
              height={40}
              className="h-10 w-auto"
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 md:p-8"
          >
            {!success ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Recuperar Senha</h2>
                <p className="text-gray-600 mb-6">
                  Informe seu e-mail e enviaremos um link para você redefinir sua senha.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Mensagem de erro */}
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  {/* Campo de e-mail */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>
                  
                  {/* Botão de enviar */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
                      isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-[#0047CC] hover:bg-[#0055EB]"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      "Enviar Link de Recuperação"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Solicitação enviada!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enviamos um e-mail com instruções para redefinir sua senha. 
                  Verifique sua caixa de entrada e a pasta de spam.
                </p>
                <Link 
                  href="/auth" 
                  className="text-sm text-[#0047CC] hover:underline font-medium"
                >
                  Voltar para a página de login
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 