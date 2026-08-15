import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Check, X, Eye, EyeOff, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../components/common/Toast';

export const VendorProductsPage = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/vendor/products?limit=50&search=${encodeURIComponent(search)}`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to load vendor products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorProducts();
  }, [search]);

  const handleToggleActive = async (product) => {
    try {
      await axiosClient.patch(`/products/${product._id}`, {
        isActive: !product.isActive
      });
      addToast(`Product "${product.name}" ${!product.isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchVendorProducts();
    } catch (err) {
      addToast(err.message || 'Failed to update product status', 'error');
    }
  };

  const handleDelete = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    try {
      await axiosClient.delete(`/products/${productId}`);
      addToast(`"${name}" deleted successfully`, 'success');
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Craft Catalog & Inventory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your published creations, stock levels, and pricing ({products.length} items)
          </p>
        </div>

        <Link
          to="/dashboard/seller/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-bold transition-all shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-terracotta-500"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-artisan-50 border-b border-stone-200 text-stone-500 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-normal">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400">
                    No products found in your studio catalog.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200'}
                          alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover border border-stone-200"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link
                            to={`/products/${p.slug}`}
                            className="font-bold text-stone-900 hover:text-terracotta-600 truncate block"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[10px] text-stone-400 font-mono">SKU: {p.sku || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-medium">{p.category}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-stone-900">
                        {formatCurrency(p.price)}
                      </div>
                      {p.compareAtPrice && (
                        <span className="text-[10px] text-stone-400 line-through font-mono">
                          {formatCurrency(p.compareAtPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono font-semibold ${
                          p.stock <= 5 ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded' : 'text-stone-700'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800">★ {p.rating || 0}</span>
                      <span className="text-stone-400 text-[10px] ml-1">({p.numReviews || 0})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                        title="Click to toggle visibility"
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/dashboard/seller/products/${p._id}/edit`}
                          className="p-1.5 text-stone-500 hover:text-terracotta-600 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Craft"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Craft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorProductsPage;
