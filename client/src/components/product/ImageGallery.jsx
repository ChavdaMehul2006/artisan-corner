import React, { useState } from 'react';

export const ImageGallery = ({ images = [], productName = 'Product' }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800';
  const imageList = images && images.length > 0 ? images : [{ url: defaultImage }];
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="aspect-square w-full rounded-3xl overflow-hidden bg-artisan-100 border border-stone-200/80 shadow-artisan relative group">
        <img
          src={imageList[selectedIdx]?.url || defaultImage}
          alt={`${productName} view ${selectedIdx + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
        />
      </div>

      {/* Thumbnail Bar */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                selectedIdx === idx
                  ? 'border-terracotta-600 shadow-md ring-2 ring-terracotta-600/20 scale-105'
                  : 'border-stone-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
