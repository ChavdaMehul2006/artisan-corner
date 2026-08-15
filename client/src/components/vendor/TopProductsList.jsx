import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export const TopProductsList = ({ topProducts = [] }) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
      <h3 className="font-serif text-lg font-bold text-stone-900">
        Top Performing Crafts
      </h3>

      {topProducts.length === 0 ? (
        <p className="text-xs text-stone-400 py-6 text-center">No sales recorded yet.</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {topProducts.map((p, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={p.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200'}
                  alt={p.name}
                  className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                />
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-stone-900 truncate max-w-xs">{p.name}</h5>
                  <span className="text-[11px] text-stone-500">{p.unitsSold} units sold</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-stone-900">
                {formatCurrency(p.totalRevenue)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProductsList;
