import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, colorClass = "bg-white" }) => {
  // Ajustar tamanho da fonte baseado no comprimento do valor
  const getValueFontSize = () => {
    const length = value.length;
    if (length <= 10) return "text-2xl"; // Normal
    if (length <= 15) return "text-xl"; // Médio
    if (length <= 20) return "text-lg"; // Pequeno
    return "text-base"; // Muito pequeno para valores muito grandes
  };

  return (
    <div className={`${colorClass} rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md card`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className={`${getValueFontSize()} font-bold text-gray-800 break-words`}>
            {value}
          </h3>
          {trend && <p className="text-xs text-green-600 mt-2 font-medium">{trend}</p>}
        </div>
        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};