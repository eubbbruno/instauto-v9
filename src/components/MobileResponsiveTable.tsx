import { ReactNode } from 'react';

interface MobileResponsiveTableProps<T = unknown> {
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  renderMobileCard: (item: T, index: number) => ReactNode;
  className?: string;
}

export default function MobileResponsiveTable<T = unknown>({
  headers,
  data,
  renderRow,
  renderMobileCard,
  className = ""
}: MobileResponsiveTableProps<T>) {
  return (
    <>
      {/* Desktop Table */}
      <div className={`hidden md:block overflow-x-auto ${className}`}>
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => renderMobileCard(item, index))}
      </div>
    </>
  );
} 