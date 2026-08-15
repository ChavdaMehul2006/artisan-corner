import React from 'react';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../constants';

export const StatusBadge = ({ status, type = 'order' }) => {
  let badgeConfig = { label: status, color: 'bg-stone-100 text-stone-700 border-stone-200' };

  if (type === 'order' && ORDER_STATUSES[status]) {
    badgeConfig = ORDER_STATUSES[status];
  } else if (type === 'payment' && PAYMENT_STATUSES[status]) {
    badgeConfig = PAYMENT_STATUSES[status];
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeConfig.color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {badgeConfig.label}
    </span>
  );
};

export const VerifiedBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
    <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
    Verified Purchase
  </span>
);
