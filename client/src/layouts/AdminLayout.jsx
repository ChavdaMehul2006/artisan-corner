import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AdminSidebar from '../components/admin/AdminSidebar';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-950">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AdminSidebar />
        <main className="flex-1 p-6 sm:p-8 min-w-0 overflow-y-auto bg-stone-900 text-stone-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
