import React from 'react';

interface MobileResponsiveTableProps {
  headers: string[];
  data: unknown[];
  renderRow: (item: unknown, index: number) => React.ReactNode;
  renderMobileCard: (item: unknown, index: number) => React.ReactNode;
  className?: string;
}

export default function MobileResponsiveTable({
  headers,
  data = [], // Default para array vazio
  renderRow,
  renderMobileCard,
  className = ""
}: MobileResponsiveTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className={`hidden md:block overflow-x-auto ${className}`}>
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              {headers?.map((header, index) => (
                <th key={index} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              )) || null}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data && data.length > 0 
              ? data.map((item, index) => renderRow(item, index))
              : (
                <tr>
                  <td colSpan={headers?.length || 1} className="px-6 py-12 text-center text-gray-500">
                    Nenhum dado encontrado
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data && data.length > 0 
          ? data.map((item, index) => renderMobileCard(item, index))
          : (
            <div className="p-8 text-center text-gray-500">
              <p>Nenhum dado encontrado</p>
            </div>
          )
        }
      </div>
    </>
  );
} 