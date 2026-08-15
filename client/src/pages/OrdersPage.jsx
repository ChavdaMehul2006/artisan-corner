import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, MapPin, Eye } from 'lucide-react';
import { StatusBadge } from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';
import axiosClient from '../api/axiosClient';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/orders/my-orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-terracotta-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Package}
          title="No orders placed yet"
          description="When you purchase handcrafted goods from our makers, your order tracking timeline will appear here."
          actionText="Browse Artisan Crafts"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          My Artisan Orders
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Track and review your purchases ({orders.length} orders on record)
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-5 hover:border-stone-300 transition-colors"
          >
            {/* Top order metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-stone-900">
                    {order.orderNumber}
                  </span>
                  <StatusBadge status={order.orderStatus} type="order" />
                </div>
                <p className="text-xs text-stone-400">
                  Ordered on {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-base font-extrabold text-stone-900">
                  {formatCurrency(order.totalAmount)}
                </span>
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-artisan-100 hover:bg-artisan-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </Link>
              </div>
            </div>

            {/* Items list */}
            <div className="divide-y divide-stone-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200'}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">{item.productName}</h4>
                      <p className="text-[11px] text-stone-500 font-mono">
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-stone-900 shrink-0">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
