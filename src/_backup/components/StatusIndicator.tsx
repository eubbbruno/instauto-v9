"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface StatusIndicatorProps {
  type?: StatusType;
  message: string;
  description?: string;
  isVisible?: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
  className?: string;
  position?: 'top' | 'bottom' | 'inline';
  actions?: React.ReactNode;
}

export default function StatusIndicator({
  type = 'info',
  message,
  description,
  isVisible = true,
  autoHideDuration,
  onClose,
  className = '',
  position = 'top',
  actions
}: StatusIndicatorProps) {
  const [isShowing, setIsShowing] = useState(isVisible);
  
  // Esconder automaticamente após autoHideDuration
  useEffect(() => {
    if (autoHideDuration && isVisible) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        if (onClose) onClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, isVisible, onClose]);
  
  // Atualizar visibilidade quando a prop isVisible mudar
  useEffect(() => {
    setIsShowing(isVisible);
  }, [isVisible]);
  
  // Lidar com o fechamento manual
  const handleClose = () => {
    setIsShowing(false);
    if (onClose) onClose();
  };
  
  // Obter ícone com base no tipo
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case 'loading':
        return <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };
  
  // Obter estilo de borda com base no tipo
  const getBorderStyle = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };
  
  // Obter posicionamento
  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md';
      case 'bottom':
        return 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md';
      case 'inline':
      default:
        return '';
    }
  };
  
  // Animações
  const variants = {
    hidden: { 
      opacity: 0, 
      y: position === 'bottom' ? 20 : position === 'top' ? -20 : 0,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          className={`${getPositionStyle()} ${className}`}
        >
          <div className={`p-4 rounded-lg border shadow-sm ${getBorderStyle()}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-sm font-medium ${
                  type === 'success' ? 'text-green-800' :
                  type === 'error' ? 'text-red-800' :
                  type === 'warning' ? 'text-yellow-800' :
                  'text-blue-800'
                }`}>
                  {message}
                </h3>
                {description && (
                  <div className={`mt-1 text-sm ${
                    type === 'success' ? 'text-green-700' :
                    type === 'error' ? 'text-red-700' :
                    type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    {description}
                  </div>
                )}
                {actions && (
                  <div className="mt-3">
                    {actions}
                  </div>
                )}
              </div>
              {onClose && (
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    type="button"
                    className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      type === 'success' ? 'text-green-500 hover:text-green-600 focus:ring-green-500' :
                      type === 'error' ? 'text-red-500 hover:text-red-600 focus:ring-red-500' :
                      type === 'warning' ? 'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-500' :
                      'text-blue-500 hover:text-blue-600 focus:ring-blue-500'
                    }`}
                    onClick={handleClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 