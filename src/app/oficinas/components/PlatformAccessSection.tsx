"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";
import { 
  DevicePhoneMobileIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  BellIcon,
  CalendarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />,
    title: "Atualizações automáticas",
    description: "Sempre com as últimas funcionalidades sem precisar baixar nada"
  },
  {
    icon: <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />,
    title: "Acesso de qualquer lugar",
    description: "Gerencie sua oficina mesmo quando estiver fora, com total segurança"
  },
  {
    icon: <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />,
    title: "Compatível com todos dispositivos",
    description: "Funciona perfeitamente em iPhone, Android, tablets e computadores"
  }
];

// Lista de notificações para demonstração interativa
const notifications = [
  {
    name: "Carlos Mendes",
    service: "Troca de óleo - Civic 2022",
    status: "Novo",
    time: "Agora"
  },
  {
    name: "Ana Paula Silva",
    service: "Revisão completa - Corolla 2020",
    status: "Orçamento",
    time: "10 min"
  },
  {
    name: "Roberto Alvarez",
    service: "Troca de pastilhas - Jeep Compass",
    status: "Agendado",
    time: "1h atrás"
  }
];

const PlatformAccessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [activeNotification, setActiveNotification] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Efeitos de parallax baseados no scroll
  const phoneY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.6, 1, 1, 0.6]);
  const textY = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [50, 0, 0, -50]);
  
  // Animação de flutuação suave para o telefone
  const floatAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Trocar notificação a cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotification(prev => (prev + 1) % notifications.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      data-contrast="light"
    >
      {/* Fundo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-light/30 to-white">
        <div className="absolute w-full h-full bg-grid-pattern opacity-5"></div>
        
        {/* Círculos decorativos */}
        <motion.div 
          className="absolute -right-32 top-1/3 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 50]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.7, 0.4])
          }}
        />
        <motion.div 
          className="absolute -left-32 bottom-1/4 w-80 h-80 rounded-full bg-yellow-400/10 blur-3xl"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [50, -50]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          {/* Coluna de texto - 3/5 em desktop */}
          <motion.div
            className="md:col-span-3 relative z-10"
            style={{ opacity: textOpacity, y: textY }}
          >
            <div className="relative h-8 flex items-center mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-blue-600/10 text-blue-600 px-5 py-1.5 rounded-full text-sm font-medium">
                  Mobilidade total
                </span>
              </motion.div>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 font-syne text-text-base relative inline-block"
            >
              Use no celular, <br className="hidden md:block" />sem instalar nada
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue/0 via-blue to-blue/0"></div>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-700 mb-8 text-lg font-sans max-w-xl"
            >
              O painel do Instauto é 100% responsivo. Basta abrir no navegador do seu 
              celular ou tablet e gerenciar sua oficina de qualquer lugar, com total 
              praticidade e segurança.
            </motion.p>
            
            <div className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 mr-4 relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                      {feature.icon}
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-green-500/20"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatDelay: index * 1.5,
                        ease: "easeOut" 
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-syne mb-1 text-text-base">{feature.title}</h3>
                    <p className="text-gray-700 font-sans">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/cadastro" 
                className="btn-primary group inline-flex items-center"
              >
                <span className="font-sans">Começar a usar agora</span>
                <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Coluna do telefone - 2/5 em desktop */}
          <motion.div
            className="md:col-span-2 relative z-10 flex justify-center md:justify-end"
            style={{
              y: phoneY,
              rotateZ: phoneRotate
            }}
          >
            <motion.div
              ref={phoneRef}
              className="relative max-w-[320px]"
              animate={floatAnimation}
            >
              {/* Reflexo do mockup - efeito de vidro */}
              <div className="absolute -inset-4 bg-white/30 backdrop-blur-xl rounded-[45px] -z-10 opacity-60 rotate-3"></div>
              
              {/* Frame do telefone */}
              <div className="bg-gray-900 rounded-[40px] p-3 shadow-2xl relative z-10 border-4 border-gray-800">
                {/* Notch do telefone */}
                <div className="absolute top-3 left-1/2 w-24 h-6 bg-black rounded-b-xl -translate-x-1/2 flex items-center justify-center overflow-hidden z-20">
                  <div className="w-12 h-4 bg-gray-800 rounded-full absolute"></div>
                  <div className="w-3 h-3 bg-gray-700 rounded-full absolute right-4"></div>
                </div>
                
                <div className="h-[580px] bg-brand-light rounded-[32px] overflow-hidden border border-gray-700 relative">
                  {/* Barra de status */}
                  <div className="bg-blue-700 px-5 py-3 text-white">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium font-sans">Instauto Oficina</div>
                      <div className="flex items-center space-x-3">
                        <BellIcon className="h-5 w-5 text-white/80" />
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                          <span className="text-xs">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conteúdo do app */}
                  <div className="flex-1 p-4">
                    {/* Card de resumo */}
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-neutral-100"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm font-bold text-text-base font-sans">Resumo do dia</div>
                        <ClockIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-blue-600/10 p-2 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1 font-sans">Orçamentos</div>
                          <div className="text-blue-600 font-bold flex items-baseline">
                            4 <span className="text-green-500 text-xs ml-1">+2</span>
                          </div>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1 font-sans">Agendados</div>
                          <div className="text-green-600 font-bold">7</div>
                        </div>
                        <div className="bg-yellow-400/20 p-2 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1 font-sans">Entregas</div>
                          <div className="text-yellow-700 font-bold">3</div>
                        </div>
                      </div>
                      
                      <div className="mb-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 font-sans">Ocupação do dia</span>
                          <span className="text-blue-600 font-medium font-sans">75%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-blue-600 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                          ></motion.div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Card de notificações com carousel */}
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-neutral-100"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm font-bold text-text-base font-sans">Novos orçamentos</div>
                        <div className="text-xs text-blue-600 font-sans">Ver todos</div>
                      </div>
                      
                      <div className="relative h-[80px] overflow-hidden">
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={index}
                            className="absolute inset-0 bg-brand-light p-3 rounded-lg"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ 
                              opacity: activeNotification === index ? 1 : 0,
                              x: activeNotification === index ? 0 : 50,
                              zIndex: activeNotification === index ? 10 : 0
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="flex justify-between">
                              <div>
                                <div className="text-sm font-medium text-text-base font-sans">{notification.name}</div>
                                <div className="text-xs text-gray-600 font-sans">{notification.service}</div>
                                <div className="text-xs text-gray-500 font-sans mt-1 flex items-center">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  {notification.time}
                                </div>
                              </div>
                              <div className={`h-fit text-xs px-2 py-1 rounded-full font-sans ${
                                notification.status === "Novo" 
                                  ? "bg-yellow-100 text-yellow-800" 
                                  : notification.status === "Orçamento" 
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {notification.status}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Indicadores de paginação */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1">
                          {notifications.map((_, index) => (
                            <motion.div
                              key={index}
                              className="h-1 rounded-full bg-gray-300"
                              animate={{ 
                                width: activeNotification === index ? "10px" : "5px",
                                backgroundColor: activeNotification === index ? "#0047CC" : "#D1D5DB"
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Botões de navegação */}
                    <motion.div 
                      className="grid grid-cols-4 gap-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[
                        { icon: <DevicePhoneMobileIcon className="h-5 w-5 text-blue-600" />, label: "Orçamentos" },
                        { icon: <CalendarIcon className="h-5 w-5 text-blue-600" />, label: "Agenda" },
                        { icon: <UserGroupIcon className="h-5 w-5 text-blue-600" />, label: "Clientes" },
                        { icon: <ChartBarIcon className="h-5 w-5 text-blue-600" />, label: "Relatórios" }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          className="bg-white p-2 rounded-xl shadow-sm flex flex-col items-center border border-neutral-100"
                          whileHover={{ y: -3, backgroundColor: "#EAF4FF" }}
                        >
                          {item.icon}
                          <div className="text-xs text-center text-text-base mt-1 font-sans">{item.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    {/* Barra inferior de navegação */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between">
                      <div className="h-1 w-12 rounded-full bg-gray-900 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Efeitos de luz ao redor do telefone */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl -z-10"></div>
              
              {/* Reflexos na tela */}
              <div className="absolute top-10 left-10 w-20 h-[400px] bg-white/10 rounded-full blur-xl rotate-45 transform -translate-x-1/2 -z-5"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlatformAccessSection; 