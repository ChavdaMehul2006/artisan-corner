import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Store, MapPin } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-4 bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 shadow-artisan">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Payment Confirmed & Order Created
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
          Thank you for supporting independent artisans!
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Your order <strong className="font-mono text-stone-900">{order.orderNumber}</strong> has been received by our makers. You'll receive live status updates as each item is packaged.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/orders"
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold transition-all shadow"
          >
            View All My Orders
          </Link>
          <Link
            to="/products"
            className="px-6 py-2.5 bg-artisan-100 hover:bg-artisan-200 text-stone-800 rounded-full text-xs font-bold transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs text-stone-500">Order Reference</span>
            <h4 className="font-mono text-base font-bold text-stone-900">{order.orderNumber}</h4>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-500">Placed On</span>
            <p className="text-xs font-semibold text-stone-800">{formatDate(order.createdAt || new Date())}</p>
          </div>
        </div>

        {/* Shipping address info */}
        <div className="p-4 bg-artisan-50 rounded-2xl border border-stone-200 flex items-start gap-3 text-xs">
          <MapPin className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-stone-900 mb-0.5">Shipping Destination:</h5>
            <p className="text-stone-600">
              {order.shippingAddress?.fullName}, {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
            </p>
            <p className="text-stone-600">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            <p className="text-stone-500 mt-1 font-mono">Contact: {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-bold text-stone-900">
            Handcrafted Items in This Order:
          </h4>
          <div className="divide-y divide-stone-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200'}
                    alt={item.productName}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">{item.productName}</h5>
                    <p className="text-[11px] text-stone-500 font-mono">
                      Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-stone-900">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financials Breakdown */}
        <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span className="font-mono">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Sales Tax (5%)</span>
            <span className="font-mono">{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-100">
            <span>Total Paid</span>
            <span className="font-mono text-base">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
