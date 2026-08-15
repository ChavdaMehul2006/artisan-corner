import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, ShoppingBag, Package, PlusCircle, AlertCircle } from 'lucide-react';
import StatsCard from '../../components/vendor/StatsCard';
import SalesRevenueChart from '../../components/vendor/SalesRevenueChart';
import TopProductsList from '../../components/vendor/TopProductsList';
import { formatCurrency } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';

export const VendorOverviewPage = () => {
  const [data, setData] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (tf) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/vendor/analytics?timeframe=${tf}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load vendor analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeframe);
  }, [timeframe]);

  const overview = data?.overview || {
    totalSales: 0,
    totalEarnings: 0,
    platformCommission: 0,
    totalItemsSold: 0,
    pendingOrders: 0,
    totalProducts: 0
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Artisan Studio Overview
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Monitor sales performance, earnings breakdown, and active orders
          </p>
        </div>

        <Link
          to="/dashboard/seller/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-bold transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Craft</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Net Vendor Earnings"
          value={formatCurrency(overview.totalEarnings)}
          subtext="Your 95% revenue payout"
          icon={DollarSign}
          color="emerald"
        />
        <StatsCard
          title="Gross Sales"
          value={formatCurrency(overview.totalSales)}
          subtext={`${overview.totalItemsSold || 0} handcrafted units`}
          icon={TrendingUp}
          color="terracotta"
        />
        <StatsCard
          title="Platform Commission"
          value={formatCurrency(overview.platformCommission)}
          subtext="5% fair marketplace fee"
          icon={AlertCircle}
          color="amber"
        />
        <StatsCard
          title="Pending Fulfillment"
          value={overview.pendingOrders}
          subtext={`${overview.totalProducts || 0} active products in studio`}
          icon={ShoppingBag}
          color="indigo"
        />
      </div>

      {/* Chart and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <SalesRevenueChart
            data={data?.salesOverTime || []}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            title="Studio Revenue Over Time"
          />
        </div>

        <div className="lg:col-span-4">
          <TopProductsList topProducts={data?.topProducts || []} />
        </div>
      </div>
    </div>
  );
};

export default VendorOverviewPage;
