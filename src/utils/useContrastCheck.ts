import { useEffect } from 'react';

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

// Função para converter RGB para hexadecimal
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
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
const calculateContrast = (
  color1: string,
  color2: string
): number | null => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return null;

  const luminance1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
  const luminance2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Hook para verificar o contraste entre cores
const useContrastCheck = (
  minContrast: number = 4.5,
  highlightProblems: boolean = true
): void => {
  useEffect(() => {
    // Verificação para ambiente de desenvolvimento - retorna imediatamente se estiver em produção
    if (process.env.NODE_ENV !== 'development') return;
    
    console.log('🔍 Verificando contraste em elementos da página...');
    
    // Função para obter cor computada de um elemento
    const getComputedColor = (element: Element, property: string): string => {
      const style = window.getComputedStyle(element);
      const color = style.getPropertyValue(property);
      
      // Converter rgb(r, g, b) para hex
      if (color.startsWith('rgb')) {
        const rgb = color.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          return rgbToHex(
            parseInt(rgb[0], 10),
            parseInt(rgb[1], 10),
            parseInt(rgb[2], 10)
          );
        }
      }
      
      return color;
    };
    
    // Verificar todos os elementos de texto visíveis
    const checkElements = () => {
      const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, li, label, div');
      
      textElements.forEach((element) => {
        // Ignorar elementos sem conteúdo de texto
        if (!element.textContent?.trim()) return;
        
        // Ignorar elementos ocultos
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;
        
        // Obter cores computadas
        const textColor = getComputedColor(element, 'color');
        const bgColor = getComputedColor(element, 'background-color');
        
        // Ignorar elementos com fundo transparente
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') return;
        
        // Calcular contraste
        const contrast = calculateContrast(textColor, bgColor);
        
        if (contrast !== null && contrast < minContrast) {
          console.warn(
            `Contraste insuficiente (${contrast.toFixed(2)}:1) em:`,
            element,
            `\nTexto: ${textColor}, Fundo: ${bgColor}`
          );
          
          // Removida toda a lógica que modificava o DOM com outlines vermelhos e tooltips
          // O aviso agora é exibido apenas no console
        }
      });
    };
    
    // Executar verificação após o carregamento completo da página
    setTimeout(checkElements, 1000);
    
  }, [minContrast, highlightProblems]);
};

export default useContrastCheck; 