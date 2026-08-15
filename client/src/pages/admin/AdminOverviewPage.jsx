import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Store,
  ShoppingBag,
  Clock,
  Settings
} from 'lucide-react';
import StatsCard from '../../components/vendor/StatsCard';
import { formatCurrency } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/admin/analytics?timeframe=${timeframe}`);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminAnalytics();
  }, [timeframe]);

  const overview = data?.overview || {
    totalUsers: 0,
    totalVendors: 0,
    pendingApplications: 0,
    totalProducts: 0,
    totalOrders: 0,
    grossSales: 0,
    platformEarnings: 0,
    vendorPayouts: 0
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Marketplace Command Center
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Global marketplace metrics, fee revenues, and governance
          </p>
        </div>

        {overview.pendingApplications > 0 && (
          <Link
            to="/dashboard/admin/vendors"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-full text-xs shadow transition-all"
          >
            <Clock className="w-4 h-4" />
            <span>{overview.pendingApplications} Vendor Applications Pending</span>
          </Link>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Platform Fee Revenue"
          value={formatCurrency(overview.platformEarnings)}
          subtext="Net marketplace commission (5%)"
          icon={DollarSign}
          color="indigo"
        />
        <StatsCard
          title="Gross Marketplace GMV"
          value={formatCurrency(overview.grossSales)}
          subtext={`Paid out: ${formatCurrency(overview.vendorPayouts)}`}
          icon={TrendingUp}
          color="emerald"
        />
        <StatsCard
          title="Approved Artisan Stores"
          value={overview.totalVendors}
          subtext={`${overview.totalProducts || 0} active crafts listed`}
          icon={Store}
          color="amber"
        />
        <StatsCard
          title="Registered Users"
          value={overview.totalUsers}
          subtext={`${overview.totalOrders || 0} lifetime orders`}
          icon={Users}
          color="stone"
        />
      </div>

      {/* Recharts Chart: Marketplace GMV & Platform Revenue */}
      <div className="bg-stone-950/80 rounded-3xl border border-stone-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Marketplace Gross Volume & Platform Revenue
            </h3>
            <p className="text-xs text-stone-400">Aggregated order statistics across all artisan vendors</p>
          </div>

          <div className="flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800">
            {['7d', '30d', '90d', '1y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeframe === tf ? 'bg-indigo-600 text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          {data?.trendOverTime?.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-stone-500">
              No orders recorded during this timeframe.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trendOverTime || []}>
                <defs>
                  <linearGradient id="adminGrossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="adminFeeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#292524" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a8a29e' }} />
                <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-stone-900 border border-stone-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-stone-300">{label}</p>
                          <p className="text-indigo-400 font-mono">GMV: {formatCurrency(payload[0]?.value || 0)}</p>
                          <p className="text-emerald-400 font-mono">Fee Revenue: {formatCurrency(payload[1]?.value || 0)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="grossSales"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="url(#adminGrossGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="platformRevenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#adminFeeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
