'use client';

import React, { useState, useEffect } from 'react';
import ProductsTable from '@/components/admin/ProductsTable';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { productService } from '@/services/productService';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Failed loading products catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      toast.success('Product deleted successfully from catalog.');
    } catch (err) {
      toast.error(err.message || 'Could not delete product.');
    }
  };

  if (loading) return <Loader message="Loading store products catalog..." />;
  if (error) return <ErrorState title="Catalog Error" message={error} onRetry={loadProducts} />;

  return (
    <div className="space-y-6 text-left">
      <div className="pb-6 border-b border-[#E7E5E4]">
        <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
          Catalog Ingestion & Audit
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
          Archival Catalog Master
        </h2>
        <p className="text-xs text-[#78716C] mt-1 font-mono">
          Manage product valuations, inventory allocations, and curation listings
        </p>
      </div>

      <ProductsTable
        products={products}
        onDeleteProduct={handleDelete}
        isLoading={loading}
      />
    </div>
  );
}
