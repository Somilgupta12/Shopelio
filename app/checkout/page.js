"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../actions/order.action';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, getCartTotals, clearCart, isLoaded } = useCart();
  const { user } = useAuth();
  const { subtotal, shipping, tax, total } = getCartTotals();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit_card',
    upiId: '',
    notes: '',
    isCashOnDelivery: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const checkAuthAndCart = () => {
      // Redirect to login if user is not authenticated
      if (!user || !user._id) {
        router.push('/login');
        toast.error('Please login to continue with checkout');
        return;
      }

      // Redirect to cart if cart is empty
      if (isLoaded && cart.length === 0 && !orderComplete) {
        router.push('/cart');
        toast.error('Your cart is empty. Add some products before checkout.');
      }
    };

    checkAuthAndCart();
  }, [user, isLoaded, cart.length, orderComplete, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for payment method
    if (name === 'paymentMethod') {
      if (value === 'cod') {
        setFormData(prev => ({
          ...prev,
          paymentMethod: 'credit_card', // Use valid enum value
          isCashOnDelivery: true, // Set flag
          // Clear card fields when switching to COD
          cardName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          paymentMethod: value,
          isCashOnDelivery: false
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Payment validation based on payment method
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    // Skip card validation if Cash on Delivery is selected
    if (formData.paymentMethod === 'credit_card' && !formData.isCashOnDelivery) {
      if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Expiry date must be in MM/YY format';
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    } else if (formData.paymentMethod === 'upi') {
      if (!formData.upiId.trim()) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!/^[\w\d.-]+@[\w\d.-]+$/.test(formData.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Adjust form data before validation if needed
    let formDataToValidate = formData;
    
    // For Cash on Delivery, we don't need to validate card fields
    if (formData.isCashOnDelivery) {
      // We've already cleared these fields in the handleChange function
      // Just making sure before validation
      formDataToValidate = {
        ...formData,
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      };
    }
    
    // Set the adjusted data to state to ensure consistent UI
    if (formData.isCashOnDelivery) {
      setFormData(formDataToValidate);
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    if (!user || !user._id) {
      toast.error('Please login to continue with checkout');
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order object
      const orderData = {
        userId: user._id,
        items: cart.map(item => ({
          productId: item._id,
          name: item.name || item.productName,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        notes: formData.notes || '',
        isCashOnDelivery: formData.isCashOnDelivery
      };

      console.log('Creating order with data:', orderData);
      
      // Create order in database
      const result = await createOrder(orderData);
      
      if (!result || result.error) {
        throw new Error(result?.error || 'Failed to create order');
      }
      
      // Store order details for summary
      setOrderDetails(result);
      setOrderId(result.orderId);
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      setOrderComplete(true);
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(error.message || 'Failed to process your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-green-100 rounded-full p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                Order Confirmed!
              </h2>
              
              <div className="space-y-6">
                {/* Order ID */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-lg font-semibold text-gray-900">{orderId}</p>
                </div>

                {/* Payment Method */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Method</h3>
                  <p className="text-gray-600">
                    {orderDetails?.paymentMethod === 'credit_card' && !orderDetails?.isCashOnDelivery && 'Credit/Debit Card'}
                    {orderDetails?.paymentMethod === 'upi' && 'UPI Payment'}
                    {(orderDetails?.isCashOnDelivery || 
                     (formData.isCashOnDelivery)) && 'Cash on Delivery'}
                  </p>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <p className="text-gray-600">
                    {orderDetails?.shippingAddress?.firstName} {orderDetails?.shippingAddress?.lastName}<br />
                    {orderDetails?.shippingAddress?.address}<br />
                    {orderDetails?.shippingAddress?.city}, {orderDetails?.shippingAddress?.state} {orderDetails?.shippingAddress?.zipCode}<br />
                    {orderDetails?.shippingAddress?.country}
                  </p>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {orderDetails?.items?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{orderDetails?.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">₹{orderDetails?.shipping?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹{orderDetails?.tax?.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-semibold text-gray-900">₹{orderDetails?.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h3>
                  <p className="text-blue-700">
                    You will receive an order confirmation email shortly. You can track your order status in your account.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/orders"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    View Orders
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
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
            onClick={() => router.push('/cart')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              {/* Shipping Information */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary-600" />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.city ? 'border-red-500' : ''}`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.state ? 'border-red-500' : ''}`}
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.zipCode ? 'border-red-500' : ''}`}
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
                  Payment Information
                </h2>
                
                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Credit Card Option */}
                    <div 
                      className={`border rounded-lg p-4 flex items-center cursor-pointer ${formData.paymentMethod === 'credit_card' && !formData.isCashOnDelivery ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
                      onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'credit_card' } })}
                    >
                      <input
                        type="radio"
                        id="credit_card"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'credit_card' && !formData.isCashOnDelivery}
                        onChange={() => {}}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="credit_card" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                        Credit/Debit Card
                      </label>
                    </div>
                    
                    {/* UPI Option */}
                    <div 
                      className={`border rounded-lg p-4 flex items-center cursor-pointer ${formData.paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
                      onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'upi' } })}
                    >
                      <input
                        type="radio"
                        id="upi"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={() => {}}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                        UPI
                      </label>
                    </div>
                    
                    {/* Cash on Delivery Option */}
                    <div 
                      className={`border rounded-lg p-4 flex items-center cursor-pointer ${formData.isCashOnDelivery ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
                      onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'cod' } })}
                    >
                      <input
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        checked={formData.isCashOnDelivery}
                        onChange={() => {}}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                  {errors.paymentMethod && (
                    <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>
                  )}
                </div>
                
                {/* Credit Card Form - Only display when credit card is selected */}
                {formData.paymentMethod === 'credit_card' && !formData.isCashOnDelivery && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.cardName ? 'border-red-500' : ''}`}
                      />
                      {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.cardNumber ? 'border-red-500' : ''}`}
                      />
                      {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.expiryDate ? 'border-red-500' : ''}`}
                      />
                      {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="XXX"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.cvv ? 'border-red-500' : ''}`}
                      />
                      {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                    </div>
                  </div>
                )}
                
                {/* UPI Form - Only display when UPI is selected */}
                {formData.paymentMethod === 'upi' && (
                  <div className="mt-4">
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="example@upi"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.upiId ? 'border-red-500' : ''}`}
                    />
                    {errors.upiId && <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>}
                  </div>
                )}
                
                {/* Cash on Delivery - No additional fields needed */}
                {formData.isCashOnDelivery && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                    <p className="text-sm text-yellow-700">
                      You will pay in cash at the time of delivery. Please keep the exact amount ready.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="flow-root mb-6">
                <ul className="-my-4 divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item._id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
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
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-sm font-medium text-gray-900">
                            <h3>{item.productName}</h3>
                            <p className="ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price Details */}
              <div className="mt-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₹{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Shipping</p>
                  <p>₹{shipping.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Tax</p>
                  <p>₹{tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg font-medium text-gray-900">
                  <p>Total</p>
                  <p>₹{total.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Security Note */}
              <div className="mt-6 flex items-center text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                <p>Your payment information is processed securely. We do not store credit card details.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 