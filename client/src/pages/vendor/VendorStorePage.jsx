import React, { useState, useEffect } from 'react';
import { Store, Upload, Save, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../components/common/Toast';

export const VendorStorePage = () => {
  const { addToast } = useToast();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/stores/vendor/me');
        const s = res.data;
        setStore(s);
        setFormData({
          name: s.name || '',
          description: s.description || '',
          phone: s.phone || '',
          street: s.address?.street || '',
          city: s.address?.city || '',
          state: s.address?.state || '',
          postalCode: s.address?.postalCode || '',
          country: s.address?.country || 'United States'
        });
      } catch (err) {
        console.error('Failed to load store profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

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

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (logoFile) data.append('logo', logoFile);
      if (bannerFile) data.append('banner', bannerFile);

      const res = await axiosClient.patch('/stores/vendor/me', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStore(res.data);
      addToast('Studio profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update store', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-terracotta-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Studio Profile & Brand
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Customize your public storefront, logo, studio banner, and biography
          </p>
        </div>

        {store?.slug && (
          <Link
            to={`/stores/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-artisan-100 hover:bg-artisan-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Banner Upload */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Studio Banner Image (Recommended: 1200 × 400)
            </label>
            <div className="relative h-44 bg-stone-100 rounded-2xl overflow-hidden border border-stone-300">
              <img
                src={bannerPreview || store?.banner?.url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200'}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
              <label className="absolute bottom-3 right-3 px-4 py-2 bg-stone-900/80 hover:bg-stone-900 text-white rounded-xl text-xs font-bold backdrop-blur-sm cursor-pointer shadow">
                Change Banner
                <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="sm:col-span-2 flex items-center gap-4">
            <img
              src={logoPreview || store?.logo?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'}
              alt="Logo preview"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-stone-300 shadow-sm"
            />
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Studio Logo or Maker Icon
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Studio Name *
            </label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Artisan Biography & Craft Story *
            </label>
            <textarea
              rows={4}
              required
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-4 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Contact Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Street Address
            </label>
            <input
              type="text"
              name="street"
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
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Studio Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorStorePage;
