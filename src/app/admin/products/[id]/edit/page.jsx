'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/forms/ProductForm';
import Link from '@/components/common/Link';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { productService } from '@/services/productService';
import { useRouter } from '@/router/RouterContext';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [prod, cats] = await Promise.all([
          productService.getProductById(productId),
          productService.getCategories(),
        ]);
        setProduct(prod);
        setCategories(cats);
      } catch (err) {
        setError(err.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    }

    if (productId) loadData();
  }, [productId]);

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      await productService.updateProduct(productId, formData);
      toast.success(`Updated "${formData.title}" successfully!`);
      router.push('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading product data..." />;
  if (error || !product) {
    return (
      <ErrorState
        title="Could not load product for editing"
        message={error}
        onRetry={() => router.push('/admin/products')}
      />
    );
  }

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
            Archival Revision
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
            Revise Specification #{productId}
          </h2>
          <p className="text-xs text-[#78716C] mt-1 font-mono">
            Adjust valuation, allocated units, and description notes
          </p>
        </div>

        <ProductForm
          initialData={product}
          categories={categories}
          onSubmit={handleUpdate}
          isLoading={isSubmitting}
          submitLabel="Commit Specification Changes"
        />
      </div>
    </div>
  );
}
