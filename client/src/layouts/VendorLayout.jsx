import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import VendorSidebar from '../components/vendor/VendorSidebar';

export const VendorLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-artisan-100/50">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <VendorSidebar />
        <main className="flex-1 p-6 sm:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
