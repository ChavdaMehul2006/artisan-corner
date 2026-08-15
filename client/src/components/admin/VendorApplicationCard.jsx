import React, { useState } from 'react';
import { Check, X, MapPin, Phone, User, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const VendorApplicationCard = ({ application, onReview }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    try {
      setLoading(true);
      await onReview(application._id, status);
    } finally {
      setLoading(false);
    }
  };

  const isPending = application.status === 'PENDING';

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={application.logo?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'}
            alt={application.name}
            className="w-12 h-12 rounded-xl object-cover border border-stone-200"
          />
          <div>
            <h4 className="font-serif text-base font-bold text-stone-900">{application.name}</h4>
            <span className="text-xs text-stone-500 font-mono">slug: /{application.slug}</span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 text-xs font-bold rounded-full ${
            application.status === 'APPROVED'
              ? 'bg-emerald-100 text-emerald-800'
              : application.status === 'REJECTED'
              ? 'bg-rose-100 text-rose-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {application.status}
        </span>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed bg-artisan-50 p-3 rounded-xl border border-stone-100">
        "{application.description}"
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs text-stone-500 pt-2 border-t border-stone-100">
        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="truncate">{application.owner?.name || 'Artisan Owner'}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>{application.phone}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate col-span-2">
          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>
            {[application.address?.city, application.address?.state, application.address?.country]
              .filter(Boolean)
              .join(', ') || 'Address on file'}
          </span>
        </div>
      </div>

      {isPending && (
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          <button
            disabled={loading}
            onClick={() => handleAction('REJECTED')}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
          <button
            disabled={loading}
            onClick={() => handleAction('APPROVED')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve Artisan Store</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorApplicationCard;
