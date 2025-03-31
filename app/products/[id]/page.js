"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Star, ShoppingCart, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductById } from '@/actions/product.action';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productData = await getProductById(id);
        
        if (productData.error) {
          setError(productData.error);
          toast.error(productData.error);
          return;
        }
        
        setProduct(productData);
      } catch (error) {
        console.error('Failed to load product:', error);
        setError('Failed to load product. Please try again later.');
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} ${product.productName} to cart`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="ml-2">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <p className="text-red-500">{error || 'Product not found'}</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden relative">
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-full object-contain max-h-96"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400';
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
                className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md transition-colors ${
                  isInWishlist(product._id) 
                    ? 'hover:bg-red-50 text-red-500' 
                    : 'hover:bg-primary-50 text-primary-600'
                }`}
                aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart 
                  size={24} 
                  fill={isInWishlist(product._id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            
            {/* Product Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.productName}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">(50+ reviews)</span>
              </div>
              
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

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
                <p className="text-sm text-gray-500 mb-2">Stock: {product.stock}</p>
                <p className="text-sm text-gray-500">Rating: {product.rating.toFixed(1)} / 5</p>
              </div>

              {/* Specifications Section */}
              {product.specifications && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-gray-600 text-sm whitespace-pre-line">
                      {product.specifications}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-primary-600"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-primary-600"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 