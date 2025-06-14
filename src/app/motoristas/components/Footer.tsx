"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowUpRight, ChevronRight, ArrowRight, Heart, AlertCircle } from "lucide-react";
import { Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <footer className="relative overflow-hidden pt-24 pb-10" data-contrast="dark">
      {/* Fundo com gradiente e textura */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#031023] via-[#0047CC] to-[#020A14] -z-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.07] -z-10"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-1/3 h-64 bg-[#FFDE59]/5 rounded-bl-full blur-[120px] -z-10"></div>
      <div className="absolute left-0 bottom-0 w-1/4 h-32 bg-[#0047CC]/30 rounded-tr-full blur-[80px] -z-10"></div>
      
      {/* Formas geométricas decorativas */}
      <div className="absolute top-[15%] right-[5%] w-24 h-24 rounded-full border-4 border-[#FFDE59]/10 -z-10"></div>
      <div className="absolute bottom-[20%] left-[7%] w-16 h-16 rotate-45 border-4 border-[#0047CC]/20 -z-10"></div>
      <div className="absolute top-[35%] left-[12%] w-3 h-12 bg-[#FFDE59]/20 rounded-full -z-10"></div>
      
      {/* Partículas decorativas */}
      <div className="absolute top-20 left-[20%] w-1 h-1 bg-[#FFDE59]/70 rounded-full"></div>
      <div className="absolute top-[40%] right-[25%] w-2 h-2 bg-[#FFDE59]/40 rounded-full"></div>
      <div className="absolute bottom-[30%] left-[30%] w-1.5 h-1.5 bg-[#FFDE59]/30 rounded-full"></div>
      <div className="absolute top-[60%] right-[40%] w-1 h-1 bg-[#0047CC]/70 rounded-full"></div>
      
      {/* Linha amarela de destaque no topo */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFDE59]"></div>
      
      <div className="container-custom relative z-10">
        {/* Banner de inscrição na newsletter */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20 rounded-2xl bg-gradient-to-r from-[#0047CC] to-[#0055EB] p-8 md:p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTItNGgxdjFoLTF2LTF6bTQgMGgxdjFoLTF2LTF6bTIgMmgtMXYtMWgxdjF6bS0yIDRoMXYxaC0xdi0xek0zNCAzMGg0djFoLTR2LTF6bTAtMmgxdjFoLTF2LTF6bTAtNGgxdjFoLTF2LTF6TTMwIDI4aDFWMTdoLTF2MTF6bS0yIDJoMXYxaC0xdi0xem0tMi0yaDF2MWgtMXYtMXptLTItNGgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          
          {/* Círculos decorativos */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFDE59]/20 rounded-full blur-[60px]"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#0047CC]/20 rounded-full blur-[60px]"></div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white font-syne mb-3">Receba Ofertas Exclusivas</h3>
              <p className="text-gray-200 max-w-md">Cadastre-se para receber orçamentos, promoções especiais e dicas para cuidar do seu veículo.</p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row">
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  className="bg-white/10 border border-white/20 text-white placeholder-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE59] mb-3 sm:mb-0 sm:mr-2 w-full md:w-auto min-w-[250px]"
                />
                <button className="bg-[#FFDE59] hover:bg-[#FFD429] text-[#0047CC] font-bold px-6 py-3 rounded-lg transition-all flex items-center justify-center group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Quero Receber
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-white transition-all duration-300 group-hover:h-full -z-0"></span>
                </button>
              </div>
              <p className="text-xs text-gray-300 mt-2 flex items-center">
                <span className="inline-flex mr-1"><Heart size={12} className="text-[#FFDE59]" /></span>
                Prometemos não enviar spam. Você pode cancelar a qualquer momento.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Logo e informações principais */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
          className="grid md:grid-cols-12 gap-8 lg:gap-12 mb-16"
        >
          {/* Coluna da logo e descrição */}
          <motion.div variants={fadeInUp} className="md:col-span-4">
            <Link href="/" className="inline-block mb-6 relative group">
              <Image 
                src="/images/logo.svg" 
                alt="Instauto Logo" 
                width={150} 
                height={40}
                className="h-10 w-auto"
              />
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#FFDE59]/0 via-[#FFDE59] to-[#FFDE59]/0"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </Link>
            
            <p className="text-gray-300 mb-8 leading-relaxed relative">
              <span className="relative z-10">Encontre as melhores oficinas próximas a você. Agende serviços, receba orçamentos e avalie atendimentos de forma simples e rápida.</span>
              <span className="absolute -left-6 top-0 text-4xl text-[#FFDE59]/10 font-bold">&ldquo;</span>
              <span className="absolute -right-6 bottom-0 text-4xl text-[#FFDE59]/10 font-bold">&rdquo;</span>
            </p>
            
            <div className="flex space-x-3 mb-8">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0047CC]/20 hover:bg-[#0047CC] flex items-center justify-center transition-all duration-300 group"
                whileHover={{ y: -3, backgroundColor: "#0047CC" }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0047CC]/20 hover:bg-[#0047CC] flex items-center justify-center transition-all duration-300 group"
                whileHover={{ y: -3, backgroundColor: "#0047CC" }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0047CC]/20 hover:bg-[#0047CC] flex items-center justify-center transition-all duration-300 group"
                whileHover={{ y: -3, backgroundColor: "#0047CC" }}
                whileTap={{ scale: 0.95 }}
              >
                <Youtube className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </motion.a>
              
              {/* Botão de emergência destacado */}
              <motion.a 
                href="#emergencia" 
                className="ml-2 flex-grow rounded-full bg-gradient-to-r from-[#FFDE59] to-[#FFD429] text-[#0047CC] font-bold text-sm px-4 flex items-center justify-center transition-all group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <AlertCircle size={16} className="mr-2" />
                <span>Emergência 24h</span>
                <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
                whileHover={{ x: 3 }}
              >
                <div className="w-8 h-8 rounded-full bg-[#0047CC] flex items-center justify-center mr-3 group-hover:bg-[#FFDE59] transition-colors">
                  <Mail className="w-4 h-4 text-white group-hover:text-[#0047CC]" />
                </div>
                <span>contato@instauto.com.br</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
                whileHover={{ x: 3 }}
              >
                <a 
                  href="https://wa.me/5543996466446" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center w-full"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0047CC] flex items-center justify-center mr-3 group-hover:bg-[#FFDE59] transition-colors">
                    <Phone className="w-4 h-4 text-white group-hover:text-[#0047CC]" />
                  </div>
                  <span className="group-hover:text-[#FFDE59] transition-colors">(43) 99646-6446</span>
                </a>
              </motion.div>
              <motion.div 
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
                whileHover={{ x: 3 }}
              >
                <div className="w-8 h-8 rounded-full bg-[#0047CC] flex items-center justify-center mr-3 group-hover:bg-[#FFDE59] transition-colors flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white group-hover:text-[#0047CC]" />
                </div>
                <span className="flex items-center">Londrina, PR. Brasil</span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Links rápidos */}
          <motion.div variants={fadeInUp} className="md:col-span-2">
            <h3 className="font-bold text-lg mb-5 font-syne text-white relative inline-block">
              Serviços
              <motion.span 
                className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FFDE59]"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              ></motion.span>
            </h3>
            <ul className="space-y-3">
              {["Manutenção", "Revisão", "Diagnóstico", "Emergências", "Orçamentos"].map((item, index) => (
                <motion.li key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group"
                >
                  <Link href={item === "Emergências" ? "#emergencia" : 
                               item === "Orçamentos" ? "#orcamento" :
                               "#servicos"} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE59] mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} className="md:col-span-2">
            <h3 className="font-bold text-lg mb-5 font-syne text-white relative inline-block">
              App
              <motion.span 
                className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FFDE59]"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              ></motion.span>
            </h3>
            <ul className="space-y-3">
              {["Android", "iOS", "Como Usar", "Avaliações", "Recursos"].map((item, index) => (
                <motion.li key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group"
                >
                  <Link href={item === "Android" ? "https://play.google.com" : 
                               item === "iOS" ? "https://apps.apple.com" :
                               item === "Como Usar" ? "#como-funciona" :
                               "#app"} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE59] mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} className="md:col-span-2">
            <h3 className="font-bold text-lg mb-5 font-syne text-white relative inline-block">
              Suporte
              <motion.span 
                className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FFDE59]"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              ></motion.span>
            </h3>
            <ul className="space-y-3">
              {["FAQ", "Contato", "Privacidade", "Termos", "Ajuda"].map((item, index) => (
                <motion.li key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group"
                >
                  <Link href={item === "FAQ" ? "#faq" : 
                               `/${item.toLowerCase().replace(/\s/g, '')}`} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE59] mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Download app - Modificando para Cadastro de Oficinas */}
          <motion.div variants={fadeInUp} className="md:col-span-2">
            <h3 className="font-bold text-lg mb-5 font-syne text-white relative inline-block">
              Oficina Mecânica?
              <motion.span 
                className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FFDE59]"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              ></motion.span>
            </h3>
            <div className="space-y-4">
              <Link href="/oficinas" target="_blank" rel="noopener noreferrer">
                <motion.div 
                  className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-[#FFDE59] transition-all hover:bg-white/10"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-[#FFDE59]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Para Profissionais</div>
                      <div className="text-sm font-medium text-white">Cadastre-se Aqui!</div>
                    </div>
                  </div>
                </motion.div>
              </Link>
              
              <Link href="/oficinas/beneficios" target="_blank" rel="noopener noreferrer">
                <motion.div 
                  className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-[#FFDE59] transition-all hover:bg-white/10"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-[#FFDE59]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Aumente seu Faturamento</div>
                      <div className="text-sm font-medium text-white">Veja os Benefícios</div>
                    </div>
                  </div>
                </motion.div>
              </Link>
              
              {/* Imagem de destaque */}
              <motion.div 
                className="mt-6 border border-dashed border-[#FFDE59]/30 rounded-lg p-3 bg-white/5 flex flex-col items-center justify-center"
                whileHover={{ borderColor: "rgba(255, 222, 89, 0.7)" }}
              >
                <div className="w-full h-24 bg-gradient-to-r from-[#0047CC]/40 to-[#0055EB]/40 rounded flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTItNGgxdjFoLTF2LTF6bTQgMGgxdjFoLTF2LTF6bTIgMmgtMXYtMWgxdjF6bS0yIDRoMXYxaC0xdi0xek0zNCAzMGg0djFoLTR2LTF6bTAtMmgxdjFoLTF2LTF6bTAtNGgxdjFoLTF2LTF6TTMwIDI4aDFWMTdoLTF2MTF6bS0yIDJoMXYxaC0xdi0xem0tMi0yaDF2MWgtMXYtMXptLTItNGgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
                  <div className="text-center px-4 relative z-10">
                    <span className="text-xs uppercase tracking-wider text-[#FFDE59] font-bold">Exclusivo</span>
                    <p className="text-white text-sm font-medium mt-1">Primeiros 30 dias grátis!</p>
                  </div>
                </div>
                <span className="text-xs text-white mt-2 flex items-center">
                  <span className="text-[#FFDE59] mr-1">→</span> Sem taxa de adesão
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Linha divisória */}
        <motion.div 
          className="border-t border-white/10 pt-8 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                © {currentYear} Instauto. Todos os direitos reservados.
              </p>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <Heart size={12} className="text-[#FFDE59] mr-1" />
                <span>Feito com amor no Brasil</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link href="/termos" className="text-gray-400 hover:text-[#FFDE59] transition-colors hover:underline">Termos</Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-[#FFDE59] transition-colors hover:underline">Privacidade</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-[#FFDE59] transition-colors hover:underline">Cookies</Link>
              <Link href="#topo" className="text-[#FFDE59] flex items-center group">
                <span className="mr-1">Topo</span>
                <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
