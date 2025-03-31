"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Clock, ChevronRight, Truck, CheckCircle, XCircle, AlertCircle, Download, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUserOrders, cancelOrder } from '../actions/order.action';
import { getUserIdByEmail } from '@/actions/user.action';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Extract user ID from localStorage or user object
        let userId = localStorage.getItem('userId');
        
        // If userId is not available, try to recover it from email
        if (!userId && user?.email) {
          try {
            const result = await getUserIdByEmail(user.email);
            if (result.userId) {
              userId = result.userId;
              // Store it for future use
              localStorage.setItem('userId', userId);
            } else if (result.error) {
              throw new Error(result.error);
            }
          } catch (error) {
            console.error('Error recovering user ID:', error);
            throw new Error('Failed to recover user ID. Please login again.');
          }
        }
        
        if (!userId) {
          throw new Error('User ID not found. Please login again.');
        }
        
        const result = await getUserOrders(userId);
        
        if (!result || result.error) {
          throw new Error(result?.error || 'Failed to fetch orders');
        }
        
        setOrders(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'Failed to load orders');
        toast.error(error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router, user]);

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      
      // Get user ID from localStorage or recover it if needed
      let userId = localStorage.getItem('userId');
      
      if (!userId && user?.email) {
        const result = await getUserIdByEmail(user.email);
        if (result.userId) {
          userId = result.userId;
          localStorage.setItem('userId', userId);
        } else if (result.error) {
          throw new Error(result.error);
        }
      }
      
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }
      
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      
      // Refresh orders list
      const updatedOrders = await getUserOrders(userId);
      setOrders(Array.isArray(updatedOrders) ? updatedOrders : []);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.orderStatus.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/')}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle size={64} className="text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Orders</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    window.location.reload();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <Package size={64} className="text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? 'No orders match your search criteria.'
                  : 'You haven\'t placed any orders yet.'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <li key={order._id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 mr-3">{order.orderId}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)} {order.orderStatus}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>Ordered on {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <p className="text-lg font-medium text-gray-900">₹{order.total.toFixed(2)}</p>
                      <p className="mt-1 text-sm text-gray-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-medium text-gray-900">Order Items</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-primary-600 hover:text-primary-500 flex items-center"
                          onClick={() => {
                            // Implement invoice download
                            toast.success('Invoice download started');
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Invoice
                        </button>
                        {order.trackingNumber && (
                          <button
                            type="button"
                            className="text-primary-600 hover:text-primary-500 flex items-center"
                            onClick={() => {
                              // Implement tracking
                              toast.success('Tracking information opened');
                            }}
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Track
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {order.items.map((item) => (
                        <div key={item.productId} className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex items-center space-x-3 hover:border-gray-300">
                          <div className="flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-10 w-10 rounded-md object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              ₹{item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.orderStatus === 'shipped' && order.estimatedDelivery && (
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Estimated delivery: {formatDate(order.estimatedDelivery)}</p>
                      {order.trackingNumber && (
                        <p>Tracking number: {order.trackingNumber}</p>
                      )}
                    </div>
                  )}

                  {order.orderStatus === 'processing' && (
                    <div className="mt-4 text-sm text-gray-500">
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrder === order._id}
                        className="text-red-500 hover:text-red-700"
                      >
                        {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 