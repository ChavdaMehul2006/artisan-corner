import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Check, Truck, Package, Clock, Phone } from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../components/common/Toast';

export const VendorOrdersPage = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/vendor/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load vendor orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.patch(`/orders/${orderId}/status`, { status: newStatus });
      addToast(`Order fulfillment status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Studio Customer Orders
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage fulfillment for orders containing your handcrafted goods ({orders.length} orders total)
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-400 space-y-2">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
          <h4 className="font-serif text-lg font-bold text-stone-700">No Studio Orders Yet</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            When collectors purchase items from your studio, their orders and shipping details will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-stone-900">
                      {order.orderNumber}
                    </span>
                    <StatusBadge status={order.orderStatus} type="order" />
                  </div>
                  <p className="text-xs text-stone-400">
                    Ordered on {formatDate(order.createdAt)} • Buyer: {order.buyer?.name || 'Artisan Collector'}
                  </p>
                </div>

                {/* Status Updater Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-500">Update Fulfillment:</span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="px-3 py-1.5 bg-artisan-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-terracotta-500"
                  >
                    <option value="PROCESSING">Processing</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
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

                    <div className="text-right">
                      <p className="font-mono text-xs font-bold text-stone-900">
                        Gross: {formatCurrency(item.subtotal)}
                      </p>
                      <p className="font-mono text-[11px] text-emerald-700 font-semibold">
                        Payout: {formatCurrency(item.vendorPayout)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Financials */}
              <div className="pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-artisan-50 p-3.5 rounded-2xl border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
                    Ship To:
                  </span>
                  <p className="text-stone-700 font-medium">{order.shippingAddress?.fullName}</p>
                  <p className="text-stone-600">{order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}</p>
                  <p className="text-stone-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                  <p className="text-stone-500 font-mono">Phone: {order.shippingAddress?.phone}</p>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 space-y-1.5">
                  <div className="flex justify-between text-stone-700">
                    <span>Your Studio Sales:</span>
                    <span className="font-mono font-semibold">{formatCurrency(order.vendorSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>5% Marketplace Fee:</span>
                    <span className="font-mono">-{formatCurrency(order.vendorFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-emerald-200 text-sm">
                    <span>Net Vendor Payout:</span>
                    <span className="font-mono">{formatCurrency(order.vendorPayout)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrdersPage;
