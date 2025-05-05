"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Dados dos depoimentos
  const testimonials = [
    {
      name: "Ana Silva",
      role: "Motorista de Aplicativo",
      image: "/images/testimonials/ana.jpg", // Substitua pelo caminho real da imagem
      rating: 5,
      text: "O Instauto revolucionou a forma como cuido do meu carro. Como motorista de aplicativo, preciso que meu veículo esteja sempre em perfeitas condições. Com o Instauto, encontro oficinas confiáveis e com preços justos, sem perder tempo."
    },
    {
      name: "Carlos Mendes",
      role: "Engenheiro",
      image: "/images/testimonials/carlos.jpg", // Substitua pelo caminho real da imagem
      rating: 5,
      text: "Sempre tive dificuldade em encontrar uma oficina confiável. Com o Instauto, recebi vários orçamentos e pude escolher a melhor opção. O serviço foi realizado dentro do prazo e do valor acordado. Recomendo a todos!"
    },
    {
      name: "Juliana Costa",
      role: "Empresária",
      image: "/images/testimonials/juliana.jpg", // Substitua pelo caminho real da imagem
      rating: 4,
      text: "Como mulher, sempre me senti insegura em oficinas mecânicas. O Instauto me deu confiança para encontrar profissionais qualificados e transparentes. Agora não me preocupo mais com manutenções do meu carro."
    },
    {
      name: "Roberto Almeida",
      role: "Professor",
      image: "/images/testimonials/roberto.jpg", // Substitua pelo caminho real da imagem
      rating: 5,
      text: "Já economizei mais de R$ 1.000,00 em manutenções usando o Instauto. Posso comparar preços facilmente e os lembretes de manutenção preventiva ajudam a evitar problemas maiores no futuro."
    },
  ];
  
  // Variantes para animação
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };
  
  // Função para avançar para o próximo depoimento
  const nextTestimonial = () => {
    setDirection(1);
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  // Função para voltar para o depoimento anterior
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [current]);
  
  return (
    <section id="depoimentos" className="py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-blue-light text-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            Experiências reais
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            O que nossos usuários dizem
          </h2>
          <p className="text-gray-600 text-lg">
            Milhares de motoristas já tiveram experiências positivas com o Instauto. Confira alguns depoimentos.
          </p>
        </div>
        
        <div 
          ref={carouselRef}
          className="relative max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl bg-white"
        >
          <div className="absolute top-4 right-4 z-10 bg-blue-light text-blue rounded-full p-2">
            <Quote className="w-6 h-6" />
          </div>
          
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="p-8 md:p-12"
            >
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden relative bg-gray-200 border-4 border-blue-light">
                    {/* Se tiver a imagem, use o componente Image, caso contrário, use um placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-blue">
                      {testimonials[current].name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <h3 className="font-bold text-xl">{testimonials[current].name}</h3>
                    <p className="text-gray-500">{testimonials[current].role}</p>
                    
                    <div className="flex items-center justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonials[current].rating ? 'text-yellow fill-yellow' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <blockquote className="text-lg md:text-xl text-gray-700 italic relative">
                    <p className="leading-relaxed">{testimonials[current].text}</p>
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute left-0 right-0 bottom-0 flex justify-between p-4 bg-gradient-to-t from-white to-transparent">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md text-blue hover:bg-blue hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`w-3 h-3 rounded-full ${
                    index === current ? 'bg-blue' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md text-blue hover:bg-blue hover:text-white transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Estatísticas de satisfação */}
        <div className="mt-20 grid md:grid-cols-4 gap-6">
          {[
            {
              value: "97%",
              label: "Clientes satisfeitos",
              description: "Motoristas que recomendariam o Instauto"
            },
            {
              value: "28%",
              label: "Economia média",
              description: "Redução no custo de manutenção do veículo"
            },
            {
              value: "15min",
              label: "Resposta rápida",
              description: "Tempo médio para receber o primeiro orçamento"
            },
            {
              value: "4.8/5",
              label: "Nota média",
              description: "Avaliação das oficinas parceiras"
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="text-3xl font-bold text-blue mb-2">{stat.value}</div>
              <div className="font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 