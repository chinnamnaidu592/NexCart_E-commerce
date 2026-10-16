'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import { Package, Plus, Search, Edit2, Trash2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_MERCHANT_PRODUCTS = [
  {
    id: 101,
    title: 'Scandinavian Minimalist Lounge Chair',
    category: 'furniture',
    price: 42499,
    stock: 14,
    status: 'active',
    thumbnail: '/src/assets/images/hero_scandinavian_craft_1791282659132.jpg',
  },
  {
    id: 102,
    title: 'Artisanal Ceramic Pour-Over Dripper',
    category: 'kitchen-accessories',
    price: 1999,
    stock: 35,
    status: 'active',
    thumbnail: '/src/assets/images/category_craft_objects_1791282688777.jpg',
  },
  {
    id: 103,
    title: 'Precision Machined Brass Desk Clock',
    category: 'home-decoration',
    price: 8499,
    stock: 6,
    status: 'active',
    thumbnail: '/src/assets/images/category_craft_objects_1791282688777.jpg',
  },
  {
    id: 104,
    title: 'Nordic Oak Floating Desk & Audio Console',
    category: 'furniture',
    price: 34999,
    stock: 8,
    status: 'pending_approval',
    thumbnail: '/src/assets/images/hero_scandinavian_craft_1791282659132.jpg',
  },
  {
    id: 105,
    title: 'Cast Iron Teapot & Trivet Set',
    category: 'kitchen-accessories',
    price: 3899,
    stock: 0,
    status: 'out_of_stock',
    thumbnail: '/src/assets/images/category_craft_objects_1791282688777.jpg',
  },
];

export default function MerchantProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState(INITIAL_MERCHANT_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formCategory, setFormCategory] = useState('furniture');

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormPrice('');
    setFormStock('');
    setFormCategory('furniture');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormPrice(String(product.price));
    setFormStock(String(product.stock));
    setFormCategory(product.category);
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from your store?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Removed "${title}" from store inventory.`);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrice || !formStock) {
      toast.error('Please complete all product fields.');
      return;
    }

    const priceNum = Number(formPrice);
    const stockNum = Number(formStock);

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                title: formTitle.trim(),
                price: priceNum,
                stock: stockNum,
                category: formCategory,
                status: stockNum > 0 ? p.status : 'out_of_stock',
              }
            : p
        )
      );
      toast.success(`Updated "${formTitle}" successfully.`);
    } else {
      const newProduct = {
        id: Date.now(),
        title: formTitle.trim(),
        price: priceNum,
        stock: stockNum,
        category: formCategory,
        status: 'pending_approval',
        thumbnail: '/src/assets/images/category_craft_objects_1791282688777.jpg',
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success('Product submitted! Awaiting administrator approval before going live.');
    }

    setIsModalOpen(false);
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
            Store Catalog
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
            My Store Products ({products.length} SKUs)
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-mono">
            Manage your store&apos;s listings, pricing, and live inventory allocations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1917]  text-white  hover:bg-[#292524] rounded-xs transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search your store products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-white  border border-[#E7E5E4]  rounded-xs pl-8 pr-3 py-2 text-[#1C1917]  placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
          />
          <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-1 bg-[#F5F5F4]  p-1 border border-[#E7E5E4]  rounded-xs text-xs overflow-x-auto">
          {['all', 'active', 'pending_approval', 'out_of_stock'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 uppercase tracking-wider text-[10px] font-semibold rounded-xs transition-colors cursor-pointer capitalize whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#1C1917]  text-white '
                  : 'text-[#78716C]  hover:text-[#1C1917]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white  border border-[#E7E5E4]  rounded-xs overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F5F4]  text-[#78716C]  uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4] ">
                <th className="py-3 px-5">Product Details</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Price (INR)</th>
                <th className="py-3 px-5">Stock Level</th>
                <th className="py-3 px-5">Catalog Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4] ">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#78716C]">
                    No products matched your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAFAF9]  transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-10 h-10 rounded-xs object-cover bg-stone-100 border border-[#E7E5E4] "
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-[#1C1917]  truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] font-mono text-[#A8A29E]">SKU #{item.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 capitalize text-[#57534E] ">
                      {item.category}
                    </td>

                    <td className="py-3.5 px-5 font-semibold text-[#1C1917]  tabular-nums">
                      {formatCurrency(item.price)}
                    </td>

                    <td className="py-3.5 px-5 font-medium tabular-nums">
                      {item.stock > 0 ? (
                        <span className="text-[#1C1917] ">{item.stock} in stock</span>
                      ) : (
                        <span className="text-red-600 font-semibold">0 (Depleted)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-emerald-50 text-emerald-700   border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      ) : item.status === 'pending_approval' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-amber-50 text-amber-700   border border-amber-200">
                          <Clock className="w-3 h-3" /> Awaiting Audit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono bg-red-50 text-red-700   border border-red-200">
                          <AlertTriangle className="w-3 h-3" /> Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-[#78716C] hover:text-[#1C1917]  cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-[#78716C] hover:text-[#991B1B] cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
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

      {/* Modal: Add/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white  border border-[#E7E5E4]  rounded-xs p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold text-[#1C1917]  pb-2 border-b border-[#F5F5F4] ">
              {editingProduct ? 'Edit Store Product' : 'Add New Store Listing'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917]  mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Damascus Steel Pocket Knife"
                  className="w-full text-xs bg-white  border border-[#E7E5E4]  rounded-xs px-3 py-2 text-[#1C1917]  focus:outline-none focus:border-[#1C1917]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917]  mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="4999"
                    className="w-full text-xs bg-white  border border-[#E7E5E4]  rounded-xs px-3 py-2 text-[#1C1917]  focus:outline-none focus:border-[#1C1917]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917]  mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="25"
                    className="w-full text-xs bg-white  border border-[#E7E5E4]  rounded-xs px-3 py-2 text-[#1C1917]  focus:outline-none focus:border-[#1C1917]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917]  mb-1">
                  Department / Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full text-xs bg-white  border border-[#E7E5E4]  rounded-xs px-3 py-2 text-[#1C1917]  focus:outline-none focus:border-[#1C1917]"
                >
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics & Audio</option>
                  <option value="kitchen-accessories">Kitchen & Dining</option>
                  <option value="home-decoration">Home & Living</option>
                  <option value="watches">Timepieces</option>
                  <option value="mens-shirts">Sartorial Apparel</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#F5F5F4] ">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1917]  text-white  hover:bg-[#292524] rounded-xs cursor-pointer shadow-2xs"
                >
                  {editingProduct ? 'Save Changes' : 'Submit For Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
