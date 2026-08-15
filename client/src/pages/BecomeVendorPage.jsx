import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Store, Upload, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { checkAuth } from '../store/slices/authSlice';
import { useToast } from '../components/common/Toast';

export const BecomeVendorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { user, isVendor, store, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please sign in or register before applying.', 'info');
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (logoFile) {
        data.append('logo', logoFile);
      }

      await axiosClient.post('/stores/apply', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      addToast('Artisan store application submitted! Pending administrator review.', 'success');
      await dispatch(checkAuth());
    } catch (err) {
      addToast(err.message || 'Application submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (isVendor && store?.isApproved) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900">
          You are an Approved Artisan!
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Your studio <strong className="text-stone-900">{store?.name}</strong> is live on the marketplace.
        </p>
        <Link
          to="/dashboard/seller"
          className="inline-flex items-center gap-2 px-8 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-bold transition-all shadow-md"
        >
          <span>Open Artisan Studio</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (store && store.status === 'PENDING') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900">
          Application Under Review
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          We have received your application for <strong className="text-stone-900">{store.name}</strong>. Our curation team typically reviews and approves applications within 24 hours.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-bold"
        >
          Explore Artisan Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-artisan-100 text-terracotta-700 text-xs font-bold">
          <Store className="w-3.5 h-3.5" />
          <span>Makers & Studio Onboarding</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
          Open Your Artisan Studio
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Reach thousands of collectors who value real craftsmanship. Enjoy low 5% marketplace commission, direct payouts, and full control over your handcrafted inventory.
        </p>
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-artisan">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Store Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Studio / Store Name *
              </label>
              <input
                type="text"
                required
                name="name"
                placeholder="e.g., Willow Creek Pottery Studio"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Artisan Story & Craft Bio *
              </label>
              <textarea
                rows={4}
                required
                name="description"
                placeholder="Tell us about your background, techniques, materials used, and your creative inspiration (min 20 characters)..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-4 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
            </div>

            {/* Logo Upload */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Studio Logo or Maker Photo (Optional)
              </label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-artisan-100 border border-dashed border-stone-300 flex items-center justify-center text-stone-400">
                    <Upload className="w-6 h-6" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>

            {/* Street */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Workshop Street Address
              </label>
              <input
                type="text"
                name="street"
                placeholder="123 Craft Lane"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                City / Town
              </label>
              <input
                type="text"
                name="city"
                placeholder="Burlington"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                State / Province
              </label>
              <input
                type="text"
                name="state"
                placeholder="Vermont"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting Application...' : 'Submit Studio Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeVendorPage;
