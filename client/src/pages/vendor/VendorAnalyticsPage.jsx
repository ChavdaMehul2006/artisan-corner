import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, BarChart3, ShoppingBag } from 'lucide-react';
import SalesRevenueChart from '../../components/vendor/SalesRevenueChart';
import TopProductsList from '../../components/vendor/TopProductsList';
import StatsCard from '../../components/vendor/StatsCard';
import { formatCurrency } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';

export const VendorAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (tf) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/vendor/analytics?timeframe=${tf}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
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
    currentMonthSales: 0,
    currentMonthEarnings: 0,
    totalItemsSold: 0
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Studio Financial Analytics
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Detailed sales trends, net profit margins, and volume over time
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Current Month Sales"
          value={formatCurrency(overview.currentMonthSales)}
          subtext={`Net: ${formatCurrency(overview.currentMonthEarnings)}`}
          icon={Calendar}
          color="amber"
        />
        <StatsCard
          title="Lifetime Net Earnings"
          value={formatCurrency(overview.totalEarnings)}
          subtext="After 5% platform fee"
          icon={DollarSign}
          color="emerald"
        />
        <StatsCard
          title="Lifetime Gross Sales"
          value={formatCurrency(overview.totalSales)}
          subtext="Total marketplace volume"
          icon={TrendingUp}
          color="terracotta"
        />
        <StatsCard
          title="Artisan Units Sold"
          value={overview.totalItemsSold || 0}
          subtext="Handcrafted items delivered"
          icon={ShoppingBag}
          color="stone"
        />
      </div>

      {/* Main Chart */}
      <SalesRevenueChart
        data={data?.salesOverTime || []}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        title="Revenue Performance Trend"
      />

      {/* Top Products Table */}
      <TopProductsList topProducts={data?.topProducts || []} />
    </div>
  );
};

export default VendorAnalyticsPage;
