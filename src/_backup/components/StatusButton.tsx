"use client";

import { useState } from "react";
import { 
  CheckIcon, 
  XMarkIcon, 
  ArrowPathIcon 
} from "@heroicons/react/24/outline";

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

export interface StatusButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status?: ButtonStatus;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  resetAfter?: number;
  onStatusChange?: (status: ButtonStatus) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusButton({
  children,
  status = 'idle',
  loadingText,
  successText,
  errorText,
  resetAfter = 2000, // 2 segundos
  onClick,
  onStatusChange,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  ...props
}: StatusButtonProps) {
  const [internalStatus, setInternalStatus] = useState<ButtonStatus>(status);
  
  // Uso do status interno quando não controlado externamente
  const currentStatus = status === 'idle' ? internalStatus : status;
  
  // Manipular clique com feedback
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (currentStatus === 'loading') return;
    
    try {
      setInternalStatus('loading');
      if (onStatusChange) onStatusChange('loading');
      
      if (onClick) {
        const result = onClick(e) as unknown;
        
        // Se onClick retornar uma Promise, aguardar sua resolução
        if (result instanceof Promise) {
          await result;
          setInternalStatus('success');
          if (onStatusChange) onStatusChange('success');
          
          // Resetar status após sucesso
          if (resetAfter > 0) {
            setTimeout(() => {
              setInternalStatus('idle');
              if (onStatusChange) onStatusChange('idle');
            }, resetAfter);
          }
        }
      }
    } catch (error) {
      setInternalStatus('error');
      if (onStatusChange) onStatusChange('error');
      
      // Resetar status após erro
      if (resetAfter > 0) {
        setTimeout(() => {
          setInternalStatus('idle');
          if (onStatusChange) onStatusChange('idle');
        }, resetAfter);
      }
      console.error('Error in StatusButton:', error);
    }
  };
  
  // Variantes de estilo
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#0047CC] hover:bg-[#0039A6] text-white focus:ring-[#0047CC]/50';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300';
      case 'outline':
        return 'border border-[#0047CC] text-[#0047CC] hover:bg-blue-50 focus:ring-[#0047CC]/30';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50';
      default:
        return 'bg-[#0047CC] hover:bg-[#0039A6] text-white focus:ring-[#0047CC]/50';
    }
  };
  
  // Tamanhos
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-1.5 px-3 text-xs';
      case 'lg':
        return 'py-3 px-6 text-base';
      case 'md':
      default:
        return 'py-2 px-4 text-sm';
    }
  };
  
  // Texto a ser exibido com base no status
  const getButtonText = () => {
    switch (currentStatus) {
      case 'loading':
        return loadingText || children;
      case 'success':
        return successText || children;
      case 'error':
        return errorText || children;
      default:
        return children;
    }
  };
  
  // Ícone a ser exibido com base no status
  const getStatusIcon = () => {
    switch (currentStatus) {
      case 'loading':
        return <ArrowPathIcon className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckIcon className="h-4 w-4" />;
      case 'error':
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled || currentStatus === 'loading'}
      className={`relative inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${disabled || currentStatus === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {getStatusIcon() && (
        <span className="mr-2">
          {getStatusIcon()}
        </span>
      )}
      {getButtonText()}
    </button>
  );
} 