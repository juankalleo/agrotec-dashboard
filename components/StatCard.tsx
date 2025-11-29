import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, colorClass = "bg-white" }) => {
  return (
    <div className={`${colorClass} rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md card`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {trend && <p className="text-xs text-green-600 mt-2 font-medium">{trend}</p>}
        </div>
        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
          {icon}
        </div>
      </div>
    </div>
  );
};