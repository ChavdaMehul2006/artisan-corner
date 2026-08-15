import React from 'react';

export const StatsCard = ({ title, value, subtext, icon: Icon, color = 'terracotta' }) => {
  const colorStyles = {
    terracotta: 'bg-terracotta-50 text-terracotta-600 border-terracotta-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    stone: 'bg-stone-100 text-stone-700 border-stone-200'
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{title}</span>
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colorStyles[color] || colorStyles.terracotta}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h4 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
          {value}
        </h4>
        {subtext && <p className="text-xs text-stone-500 mt-1.5">{subtext}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
