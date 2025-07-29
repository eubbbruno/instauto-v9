import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (item: unknown) => React.ReactNode;
}

interface EmptyMessage {
  title: string;
  description: string;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
}

interface MobileResponsiveTableProps {
  data: unknown[];
  columns: Column[];
  actions?: () => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: EmptyMessage;
  loadingRows?: number;
  className?: string;
}

export default function MobileResponsiveTable({
  data = [],
  columns = [],
  actions,
  isLoading = false,
  emptyMessage,
  loadingRows = 5,
  className = ""
}: MobileResponsiveTableProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`${className}`}>
        {/* Desktop Loading */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.label}
                  </th>
                ))}
                {actions && <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: loadingRows }).map((_, index) => (
                <tr key={index}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Loading */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: loadingRows }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {emptyMessage?.title || 'Nenhum dado encontrado'}
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {emptyMessage?.description || 'Não há itens para exibir no momento.'}
          </p>
          {emptyMessage?.action && (
            <button
              onClick={emptyMessage.action.onClick}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {emptyMessage.action.icon}
              {emptyMessage.action.label}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              {actions && <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                                 {columns.map((column, colIndex) => (
                   <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                     {column.render ? column.render(item) : String((item as Record<string, unknown>)[column.key] || '')}
                   </td>
                 ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {actions()}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-3">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500">{column.label}:</span>
                                     <span className="text-sm text-gray-900 text-right">
                     {column.render ? column.render(item) : String((item as Record<string, unknown>)[column.key] || '')}
                   </span>
                </div>
              ))}
              {actions && (
                <div className="pt-3 border-t border-gray-100">
                  {actions()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 