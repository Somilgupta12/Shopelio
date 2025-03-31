import React, { useState } from 'react';

const ProductForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    specifications: initialData?.specifications || '',
    price: initialData?.price || '',
    category: initialData?.category || 'Electronics',
    image: initialData?.image || '',
    stock: initialData?.stock || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... existing name field ... */}

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      {/* Specifications Field */}
      <div>
        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
          Specifications
        </label>
        <textarea
          id="specifications"
          name="specifications"
          value={formData.specifications}
          onChange={handleChange}
          rows={6}
          placeholder="Enter product specifications (e.g., Brand: XYZ, Model: ABC, Color: Black, etc.)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* ... rest of the existing form fields ... */}
    </form>
  );
};

export default ProductForm; 