"use server";
import { connectDB } from "../lib/db";
import Order from "../models/order";

// Helper function to serialize order data
const serializeOrder = (order) => {
  if (!order) return null;
  
  // Convert to plain object and handle all ObjectIds
  const serialized = {
    _id: order._id.toString(),
    orderId: order.orderId,
    userId: order.userId.toString(),
    items: order.items.map(item => ({
      _id: item._id.toString(),
      productId: item.productId.toString(),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image
    })),
    shippingAddress: {
      firstName: order.shippingAddress.firstName,
      lastName: order.shippingAddress.lastName,
      email: order.shippingAddress.email,
      address: order.shippingAddress.address,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      zipCode: order.shippingAddress.zipCode,
      country: order.shippingAddress.country
    },
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    tax: Number(order.tax),
    total: Number(order.total),
    trackingNumber: order.trackingNumber,
    estimatedDelivery: order.estimatedDelivery,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
  
  return serialized;
};

// Get all orders for a user
export const getUserOrders = async (userId) => {
  try {
    await connectDB();
    console.log('Fetching orders for user:', userId);
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name price image');
    
    console.log('Found orders:', orders.length);
    return orders.map(serializeOrder);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Get a single order by ID
export const getOrderById = async (orderId) => {
  try {
    await connectDB();
    const order = await Order.findById(orderId)
      .populate('items.productId', 'name price image');
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return serializeOrder(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    await connectDB();
    console.log('Creating order with data:', orderData);
    
    // Generate orderId
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderId = `ORD${year}${month}${day}${random}`;
    
    // Format the data before creating
    const formattedData = {
      ...orderData,
      orderId,
      items: orderData.items.map(item => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity)
      })),
      subtotal: Number(orderData.subtotal),
      shipping: Number(orderData.shipping),
      tax: Number(orderData.tax),
      total: Number(orderData.total)
    };
    
    // Create order with formatted data
    const order = await Order.create(formattedData);
    
    console.log('Order created successfully:', order.orderId);
    return serializeOrder(order);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return serializeOrder(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (orderId, status) => {
  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: status },
      { new: true }
    );
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return serializeOrder(order);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Add tracking number
export const addTrackingNumber = async (orderId, trackingNumber) => {
  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        trackingNumber,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      { new: true }
    );
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return serializeOrder(order);
  } catch (error) {
    console.error('Error adding tracking number:', error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    await connectDB();
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Only allow cancellation of orders in 'processing' status
    if (order.orderStatus !== 'processing') {
      throw new Error('Only processing orders can be cancelled');
    }

    // Update order status to cancelled
    order.orderStatus = 'cancelled';
    await order.save();
    
    return serializeOrder(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}; 