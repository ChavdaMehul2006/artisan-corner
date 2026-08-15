import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, MapPin } from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/admin/orders?status=${statusFilter}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Marketplace Global Orders
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Track transactions, platform commission retention, and multi-vendor fulfillment
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="PROCESSING">Processing</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-stone-950/80 rounded-3xl border border-stone-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Buyer</th>
                <th className="py-3.5 px-4">Gross Total</th>
                <th className="py-3.5 px-4">Platform Fee (5%)</th>
                <th className="py-3.5 px-4">Vendor Payout</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-normal">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-stone-500">
                    No marketplace orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-stone-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-stone-300">
                      {o.buyer?.name || 'Artisan Buyer'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      {formatCurrency(o.platformFee)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-indigo-300">
                      {formatCurrency(o.vendorPayout)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.paymentStatus === 'PAID'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={o.orderStatus} type="order" />
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">
                      {formatDate(o.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
