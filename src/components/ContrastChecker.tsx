"use client";

import { useEffect } from 'react';
import useContrastCheck from '@/utils/useContrastCheck';

const ContrastChecker = () => {
  // Em vez de retornar null logo no início, usamos uma variável para controlar
  // se devemos ou não executar a lógica dentro dos hooks
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Usar o hook melhorado para verificar contraste (agora apenas exibe no console)
  // O hook internamente já verifica se está em ambiente de desenvolvimento
  useContrastCheck(4.5, true);
  
  // Verificar combinações de cores específicas
  useEffect(() => {
    // Retorna imediatamente se não estiver em ambiente de desenvolvimento
    if (!isDevelopment) return;
    
    // Lista de combinações de cores para verificar
    const colorPairs = [
      // Fundos escuros com texto claro
      { bg: '#031023', text: '#FFFFFF', name: 'Fundo brand-dark com texto branco' },
      { bg: '#0A2ADA', text: '#FFFFFF', name: 'Fundo brand-blue com texto branco' },
      { bg: '#0047CC', text: '#FFFFFF', name: 'Fundo azul com texto branco' },
      { bg: '#0047CC', text: '#FFCC00', name: 'Fundo azul com texto amarelo' },
      { bg: '#0047CC', text: '#FFDE59', name: 'Fundo azul com texto amarelo claro' },
      
      // Fundos claros com texto escuro
      { bg: '#FFFFFF', text: '#0F172A', name: 'Fundo branco com texto text-base' },
      { bg: '#EAF4FF', text: '#0A2ADA', name: 'Fundo brand-light com texto brand-blue' },
      { bg: '#EAF4FF', text: '#0F172A', name: 'Fundo brand-light com texto text-base' },
      { bg: '#FFFBEA', text: '#0F172A', name: 'Fundo brand-yellow com texto text-base' },
      { bg: '#FFFBEA', text: '#0A2ADA', name: 'Fundo brand-yellow com texto brand-blue' },
      
      // Combinações potencialmente problemáticas
      { bg: '#FFFFFF', text: '#A3A3A3', name: 'Fundo branco com texto cinza' },
      { bg: '#0A2ADA', text: '#0047CC', name: 'Fundo brand-blue com texto azul' },
    ];
    
    // Função para converter cor hexadecimal para RGB
    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };
    
    // Função para calcular a luminância relativa de uma cor
    const calculateLuminance = (r: number, g: number, b: number): number => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    
    // Função para calcular o contraste entre duas cores
    const calculateContrast = (color1: string, color2: string): number => {
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      
      if (!rgb1 || !rgb2) return 0;
      
      const luminance1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
      const luminance2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
      
      const brightest = Math.max(luminance1, luminance2);
      const darkest = Math.min(luminance1, luminance2);
      
      return (brightest + 0.05) / (darkest + 0.05);
    };
    
    console.log('Verificando contraste das combinações de cores específicas...');
    
    colorPairs.forEach(pair => {
      const contrast = calculateContrast(pair.bg, pair.text);
      const isAccessible = contrast >= 4.5;
      
      if (!isAccessible) {
        console.warn(
          `Contraste insuficiente (${contrast.toFixed(2)}:1) para ${pair.name}. O mínimo recomendado é 4.5:1.`
        );
      } else {
        console.log(
          `Contraste adequado (${contrast.toFixed(2)}:1) para ${pair.name}.`
        );
      }
    });
  }, [isDevelopment]);
  
  // Retorna null de qualquer forma, já que é um componente invisível
  return null;
};

export default ContrastChecker; 