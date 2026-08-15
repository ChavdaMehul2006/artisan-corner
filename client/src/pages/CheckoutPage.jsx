import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import StripeCheckoutForm from '../components/checkout/StripeCheckoutForm';
import CartSummaryCard from '../components/cart/CartSummaryCard';

export const CheckoutPage = () => {
  const { items, subtotal } = useSelector((state) => state.cart);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Secure Checkout
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review delivery details and complete your artisan purchase
          </p>
        </div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </Link>
      </div>

      {/* Checkout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Form Column */}
        <div className="lg:col-span-8">
          <StripeCheckoutForm items={items} subtotal={subtotal} />
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <CartSummaryCard subtotal={subtotal} isCheckout={true} />

          {/* Mini Items Breakdown */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
            <h4 className="font-serif text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
              Items in this Order ({items.reduce((a, b) => a + b.quantity, 0)})
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((i, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={i.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=100'}
                    alt={i.product?.name}
                    className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900 truncate">{i.product?.name}</p>
                    <p className="text-stone-500 font-mono">Qty: {i.quantity} × ${i.product?.price || i.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
