"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const router = useRouter();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotals,
    isLoaded
  } = useCart();

  // Safely get cart totals
  const getTotals = () => {
    try {
      return getCartTotals();
    } catch (error) {
      console.error('Error calculating cart totals:', error);
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    }
  };

  const { subtotal, shipping, tax, total } = getTotals();

  // Handle cart initialization issues
  useEffect(() => {
    if (isLoaded && !Array.isArray(cart)) {
      console.error('Cart is not an array:', cart);
      toast.error('There was an issue loading your cart. Please try refreshing the page.');
    }
  }, [cart, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Safety check to ensure cart is an array
  const safeCart = Array.isArray(cart) ? cart : [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
        </div>

        {safeCart.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <ShoppingCart size={64} className="text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {safeCart.map((item) => (
                    <li key={item._id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-200 rounded-md overflow-hidden mb-4 sm:mb-0">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-center object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                        <div className="ml-0 sm:ml-6 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.productName}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                            </div>
                            <p className="text-lg font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                type="button"
                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100"
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-1">{item.quantity}</span>
                              <button
                                type="button"
                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100"
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item._id)}
                              className="text-red-500 hover:text-red-700 flex items-center"
                            >
                              <Trash2 size={18} className="mr-1" />
                              <span className="text-sm">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                <div className="flow-root">
                  <dl className="-my-4 text-sm divide-y divide-gray-200">
                    <div className="py-4 flex justify-between">
                      <dt className="text-gray-600">Subtotal</dt>
                      <dd className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="py-4 flex justify-between">
                      <dt className="text-gray-600">Shipping</dt>
                      <dd className="font-medium text-gray-900">₹{shipping.toFixed(2)}</dd>
                    </div>
                    <div className="py-4 flex justify-between">
                      <dt className="text-gray-600">Tax</dt>
                      <dd className="font-medium text-gray-900">₹{tax.toFixed(2)}</dd>
                    </div>
                    <div className="py-4 flex justify-between">
                      <dt className="text-base font-medium text-gray-900">Order total</dt>
                      <dd className="text-base font-medium text-primary-600">₹{total.toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => router.push('/checkout')}
                  >
                    Checkout
                  </button>
                </div>
                <div className="mt-4">
                  <Link
                    href="/"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 flex justify-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;