"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ChevronLeft, Star, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';
import { getAllProducts } from '@/actions/product.action';

// Function to fetch products by search query
const fetchProductsBySearch = async (query) => {
  try {
    const url = `/api/products?search=${encodeURIComponent(query)}`;
    
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

// Create a client component that uses useSearchParams
const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getAllProducts();
        const filteredProducts = productsData.filter(product => 
          product.productName.toLowerCase().includes(query?.toLowerCase() || '') ||
          product.description.toLowerCase().includes(query?.toLowerCase() || '') ||
          product.category.toLowerCase().includes(query?.toLowerCase() || '')
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {query ? `Search Results for &quot;${query}&quot;` : "Search Results"}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <p className="ml-2">Searching for products...</p>
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
            <p className="text-gray-500">No products found matching &quot;{query}&quot;</p>
            <div className="mt-4 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-4 mb-6">
              <p className="text-gray-600">
                Found {products.length} {products.length === 1 ? 'product' : 'products'} matching your search
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <div key={product._id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="w-full h-60 bg-gray-200 aspect-w-1 aspect-h-1 overflow-hidden group-hover:opacity-75">
                    <Image
                      src={product.image}
                      alt={product.productName}
                      width={300}
                      height={300}
                      className="w-full h-full object-center object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300';
                      }}
                    />
                    <button
                      onClick={() => {
                        if (isInWishlist(product._id)) {
                          removeFromWishlist(product._id);
                          toast.success('Removed from wishlist');
                        } else {
                          addToWishlist(product);
                          toast.success('Added to wishlist');
                        }
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md transition-colors ${
                        isInWishlist(product._id) 
                          ? 'hover:bg-red-50 text-red-500' 
                          : 'hover:bg-primary-50 text-primary-600'
                      }`}
                      aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart 
                        size={20} 
                        fill={isInWishlist(product._id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/products/${product._id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.productName}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        ₹{product.price}
                      </p>
                      {product.productPrice && product.productPrice > product.price && (
                        <p className="ml-2 text-sm text-gray-500 line-through">
                          ₹{product.productPrice}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < (product.rating || 0) ? "currentColor" : "none"} 
                            className="mr-1"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviews?.length || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main component with Suspense boundary
const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="ml-2">Loading...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage; 