import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Sparkles, Check, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../components/common/Toast';

export const VendorProductFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Ceramics & Pottery',
    price: '',
    compareAtPrice: '',
    stock: '10',
    sku: '',
    isFeatured: false,
    isActive: true
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchExisting = async () => {
        try {
          setLoadingInitial(true);
          const res = await axiosClient.get(`/products/${id}`);
          const p = res.data;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            category: p.category || 'Ceramics & Pottery',
            price: p.price || '',
            compareAtPrice: p.compareAtPrice || '',
            stock: p.stock !== undefined ? String(p.stock) : '10',
            sku: p.sku || '',
            isFeatured: Boolean(p.isFeatured),
            isActive: p.isActive !== undefined ? Boolean(p.isActive) : true
          });
          setExistingImages(p.images || []);
        } catch (err) {
          addToast(err.message || 'Failed to load product for editing', 'error');
        } finally {
          setLoadingInitial(false);
        }
      };
      fetchExisting();
    }
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImageFiles(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();

      Object.entries(formData).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) {
          data.append(k, v);
        }
      });

      newImageFiles.forEach((file) => {
        data.append('images', file);
      });

      if (isEditing) {
        await axiosClient.patch(`/products/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addToast('Product updated successfully!', 'success');
      } else {
        await axiosClient.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addToast('New artisan craft published!', 'success');
      }

      navigate('/dashboard/seller/products');
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-terracotta-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <Link
            to="/dashboard/seller/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Inventory</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {isEditing ? 'Edit Artisan Craft' : 'Publish New Artisan Craft'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Provide detailed specifications and photographs of your handmade item
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              required
              name="name"
              placeholder="e.g. Hand-Thrown Stoneware Espresso Cup"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Craft Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              SKU Identifier (Optional)
            </label>
            <input
              type="text"
              name="sku"
              placeholder="e.g. CER-ESP-01"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Price ($ USD) *
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0.01"
              name="price"
              placeholder="38.00"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          {/* Compare Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Original / Compare-At Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="compareAtPrice"
              placeholder="45.00"
              value={formData.compareAtPrice}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Inventory Quantity (Stock) *
            </label>
            <input
              type="number"
              required
              min="0"
              name="stock"
              placeholder="10"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Craft Description & Technique Details *
            </label>
            <textarea
              rows={5}
              required
              name="description"
              placeholder="Detail the materials, firing technique, dimensions, finish, care instructions, and what makes this handcrafted item special..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-4 bg-artisan-50 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
            />
          </div>

          {/* Images Upload */}
          <div className="sm:col-span-2 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Product Photographs (Up to 6 Images)
            </label>

            {/* Current Existing Images */}
            {existingImages.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-500 font-semibold">Current:</span>
                {existingImages.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`Existing ${i}`}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-300"
                  />
                ))}
              </div>
            )}

            {/* New previews */}
            {imagePreviews.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-emerald-700 font-semibold">New Uploads:</span>
                {imagePreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Preview ${i}`}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                  />
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-stone-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
            />
          </div>

          {/* Options */}
          <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 text-terracotta-600 rounded border-stone-300 focus:ring-terracotta-500"
              />
              <span className="text-xs font-semibold text-stone-800">Feature this craft on homepage spotlight</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-stone-800">Publish actively in marketplace</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-stone-100 flex justify-end gap-3">
          <Link
            to="/dashboard/seller/products"
            className="px-6 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {submitting ? 'Saving Craft...' : isEditing ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorProductFormPage;
