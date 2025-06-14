"use client";

import { useState, useCallback } from 'react';
import { StatusType } from '@/components/StatusIndicator';

interface StatusState {
  isVisible: boolean;
  type: StatusType;
  message: string;
  description?: string;
  autoHideDuration?: number;
}

const initialState: StatusState = {
  isVisible: false,
  type: 'info',
  message: '',
  description: undefined,
  autoHideDuration: 5000, // 5 segundos por padrão
};

export function useStatus() {
  const [status, setStatus] = useState<StatusState>(initialState);
  
  const showStatus = useCallback((
    type: StatusType,
    message: string,
    description?: string,
    autoHideDuration?: number
  ) => {
    setStatus({
      isVisible: true,
      type,
      message,
      description,
      autoHideDuration: autoHideDuration ?? initialState.autoHideDuration,
    });
  }, []);
  
  const hideStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, isVisible: false }));
  }, []);
  
  // Métodos de conveniência para diferentes tipos de status
  const showSuccess = useCallback((message: string, description?: string, duration?: number) => {
    showStatus('success', message, description, duration);
  }, [showStatus]);
  
  const showError = useCallback((message: string, description?: string, duration?: number) => {
    showStatus('error', message, description, duration);
  }, [showStatus]);
  
  const showWarning = useCallback((message: string, description?: string, duration?: number) => {
    showStatus('warning', message, description, duration);
  }, [showStatus]);
  
  const showInfo = useCallback((message: string, description?: string, duration?: number) => {
    showStatus('info', message, description, duration);
  }, [showStatus]);
  
  const showLoading = useCallback((message: string, description?: string) => {
    showStatus('loading', message, description, 0); // Sem auto-hide para loading
  }, [showStatus]);
  
  return {
    status,
    showStatus,
    hideStatus,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
  };
} 