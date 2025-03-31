"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2, Loader2 } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct, getProductById } from '@/actions/product.action';
import Link from 'next/link';

// Function to fetch categories
const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Create a client component that uses useSearchParams
const ProductFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const isEditing = !!productId;

  const [formData, setFormData] = useState({
    productName: '',
    productPrice: 0,
    category: '',
    price: 0,
    description: '',
    specifications: '',
    image: '',
    rating: 0,
    reviews: [],
    stock: 0,
  });

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          setFetchingProduct(true);
          const product = await getProductById(productId);
          
          if (product.error) {
            toast.error(product.error);
            router.push('/products');
            return;
          }

          console.log("Fetched product for editing:", product);

          // Ensure all fields are properly formatted
          setFormData({
            productName: product.productName || '',
            productPrice: Number(product.productPrice) || 0,
            category: product.category || '',
            price: Number(product.price) || 0,
            description: product.description || '',
            specifications: product.specifications || '',
            image: product.image || '',
            rating: Number(product.rating) || 0,
            reviews: Array.isArray(product.reviews) ? product.reviews : [],
            stock: Number(product.stock) || 0,
          });
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to fetch product details');
          router.push('/products');
        } finally {
          setFetchingProduct(false);
        }
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    if (name === 'stock') {
      // Stock should be a non-negative integer
      processedValue = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
    } else if (name === 'price' || name === 'productPrice') {
      // Price should be a non-negative number
      processedValue = value === '' ? 0 : Math.max(0, parseFloat(value) || 0);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    console.log(`Field '${name}' updated:`, processedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format data for submission
      const productData = {
        ...formData,
        stock: Math.max(0, parseInt(formData.stock) || 0),
        price: Math.max(0, parseFloat(formData.price) || 0),
        productPrice: Math.max(0, parseFloat(formData.productPrice) || 0),
        // Don't trim specifications to preserve formatting
        specifications: formData.specifications || '',
        rating: Number(formData.rating) || 0,
        reviews: Array.isArray(formData.reviews) ? formData.reviews : []
      };
      
      console.log("Submitting product data:", productData);

      let result;
      if (isEditing) {
        result = await updateProduct(productId, productData);
      } else {
        result = await createProduct(productData);
      }

      if (result.error) {
        toast.error(result.error);
        return;
      }

      console.log("Product saved successfully:", result);
      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
      router.push('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      const result = await deleteProduct(productId);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Product deleted successfully!');
      router.push('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="ml-2">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-10 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-800">
                  Product Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="productName"
                    id="productName"
                    required
                    value={formData.productName}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-lg border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <select
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-lg border-gray-300 rounded-md"
                  >
                    <option value="">Select a category</option>
                    {loadingCategories ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    )}
                    <option value="new">+ Add new category</option>
                  </select>
                  {formData.category === "new" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        name="newCategory"
                        id="newCategory"
                        placeholder="Enter new category name"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-lg border-gray-300 rounded-md"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            category: e.target.value
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (₹)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
                  Original Price (₹) (Optional)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="productPrice"
                    id="productPrice"
                    min="0"
                    step="0.01"
                    value={formData.productPrice}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter original price"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="image"
                    id="image"
                    required
                    value={formData.image}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-lg border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-lg border-gray-300 rounded-md"
                    required
                    placeholder="Enter product description..."
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
                  Specifications
                </label>
                <div className="mt-1">
                  <textarea
                    id="specifications"
                    name="specifications"
                    rows="8"
                    value={formData.specifications}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-lg border-gray-300 rounded-md font-mono"
                    placeholder="Enter product specifications..."
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter specifications in plain text format. Line breaks and formatting will be preserved.
                  </p>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    required
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter stock quantity"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Stock must be a whole number (0 or greater)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  isEditing ? 'Update Product' : 'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense boundary
const ProductForm = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="ml-2">Loading...</p>
      </div>
    }>
      <ProductFormContent />
    </Suspense>
  );
};

export default ProductForm;