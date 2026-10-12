import React, { useState } from 'react';

export default function ProductGallery({ images = [], title = 'Product image' }) {
  const imageList =
    images.length > 0 ? images : ['/src/assets/images/category_craft_objects_1791282688777.jpg'];
  const [selectedImage, setSelectedImage] = useState(imageList[0]);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3.5">
      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[480px] pb-1 sm:pb-0 shrink-0">
          {imageList.map((imgUrl, index) => {
            const isSelected = selectedImage === imgUrl;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(imgUrl)}
                aria-label={`View image ${index + 1} for ${title}`}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xs bg-[#F5F5F4] border overflow-hidden shrink-0 cursor-pointer transition-all p-1.5 ${
                  isSelected
                    ? 'border-[#1C1917] ring-1 ring-[#1C1917]'
                    : 'border-[#E7E5E4] hover:border-[#A8A29E]'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${title} thumbnail ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Display Image */}
      <div className="flex-1 w-full max-h-[480px] h-[340px] sm:h-[420px] md:h-[460px] lg:h-[480px] rounded-xs bg-[#F5F5F4] border border-[#E7E5E4] p-4 sm:p-6 flex items-center justify-center overflow-hidden">
        <img
          src={selectedImage}
          alt={title}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full h-auto w-auto object-contain mix-blend-multiply transition-transform duration-500 ease-out hover:scale-105"
        />
      </div>
    </div>
  );
}
