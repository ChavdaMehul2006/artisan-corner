import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, Truck, Package, ShieldCheck, Star } from 'lucide-react';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import axiosClient from '../api/axiosClient';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order detail', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-terracotta-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Order Not Found</h2>
        <Link to="/orders" className="text-xs font-semibold text-terracotta-600">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Order #{order.orderNumber}
            </h1>
            <StatusBadge status={order.orderStatus} type="order" />
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-400">Total Charged</span>
          <p className="font-mono text-2xl font-extrabold text-stone-900">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-artisan-100 text-terracotta-600 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-stone-900 text-sm">Shipping Address</h4>
          <p className="text-stone-700 font-medium">{order.shippingAddress?.fullName}</p>
          <p className="text-stone-600">{order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}</p>
          <p className="text-stone-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
          <p className="text-stone-500 font-mono pt-1">Phone: {order.shippingAddress?.phone}</p>
        </div>
      </div>

      {/* Items Breakdown */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
          Purchased Artisan Items
        </h3>

        <div className="divide-y divide-stone-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200'}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">{item.productName}</h4>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                  {item.product?.slug && (
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="inline-block text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 mt-1"
                    >
                      Write Verified Review →
                    </Link>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-sm font-bold text-stone-900">
                  {formatCurrency(item.subtotal)}
                </span>
                <div className="mt-1">
                  <StatusBadge status={item.itemStatus || order.orderStatus} type="order" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-6 border-t border-stone-200 space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Sales Tax (5%)</span>
            <span className="font-mono">{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-emerald-700 font-semibold">FREE</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-stone-900 pt-3 border-t border-stone-100">
            <span>Total Amount</span>
            <span className="font-mono text-lg">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
