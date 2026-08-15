import React, { useState, useEffect } from 'react';
import { Store, Check, X, Clock, MapPin, Phone } from 'lucide-react';
import VendorApplicationCard from '../../components/admin/VendorApplicationCard';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../components/common/Toast';

export const AdminVendorsPage = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING or ALL

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/admin/vendors/applications?status=${activeTab === 'ALL' ? '' : activeTab}`);
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const handleReview = async (storeId, status) => {
    try {
      await axiosClient.patch(`/admin/vendors/applications/${storeId}`, { status });
      addToast(`Store application ${status.toLowerCase()} successfully!`, 'success');
      fetchApplications();
    } catch (err) {
      addToast(err.message || 'Failed to review application', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Vendor Applications & Studio Approvals
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Vet and approve independent artisan makers before they can publish goods
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-stone-800 p-1 rounded-xl border border-stone-700">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'PENDING' ? 'bg-indigo-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'ALL' ? 'bg-indigo-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            All Applications
          </button>
        </div>
      </div>

      {/* Applications Grid */}
      {applications.length === 0 ? (
        <div className="bg-stone-950/80 rounded-3xl border border-stone-800 p-12 text-center text-stone-500 space-y-2">
          <Clock className="w-12 h-12 text-stone-600 mx-auto" />
          <h4 className="font-serif text-base font-bold text-stone-300">No applications in this queue</h4>
          <p className="text-xs text-stone-500">
            {activeTab === 'PENDING' ? 'All pending artisan applications have been reviewed.' : 'No store applications submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <VendorApplicationCard
              key={app._id}
              application={app}
              onReview={handleReview}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVendorsPage;
