import React, { useState, useEffect } from 'react';
import { Settings, Percent, Save, ShieldAlert, Mail } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../components/common/Toast';

export const AdminSettingsPage = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    platformCommissionPercent: 5,
    marketplaceName: "Artisan's Corner",
    supportEmail: 'support@artisanscorner.com'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/admin/settings');
        if (res.data) {
          setFormData({
            platformCommissionPercent: res.data.platformCommissionPercent || 5,
            marketplaceName: res.data.marketplaceName || "Artisan's Corner",
            supportEmail: res.data.supportEmail || 'support@artisanscorner.com'
          });
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axiosClient.patch('/admin/settings', {
        platformCommissionPercent: Number(formData.platformCommissionPercent),
        marketplaceName: formData.marketplaceName,
        supportEmail: formData.supportEmail
      });
      addToast('Marketplace configuration updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="pb-6 border-b border-stone-800">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Marketplace Platform Settings
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Configure financial commission percentages and system parameters
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-stone-950/80 rounded-3xl border border-stone-800 p-6 sm:p-8 space-y-6">
        {/* Commission setting */}
        <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold text-white text-sm">Platform Marketplace Commission Rate</h4>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            The percentage deducted from each order item as a marketplace maintenance fee. The remaining percentage (e.g. 95%) is credited to the artisan vendor.
          </p>
          <div className="flex items-center gap-3 max-w-xs pt-2">
            <input
              type="number"
              required
              min="0"
              max="50"
              step="0.5"
              name="platformCommissionPercent"
              value={formData.platformCommissionPercent}
              onChange={handleInputChange}
              className="w-24 px-3.5 py-2 bg-stone-800 border border-stone-700 rounded-xl text-white font-mono font-bold text-base focus:outline-none focus:border-indigo-500"
            />
            <span className="text-sm font-bold text-stone-300">% Commission</span>
          </div>
        </div>

        {/* General Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Marketplace Brand Title
            </label>
            <input
              type="text"
              required
              name="marketplaceName"
              value={formData.marketplaceName}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Support & Inquiries Email
            </label>
            <input
              type="email"
              required
              name="supportEmail"
              value={formData.supportEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
