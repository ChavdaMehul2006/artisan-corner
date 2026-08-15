import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CartSummaryCard = ({ subtotal = 0, isCheckout = false }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, Math.round((freeShippingThreshold - subtotal) * 100) / 100);

  const tax = Math.round((subtotal - discount) * 0.05 * 100) / 100;
  const shipping = 0; // Free artisanal shipping
  const total = Math.max(0, Math.round((subtotal - discount + tax + shipping) * 100) / 100);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'ARTISAN10') {
      const discountAmount = Math.round(subtotal * 0.10 * 100) / 100;
      setDiscount(discountAmount);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'HANDMADE15') {
      const discountAmount = Math.round(subtotal * 0.15 * 100) / 100;
      setDiscount(discountAmount);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid coupon code. Try ARTISAN10 or HANDMADE15');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-artisan space-y-6">
      <h3 className="font-serif text-lg font-bold text-stone-900 pb-4 border-b border-stone-100 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs text-stone-400 font-sans font-medium">Multi-Vendor Basket</span>
      </h3>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-artisan-50 rounded-2xl border border-stone-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-terracotta-500" />
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-bold">You unlocked FREE Standard Shipping!</span>
            ) : (
              <span>Add {formatCurrency(remainingForFreeShipping)} more for FREE Shipping</span>
            )}
          </span>
          <span className="font-mono text-[11px] font-bold text-stone-900">{progressToFreeShipping}%</span>
        </div>
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${progressToFreeShipping}%` }}
          ></div>
        </div>
      </div>

      {/* Subtotal, Discount & Tax Breakdown */}
      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Items Subtotal</span>
          <span className="font-mono font-bold text-stone-900">{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Promo Discount
            </span>
            <span className="font-mono">-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-stone-600">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            Artisan Packaging & Delivery
          </span>
          <span className="text-emerald-800 font-bold text-xs bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            FREE
          </span>
        </div>

        <div className="flex justify-between text-stone-600">
          <span>Estimated Sales Tax (5%)</span>
          <span className="font-mono font-medium text-stone-900">{formatCurrency(tax)}</span>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline">
          <span className="text-base font-bold text-stone-900">Total Charged</span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-stone-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Coupon Code Accordion / Input */}
      {!isCheckout && (
        <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Promo Code (e.g. ARTISAN10)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-artisan-50 border border-stone-300 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          {promoApplied && (
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Coupon code applied successfully!
            </p>
          )}
          {promoError && (
            <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>
          )}
        </form>
      )}

      {/* Checkout Action Button */}
      {!isCheckout && (
        <Link
          to="/checkout"
          className="w-full flex items-center justify-center gap-2 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
        >
          <span>Proceed to Secure Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {/* Trust & Guarantee */}
      <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Stripe Encrypted Checkout with 100% Buyer Protection Guarantee</span>
      </div>
    </div>
  );
};

export default CartSummaryCard;
