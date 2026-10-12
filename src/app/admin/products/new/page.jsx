'use client';

import React, { useState, useEffect } from 'react';
import ProductForm from '@/components/forms/ProductForm';
import Link from '@/components/common/Link';
import { productService } from '@/services/productService';
import { useRouter } from '@/router/RouterContext';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    try {
      await productService.addProduct(formData);
      toast.success(`Product "${formData.title}" added to catalog!`);
      router.push('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to create product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
        Return to Catalog Table
      </Link>

      <div className="bg-white rounded-sm border border-[#E7E5E4] p-8 sm:p-10">
        <div className="mb-8 pb-4 border-b border-[#F5F5F4]">
          <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
            Catalog Ingestion
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
            Register New Catalog Item
          </h2>
          <p className="text-xs text-[#78716C] mt-1 font-mono">
            Fill in provenance, physical specifications, and pricing metrics below
          </p>
        </div>

        <ProductForm
          categories={categories}
          onSubmit={handleCreate}
          isLoading={isSubmitting}
          submitLabel="Authenticate & Publish Item"
        />
      </div>
    </div>
  );
}
