import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export const SalesRevenueChart = ({
  data = [],
  timeframe = '30d',
  onTimeframeChange,
  title = 'Sales & Net Earnings Over Time'
}) => {
  const timeframes = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-stone-700">
          <p className="font-semibold text-stone-300">{label}</p>
          <p className="text-amber-400 font-mono">
            Gross Sales: {formatCurrency(payload[0]?.value || 0)}
          </p>
          {payload[1] && (
            <p className="text-emerald-400 font-mono">
              Net Earnings: {formatCurrency(payload[1]?.value || 0)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-stone-900">{title}</h3>
          <p className="text-xs text-stone-500">Real-time financial trends from your artisan store</p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center bg-artisan-100 p-1 rounded-xl border border-stone-200">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => onTimeframeChange(tf.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeframe === tf.value
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-stone-400 bg-artisan-50/50 rounded-2xl border border-dashed border-stone-200">
            No sales recorded in this timeframe. Orders will appear here automatically.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C85A32" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C85A32" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D5A43" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2D5A43" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE4D6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} />
              <YAxis tick={{ fontSize: 11, fill: '#78716c' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                name="Gross Sales"
                stroke="#C85A32"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#salesGrad)"
              />
              <Area
                type="monotone"
                dataKey="earnings"
                name="Net Earnings"
                stroke="#2D5A43"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#earningsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesRevenueChart;
