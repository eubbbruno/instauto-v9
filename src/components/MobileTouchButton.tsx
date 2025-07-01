import { ReactNode } from 'react';

interface MobileTouchButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function MobileTouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false
}: MobileTouchButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 touch-manipulation";
  
  // Minimum touch target: 44px (Apple) / 48px (Material Design)
  const sizeClasses = {
    sm: "px-4 py-3 text-sm min-h-[44px]", // Mobile-first: increased padding
    md: "px-6 py-4 text-base min-h-[48px]", 
    lg: "px-8 py-4 text-lg min-h-[52px]"
  };
  
  const styles = {
    primary: "bg-[#0047CC] text-white hover:bg-[#003CAD] active:bg-[#002E8A] shadow-sm",
    secondary: "border border-[#0047CC] text-[#0047CC] hover:bg-[#0047CC]/5 active:bg-[#0047CC]/10 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm",
    warning: "bg-[#FFDE59] text-[#0047CC] hover:bg-[#E6C850] active:bg-[#D4B647] shadow-sm",
    ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const widthClasses = fullWidth ? "w-full" : "";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${styles[variant]} 
        ${disabledClasses} 
        ${widthClasses}
        ${className}
      `}
    >
      {children}
    </button>
  );
} 