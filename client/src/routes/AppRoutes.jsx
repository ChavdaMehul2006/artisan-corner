import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import VendorLayout from '../layouts/VendorLayout';
import AdminLayout from '../layouts/AdminLayout';
import { ProtectedRoute, VendorRoute, AdminRoute } from './RouteGuards';

// Public & Buyer Pages
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import StorePage from '../pages/StorePage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import WishlistPage from '../pages/WishlistPage';
import ProfilePage from '../pages/ProfilePage';
import BecomeVendorPage from '../pages/BecomeVendorPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// Vendor Studio Pages
import VendorOverviewPage from '../pages/vendor/VendorOverviewPage';
import VendorProductsPage from '../pages/vendor/VendorProductsPage';
import VendorProductFormPage from '../pages/vendor/VendorProductFormPage';
import VendorOrdersPage from '../pages/vendor/VendorOrdersPage';
import VendorAnalyticsPage from '../pages/vendor/VendorAnalyticsPage';
import VendorStorePage from '../pages/vendor/VendorStorePage';

// Admin Portal Pages
import AdminOverviewPage from '../pages/admin/AdminOverviewPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminVendorsPage from '../pages/admin/AdminVendorsPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public & Buyer Marketplace Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/stores/:slug" element={<StorePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Buyer Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/become-vendor"
          element={
            <ProtectedRoute>
              <BecomeVendorPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 2. Vendor Studio Routes */}
      <Route
        path="/dashboard/seller"
        element={
          <VendorRoute>
            <VendorLayout />
          </VendorRoute>
        }
      >
        <Route index element={<VendorOverviewPage />} />
        <Route path="products" element={<VendorProductsPage />} />
        <Route path="products/new" element={<VendorProductFormPage />} />
        <Route path="products/:id/edit" element={<VendorProductFormPage />} />
        <Route path="orders" element={<VendorOrdersPage />} />
        <Route path="analytics" element={<VendorAnalyticsPage />} />
        <Route path="store" element={<VendorStorePage />} />
      </Route>

      {/* 3. Admin Command Portal Routes */}
      <Route
        path="/dashboard/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="vendors" element={<AdminVendorsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
