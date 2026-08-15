import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
  Store,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { useSelector } from 'react-redux';

export const VendorSidebar = () => {
  const { store } = useSelector((state) => state.auth);

  const navItems = [
    { to: '/dashboard/seller', label: 'Studio Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/seller/products', label: 'Craft Catalog', icon: Package },
    { to: '/dashboard/seller/products/new', label: 'Add New Product', icon: PlusCircle },
    { to: '/dashboard/seller/orders', label: 'Customer Orders', icon: ShoppingBag },
    { to: '/dashboard/seller/analytics', label: 'Sales & Earnings', icon: TrendingUp },
    { to: '/dashboard/seller/store', label: 'Store Profile', icon: Store }
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-stone-200/80 min-h-[calc(100vh-5rem)] flex flex-col p-4">
      {/* Store Badge */}
      <div className="p-3 bg-artisan-100/70 rounded-2xl border border-stone-200 mb-6">
        <div className="flex items-center gap-3">
          <img
            src={store?.logo?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'}
            alt="Store Logo"
            className="w-10 h-10 rounded-xl object-cover border border-stone-300"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-stone-900 truncate">
              {store?.name || 'Artisan Studio'}
            </h4>
            <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
              Approved Artisan
            </span>
          </div>
        </div>

        {store?.slug && (
          <Link
            to={`/stores/${store.slug}`}
            target="_blank"
            className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-terracotta-700 hover:text-terracotta-800 bg-white py-1.5 rounded-lg border border-stone-200 transition-colors shadow-2xs"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Nav list */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-artisan-100 hover:text-stone-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Back to marketplace */}
      <div className="pt-4 border-t border-stone-200 mt-auto">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    </aside>
  );
};

export default VendorSidebar;
