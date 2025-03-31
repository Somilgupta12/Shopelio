import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

// Define the product schema
const productSchema = new mongoose.Schema({
  productName: String,
  productPrice: Number,
  category: String,
  price: Number,
  description: String,
  image: String,
  reviews: [String],
  rating: Number,
});

// Get the Product model
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Sample products data
const sampleProducts = [
  // Electronics products
  {
    productName: "Latest Smartphone",
    price: 799.99,
    category: "Electronics",
    description: "The latest smartphone with advanced features and high-performance specs.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
    rating: 4.5
  },
  {
    productName: "Wireless Headphones",
    price: 149.99,
    category: "Electronics",
    description: "Premium wireless headphones with noise cancellation and long battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.3
  },
  {
    productName: "Smart Watch",
    price: 299.99,
    category: "Electronics",
    description: "Feature-packed smartwatch with health monitoring and app connectivity.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80",
    rating: 4.2
  },
  {
    productName: "Laptop Pro",
    price: 1299.99,
    category: "Electronics",
    description: "High-performance laptop for professionals and gamers.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    rating: 4.7
  },
  
  // Fashion products
  {
    productName: "Designer T-Shirt",
    price: 49.99,
    category: "Fashion",
    description: "Premium cotton t-shirt with modern design.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    rating: 4.1
  },
  {
    productName: "Slim Fit Jeans",
    price: 79.99,
    category: "Fashion",
    description: "Comfortable slim fit jeans for everyday wear.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
    rating: 4.4
  },
  {
    productName: "Leather Jacket",
    price: 199.99,
    category: "Fashion",
    description: "Classic leather jacket with modern styling.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
    rating: 4.6
  },
  
  // Home & Living products
  {
    productName: "Modern Coffee Table",
    price: 249.99,
    category: "Home & Living",
    description: "Stylish coffee table for your living room.",
    image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    rating: 4.3
  },
  {
    productName: "Cozy Throw Blanket",
    price: 39.99,
    category: "Home & Living",
    description: "Soft and warm throw blanket for your home.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80",
    rating: 4.8
  },
  {
    productName: "Ceramic Dinner Set",
    price: 89.99,
    category: "Home & Living",
    description: "Complete dinner set for your dining table.",
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    rating: 4.5
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    
    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      count: sampleProducts.length 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 