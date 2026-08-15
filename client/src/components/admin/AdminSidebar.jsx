import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Store,
  ShoppingBag,
  Settings,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

export const AdminSidebar = () => {
  const navItems = [
    { to: '/dashboard/admin', label: 'Admin Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/admin/users', label: 'Users & Roles', icon: Users },
    { to: '/dashboard/admin/vendors', label: 'Vendor Approvals', icon: Store },
    { to: '/dashboard/admin/orders', label: 'Marketplace Orders', icon: ShoppingBag },
    { to: '/dashboard/admin/settings', label: 'Platform Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 shrink-0 bg-stone-900 text-stone-300 border-r border-stone-800 min-h-[calc(100vh-5rem)] flex flex-col p-4">
      <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Admin Control</h4>
            <span className="text-[10px] text-stone-400">Marketplace Authority</span>
          </div>
        </div>
      </div>

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
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-stone-800 mt-auto">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-white transition-colors px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Admin Portal</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
