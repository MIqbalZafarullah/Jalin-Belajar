import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'teal';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorScheme = 'blue'
}) => {
  const schemeStyles: Record<string, { bg: string; iconBg: string }> = {
    blue: {
      bg: 'hover:border-blue-200',
      iconBg: 'bg-blue-50 text-blue-600'
    },
    emerald: {
      bg: 'hover:border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    amber: {
      bg: 'hover:border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600'
    },
    indigo: {
      bg: 'hover:border-indigo-200',
      iconBg: 'bg-indigo-50 text-indigo-600'
    },
    rose: {
      bg: 'hover:border-rose-200',
      iconBg: 'bg-rose-50 text-rose-600'
    },
    teal: {
      bg: 'hover:border-teal-200',
      iconBg: 'bg-teal-50 text-teal-600'
    }
  };

  const scheme = schemeStyles[colorScheme] || schemeStyles.blue;

  return (
    <div className={`p-5 sm:p-6 bg-white rounded-xl border border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md ${scheme.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 tracking-tight">{title}</p>
          <h4 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-full font-semibold ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
          <span className="text-slate-400">vs target semester</span>
        </div>
      )}
    </div>
  );
};
