"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
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
    <footer className="relative bg-gradient-to-b from-[#031023] to-[#020A14] text-white pt-20 pb-10 overflow-hidden" data-contrast="dark">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0047CC]/30 to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.07]"></div>
      <div className="absolute top-20 -right-20 w-64 h-64 bg-[#0047CC]/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 -left-20 w-64 h-64 bg-[#FFDE59]/5 rounded-full blur-[100px]"></div>
      
      {/* Partículas decorativas */}
      <div className="absolute top-10 left-[10%] w-1 h-1 bg-[#FFDE59]/30 rounded-full"></div>
      <div className="absolute top-[30%] right-[15%] w-2 h-2 bg-[#0047CC]/20 rounded-full"></div>
      <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 bg-[#FFDE59]/20 rounded-full"></div>
      <div className="absolute top-[70%] right-[30%] w-1 h-1 bg-[#0047CC]/30 rounded-full"></div>
      
      <div className="container-custom relative z-10">
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
            <Link href="/oficinas" className="inline-block mb-6 relative group">
              <Image 
                src="/images/logo.svg" 
                alt="Instauto Logo" 
                width={150} 
                height={40}
                className="h-10 w-auto"
              />
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#0047CC]/0 via-[#0047CC] to-[#0047CC]/0"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </Link>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              Conectando motoristas e oficinas de forma rápida e transparente. Gerencie sua oficina com o sistema mais completo do mercado.
            </p>
            
            <div className="flex space-x-5 mb-8">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0047CC]/10 hover:bg-[#0047CC] flex items-center justify-center transition-colors duration-300 group"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0047CC]/10 hover:bg-[#0047CC] flex items-center justify-center transition-colors duration-300 group"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0047CC]/10 hover:bg-[#0047CC] flex items-center justify-center transition-colors duration-300 group"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Youtube className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </motion.a>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
                whileHover={{ x: 3 }}
              >
                <div className="w-8 h-8 rounded-full bg-[#0047CC]/10 flex items-center justify-center mr-3 group-hover:bg-[#0047CC]/20 transition-colors">
                  <Mail className="w-4 h-4 text-[#0047CC]" />
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
                  <div className="w-8 h-8 rounded-full bg-[#0047CC]/10 flex items-center justify-center mr-3 group-hover:bg-[#0047CC]/20 transition-colors">
                    <Phone className="w-4 h-4 text-[#0047CC]" />
                  </div>
                  <span>(43) 99646-6446</span>
                </a>
              </motion.div>
              <motion.div 
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
                whileHover={{ x: 3 }}
              >
                <div className="w-8 h-8 rounded-full bg-[#0047CC]/10 flex items-center justify-center mr-3 group-hover:bg-[#0047CC]/20 transition-colors flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#0047CC]" />
                </div>
                <span className="flex items-center">Londrina, PR. Brasil</span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Links rápidos */}
          <motion.div variants={fadeInUp} className="md:col-span-2">
            <h3 className="font-bold text-lg mb-5 font-syne text-white relative inline-block">
              Produto
              <motion.span 
                className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FFDE59]"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              ></motion.span>
            </h3>
            <ul className="space-y-3">
              {["Para Motoristas", "Para Oficinas", "Preços", "Aplicativo", "Recursos"].map((item, index) => (
                <motion.li key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link href={item === "Para Oficinas" ? "/oficinas" : 
                               item === "Para Motoristas" ? "/motorista" : 
                               item === "Preços" ? "#planos" :
                               item === "Recursos" ? "#beneficios" : 
                               "/"} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE59] mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} className="md:col-span-2">
            <h3 className="font-bold text-lg mb-5 font-syne text-white relative inline-block">
              Empresa
              <motion.span 
                className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FFDE59]"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              ></motion.span>
            </h3>
            <ul className="space-y-3">
              {["Sobre nós", "Contato", "Blog", "Carreiras", "Imprensa"].map((item, index) => (
                <motion.li key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link href={`/${item.toLowerCase().replace(/\s/g, '')}`} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE59] mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
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
              {["FAQ", "Termos de Uso", "Privacidade", "Cookies", "Central de Ajuda"].map((item, index) => (
                <motion.li key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link href={item === "FAQ" ? "#faq" : 
                               `/${item.toLowerCase().replace(/\s/g, '')}`} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE59] mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Newsletter */}
          <motion.div variants={fadeInUp} className="md:col-span-2">
            <h3 className="font-bold text-lg mb-5 font-syne text-white relative inline-block">
              Newsletter
              <motion.span 
                className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FFDE59]"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              ></motion.span>
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Receba novidades e dicas para sua oficina
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="w-full bg-[#0A1429] border border-gray-800 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent transition-all"
                />
              </div>
              <motion.button 
                type="submit" 
                className="bg-[#0047CC] hover:bg-[#003DA6] text-white font-medium py-2.5 px-4 rounded-lg transition-colors w-full flex items-center justify-center group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Inscrever-se</span>
                <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Linha divisória */}
        <motion.div 
          className="border-t border-gray-800 pt-8 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {currentYear} Instauto. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <Link href="/termos" className="text-gray-400 hover:text-white transition-colors hover:underline">Termos</Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors hover:underline">Privacidade</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors hover:underline">Cookies</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 