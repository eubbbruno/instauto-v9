"use client";

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => (
  <motion.div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
);

// Skeleton para texto
export const SkeletonText = ({ 
  lines = 1, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index}
        className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

// Skeleton para avatar
export const SkeletonAvatar = ({ 
  size = 'default',
  className = '' 
}: { 
  size?: 'sm' | 'default' | 'lg'; 
  className?: string; 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <Skeleton className={`${sizeClasses[size]} rounded-full ${className}`} />
  );
};

// Skeleton para cartão
export const SkeletonCard = ({ 
  className = '',
  showAvatar = false,
  lines = 3
}: { 
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}) => (
  <div className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {showAvatar && (
      <div className="flex items-center gap-3 mb-4">
        <SkeletonAvatar />
        <div className="flex-1">
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    )}
    <SkeletonText lines={lines} />
  </div>
);

// Skeleton para tabela
export const SkeletonTable = ({ 
  rows = 5,
  columns = 4,
  className = ''
}: { 
  rows?: number;
  columns?: number;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
    {/* Header */}
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton para lista
export const SkeletonList = ({ 
  items = 5,
  className = '',
  showAvatar = true
}: { 
  items?: number;
  className?: string;
  showAvatar?: boolean;
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        {showAvatar && <SkeletonAvatar />}
        <div className="flex-1">
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

// Skeleton para dashboard
export const SkeletonDashboard = ({ className = '' }: { className?: string }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-3/4" />
            </div>
            <Skeleton className="w-12 h-12 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
    
    {/* Charts/content area */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard lines={8} className="h-80" />
      <SkeletonCard lines={6} className="h-80" />
    </div>
    
    {/* Recent activity */}
    <SkeletonTable rows={6} columns={5} />
  </div>
);

// Skeleton para formulário
export const SkeletonForm = ({ 
  fields = 5,
  className = ''
}: { 
  fields?: number;
  className?: string;
}) => (
  <div className={`space-y-6 ${className}`}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index}>
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-12 w-full" />
      </div>
    ))}
    <div className="flex gap-4 pt-4">
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-12 w-24" />
    </div>
  </div>
);

// Skeleton personalizado por tipo de usuário
export const SkeletonByUserType = ({ 
  userType,
  className = ''
}: { 
  userType: 'motorista' | 'oficina' | 'admin';
  className?: string;
}) => {
  if (userType === 'motorista') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Veículos do motorista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} showAvatar={false} lines={4} />
          ))}
        </div>
        <SkeletonList items={4} />
      </div>
    );
  }
  
  if (userType === 'oficina') {
    return (
      <div className={`space-y-6 ${className}`}>
        <SkeletonDashboard />
      </div>
    );
  }
  
  return <SkeletonDashboard className={className} />;
}; 