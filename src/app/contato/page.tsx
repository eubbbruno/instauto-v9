"use client";

import { useState } from 'react'
import InstitutionalLayout from '@/components/InstitutionalLayout';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'motorista' as 'motorista' | 'oficina',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSuccess(true)
    setLoading(false)
    
    // Reset após 3 segundos
    setTimeout(() => {
      setSuccess(false)
      setFormData({
        name: '',
        email: '',
        userType: 'motorista',
        subject: '',
        message: ''
      })
    }, 3000)
  }

  return (
    <InstitutionalLayout 
      title="Entre em Contato" 
      description="Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo ou envie uma mensagem usando o formulário."
    >
      <div className="grid lg:grid-cols-2 gap-16">
        {/* Informações de Contato */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Fale Conosco
          </h2>

          <div className="space-y-8">
            {/* Telefone */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <PhoneIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefone</h3>
                <p className="text-gray-600 mb-1">(11) 4000-0000</p>
                <p className="text-sm text-gray-500">Seg-Sex: 8h às 18h | Sáb: 8h às 12h</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <EnvelopeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 mb-1">contato@instauto.com.br</p>
                <p className="text-gray-600 mb-1">suporte@instauto.com.br</p>
                <p className="text-sm text-gray-500">Resposta em até 24 horas</p>
              </div>
            </div>

            {/* Endereço */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPinIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Endereço</h3>
                <p className="text-gray-600 mb-1">Avenida Paulista, 1000</p>
                <p className="text-gray-600 mb-1">São Paulo/SP - CEP: 01310-000</p>
                <p className="text-sm text-gray-500">Brasil</p>
              </div>
            </div>

            {/* Horário */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Horário de Funcionamento</h3>
                <div className="text-gray-600 space-y-1">
                  <p>Segunda a Sexta: 8h às 18h</p>
                  <p>Sábado: 8h às 12h</p>
                  <p>Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Rápido */}
          <div className="mt-12 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Perguntas Frequentes</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">Como criar uma conta?</p>
                <p className="text-gray-600">Acesse a página de cadastro e escolha o tipo de usuário (motorista ou oficina).</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Como agendar um serviço?</p>
                <p className="text-gray-600">Faça login, encontre uma oficina próxima e selecione o serviço desejado.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Esqueci minha senha</p>
                <p className="text-gray-600">Na tela de login, clique em &quot;Esqueci minha senha&quot; e siga as instruções.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Contato */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envie uma Mensagem
            </h2>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">✅ Mensagem enviada com sucesso!</p>
                <p className="text-green-600 text-sm mt-1">Retornaremos em breve.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tipo de Usuário *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, userType: 'motorista'})}
                    className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.userType === 'motorista'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🚗 Motorista
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, userType: 'oficina'})}
                    className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.userType === 'oficina'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🔧 Oficina
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Assunto *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="suporte">Suporte Técnico</option>
                  <option value="duvida">Dúvida sobre o Serviço</option>
                  <option value="bug">Reportar Bug</option>
                  <option value="parceria">Parceria/Comercial</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Mensagem *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white resize-none"
                  placeholder="Descreva sua dúvida ou solicitação..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </InstitutionalLayout>
  );
} 