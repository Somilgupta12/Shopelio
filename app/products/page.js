"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Plus, Pencil, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

// This function will be used to fetch products
const fetchProducts = async (category = null, searchQuery = null) => {
  try {
    let url = '/api/products';
    const params = new URLSearchParams();
    
    if (category) {
      params.append('category', category);
    }
    
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    
    // Add params to URL if any exist
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// This function will be used to fetch categories
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
    throw error;
  }
};

// Create a client component that uses useSearchParams
const ProductsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [productsByCategory, setProductsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery);

  useEffect(() => {
    // Update selectedCategory when URL parameter changes
    setSelectedCategory(categoryParam);
    setCurrentSearchQuery(searchQuery);
  }, [categoryParam, searchQuery]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories first
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Then fetch products (filtered by category and/or search query if provided)
        const productsData = await fetchProducts(selectedCategory, currentSearchQuery);
        setProducts(productsData);
        
        // Group products by category
        const groupedProducts = productsData.reduce((acc, product) => {
          const category = product.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});
        
        setProductsByCategory(groupedProducts);
        
        // Initialize all categories as expanded
        const initialExpandedState = Object.keys(groupedProducts).reduce((acc, category) => {
          acc[category] = true;
          return acc;
        }, {});
        
        setExpandedCategories(initialExpandedState);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, currentSearchQuery]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCategorySelect = (category) => {
    const newCategory = category === 'All Categories' ? null : category;
    setSelectedCategory(newCategory);
    setShowCategoryFilter(false);
    
    // Update URL with the selected category
    if (newCategory) {
      router.push(`/products?category=${encodeURIComponent(newCategory)}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {currentSearchQuery 
              ? `Search Results for &quot;${currentSearchQuery}&quot;` 
              : "Products"}
          </h1>
          <div className="flex space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                {selectedCategory || 'All Categories'}
              </button>
              
              {showCategoryFilter && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => handleCategorySelect('All Categories')}
                      className={`block px-4 py-2 text-sm w-full text-left ${!selectedCategory ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                      role="menuitem"
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`block px-4 py-2 text-sm w-full text-left ${selectedCategory === category ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                        role="menuitem"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link
              href="/products/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {currentSearchQuery && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Found {products.length} {products.length === 1 ? 'product' : 'products'} matching your search
              </p>
              <button
                onClick={() => {
                  router.push('/products');
                  setCurrentSearchQuery(null);
                }}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <p className="ml-2">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
            <p className="text-gray-500">
              {selectedCategory 
                ? `No products found in the &quot;${selectedCategory}&quot; category.` 
                : 'No products found. Add your first product!'}
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View All Products
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <div key={category} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {category}
                    </h3>
                    <button
                      onClick={() => toggleCategory(category)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      {expandedCategories[category] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {expandedCategories[category] && (
                  <div className="border-t border-gray-200">
                    <ul role="list" className="divide-y divide-gray-200">
                      {categoryProducts.map((product) => (
                        <li key={product._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    src={product.image}
                                    alt={product.productName}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {product.productName}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    ₹{product.price}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Link
                                  href={`/products/${product._id}/edit`}
                                  className="text-primary-600 hover:text-primary-900"
                                >
                                  <Pencil className="h-5 w-5" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main component with Suspense boundary
const ProductsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="ml-2">Loading...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
};

export default ProductsPage; 