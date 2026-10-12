import React, { useState } from 'react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';

export default function ProductForm({
  initialData = {},
  categories = [],
  onSubmit,
  isLoading = false,
  submitLabel = 'Save Product',
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    category: initialData.category || 'beauty',
    price: initialData.price || '',
    discountPercentage: initialData.discountPercentage || 0,
    stock: initialData.stock || 25,
    brand: initialData.brand || '',
    description: initialData.description || '',
    thumbnail: initialData.thumbnail || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Product title is required.';
    if (!formData.category) errs.category = 'Category is required.';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Price must be greater than 0.';
    if (formData.stock === '' || Number(formData.stock) < 0) errs.stock = 'Stock quantity cannot be negative.';
    if (!formData.description.trim()) errs.description = 'Description is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage),
        stock: Number(formData.stock),
      });
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    label: c.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        label="Product Title"
        placeholder="e.g. Wireless Noise-Cancelling Headphones"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Department / Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          error={errors.category}
          required
        />
        <Input
          label="Maker / Brand"
          placeholder="e.g. Sony, Bang & Olufsen"
          value={formData.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          error={errors.brand}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Acquisition Price ($)"
          type="number"
          step="0.01"
          placeholder="49.99"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          error={errors.price}
          required
        />
        <Input
          label="Discount Privilege (%)"
          type="number"
          min="0"
          max="90"
          placeholder="15"
          value={formData.discountPercentage}
          onChange={(e) => handleChange('discountPercentage', e.target.value)}
        />
        <Input
          label="Allocated Inventory"
          type="number"
          min="0"
          placeholder="50"
          value={formData.stock}
          onChange={(e) => handleChange('stock', e.target.value)}
          error={errors.stock}
          required
        />
      </div>

      <Input
        label="Image Asset URL"
        type="url"
        placeholder="https://..."
        value={formData.thumbnail}
        onChange={(e) => handleChange('thumbnail', e.target.value)}
        helperText="Leave blank to allocate default archival product photography"
      />

      <div className="text-left">
        <label className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-[0.08em] mb-1.5">
          Provenance & Specifications <span className="text-[#991B1B]">*</span>
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Detailed material breakdown, dimensions, and craftsmanship notes..."
          className={`block w-full rounded-sm border text-sm p-3 bg-white text-[#1C1917] transition-colors ${
            errors.description
              ? 'border-[#DC2626] focus:border-[#991B1B]'
              : 'border-[#D6D3D1] focus:border-[#1C1917] focus:outline-none'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors.description}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
