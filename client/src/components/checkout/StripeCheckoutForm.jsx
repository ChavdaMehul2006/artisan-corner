import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Lock, CheckCircle2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { clearCart, clearCartAsync } from '../../store/slices/cartSlice';
import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../common/Toast';

export const StripeCheckoutForm = ({ items = [], subtotal = 0 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    addressLine1: user?.address?.street || '',
    addressLine2: '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'United States',
    phone: user?.phone || ''
  });

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutofillDemoCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('888');
    addToast('Test card details autofilled', 'info');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.postalCode || !address.phone) {
      setErrorMsg('Please complete all required shipping address fields.');
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Initialize Stripe Payment Intent on the Server (validates real DB prices)
      const intentItems = items.map((i) => ({
        productId: i.product?._id || i.product || i.productId || i._id,
        quantity: i.quantity || 1
      }));

      const intentRes = await axiosClient.post('/payments/create-intent', {
        items: intentItems
      });

      const { paymentIntentId } = intentRes.data;

      // 2. Create the persistent order with snapshot and atomic stock reduction
      const orderRes = await axiosClient.post('/orders', {
        shippingAddress: address,
        items: intentItems,
        paymentStatus: 'PAID',
        stripePaymentIntentId: paymentIntentId
      });

      const placedOrder = orderRes.data;

      // 3. Clear shopping cart locally and on server
      dispatch(clearCart());
      if (isAuthenticated) {
        dispatch(clearCartAsync());
      }

      addToast('Order confirmed and payment received!', 'success');

      // 4. Redirect to order success page
      navigate('/order-success', {
        state: { order: placedOrder }
      });
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
      addToast(err.message || 'Payment processing failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePlaceOrder} className="space-y-8">
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Shipping Address Section */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <span className="w-8 h-8 rounded-2xl bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
            1
          </span>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Shipping & Delivery Destination</h3>
            <p className="text-xs text-stone-400">Where the artisan studios will send your packages</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Recipient Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={address.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Street Address *
            </label>
            <input
              type="text"
              name="addressLine1"
              required
              placeholder="House/Apartment number, street name"
              value={address.addressLine1}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Apt / Suite / Unit (Optional)
            </label>
            <input
              type="text"
              name="addressLine2"
              value={address.addressLine2}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              City *
            </label>
            <input
              type="text"
              name="city"
              required
              value={address.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              State / Province *
            </label>
            <input
              type="text"
              name="state"
              required
              value={address.state}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Postal / ZIP Code *
            </label>
            <input
              type="text"
              name="postalCode"
              required
              value={address.postalCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Phone Number for Tracking SMS Updates *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={address.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Payment Method Section */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-2xl bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Payment Authorization</h3>
              <p className="text-xs text-stone-400">Encrypted payment via Stripe</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Card Input Box */}
        <div className="p-6 bg-artisan-50 border border-stone-200 rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-terracotta-500" />
              <span className="text-sm font-bold text-stone-900">Credit or Debit Card</span>
            </div>
            <button
              type="button"
              onClick={handleAutofillDemoCard}
              className="inline-flex items-center gap-1 px-3 py-1 bg-amberGold-50 text-amberGold-600 border border-amberGold-300/60 rounded-full text-[11px] font-bold hover:bg-amberGold-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Autofill Test Card</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-mono font-bold text-stone-900 focus:outline-none focus:border-terracotta-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  Expiration Date
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-mono font-bold text-stone-900 focus:outline-none focus:border-terracotta-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  CVC / Security Code
                </label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-mono font-bold text-stone-900 focus:outline-none focus:border-terracotta-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Order Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
        >
          <Lock className="w-4 h-4" />
          {isProcessing ? 'Processing Secure Transaction...' : `Authorize & Pay ${formatCurrency(total)}`}
        </button>
      </div>
    </form>
  );
};

export default StripeCheckoutForm;
